import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { TopicProgress, QuizScore } from '../types'
import { loadAllTopicProgress, saveTopicProgress as dbSaveProgress } from '../lib/indexedDB'
import { useIndexedDB } from '../hooks/useIndexedDB'
import { topicGroups } from '../data/topics-registry'

function createDefaultProgress(topicId: string): TopicProgress {
  const group = topicGroups.find(g => g.id === topicId)
  const subtopicStatus: Record<string, 'completed' | 'in-progress' | 'not-started'> = {}
  if (group) {
    for (const t of group.topics) {
      subtopicStatus[t.slug] = 'not-started'
    }
  }
  return {
    learningStatus: false,
    quizStatus: false,
    lastScore: null,
    subtopicStatus,
    lastVisited: null,
  }
}

interface LearningContextValue {
  progress: Record<string, TopicProgress>
  isLoaded: boolean
  markSubtopicComplete: (topicSlug: string, subtopic: string) => void
  markSubtopicInProgress: (topicSlug: string, subtopic: string) => void
  updateQuizScore: (topicSlug: string, score: QuizScore) => void
  setLastVisited: (topicSlug: string, subtopic: string) => void
  getTopicProgress: (topicSlug: string) => TopicProgress
}

const LearningContext = createContext<LearningContextValue | null>(null)

export function LearningProvider({ children }: { children: ReactNode }) {
  const { isReady } = useIndexedDB()
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!isReady || loadedRef.current) return
    loadedRef.current = true

    loadAllTopicProgress()
      .then(data => {
        setProgress(data)
        setIsLoaded(true)
      })
      .catch(() => setIsLoaded(true))
  }, [isReady])

  const persist = useCallback((topicSlug: string, updated: TopicProgress) => {
    dbSaveProgress(topicSlug, updated).catch(console.error)
  }, [])

  const getTopicProgress = useCallback((topicSlug: string): TopicProgress => {
    return progress[topicSlug] ?? createDefaultProgress(topicSlug)
  }, [progress])

  const markSubtopicComplete = useCallback((topicSlug: string, subtopic: string) => {
    if (!loadedRef.current) return
    setProgress(prev => {
      const current = prev[topicSlug] ?? createDefaultProgress(topicSlug)
      const subtopicStatus = { ...current.subtopicStatus, [subtopic]: 'completed' as const }
      const allComplete = Object.values(subtopicStatus).every(s => s === 'completed')
      const updated: TopicProgress = {
        ...current,
        subtopicStatus,
        learningStatus: allComplete,
      }
      persist(topicSlug, updated)
      return { ...prev, [topicSlug]: updated }
    })
  }, [persist])

  const markSubtopicInProgress = useCallback((topicSlug: string, subtopic: string) => {
    if (!loadedRef.current) return
    setProgress(prev => {
      const current = prev[topicSlug] ?? createDefaultProgress(topicSlug)
      if (current.subtopicStatus[subtopic] === 'completed') return prev
      const updated: TopicProgress = {
        ...current,
        subtopicStatus: { ...current.subtopicStatus, [subtopic]: 'in-progress' },
      }
      persist(topicSlug, updated)
      return { ...prev, [topicSlug]: updated }
    })
  }, [persist])

  const updateQuizScore = useCallback((topicSlug: string, score: QuizScore) => {
    if (!loadedRef.current) return
    setProgress(prev => {
      const current = prev[topicSlug] ?? createDefaultProgress(topicSlug)
      const updated: TopicProgress = {
        ...current,
        quizStatus: true,
        lastScore: score,
      }
      persist(topicSlug, updated)
      return { ...prev, [topicSlug]: updated }
    })
  }, [persist])

  const setLastVisited = useCallback((topicSlug: string, subtopic: string) => {
    if (!loadedRef.current) return
    setProgress(prev => {
      const current = prev[topicSlug] ?? createDefaultProgress(topicSlug)
      const updated: TopicProgress = {
        ...current,
        lastVisited: subtopic,
      }
      persist(topicSlug, updated)
      return { ...prev, [topicSlug]: updated }
    })
  }, [persist])

  return (
    <LearningContext.Provider value={{
      progress,
      isLoaded,
      markSubtopicComplete,
      markSubtopicInProgress,
      updateQuizScore,
      setLastVisited,
      getTopicProgress,
    }}>
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning(): LearningContextValue {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}
