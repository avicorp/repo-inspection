import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef, useCallback } from 'react'
import { getTopicGroup } from '../data/topics-registry'
import { useLearning } from '../contexts/LearningContext'
import { useTTS } from '../hooks/useTTS'
import { useTTSKeyboard } from '../hooks/useTTSKeyboard'
import MarkdownRenderer from '../components/MarkdownRenderer'
import TTSReader from '../components/TTSReader'

function TopicDetail() {
  const { topic: topicId, subtopic } = useParams<{ topic: string; subtopic: string }>()
  const group = topicId ? getTopicGroup(topicId) : undefined
  const topic = group?.topics.find(t => t.slug === subtopic)
  const { markSubtopicInProgress, markSubtopicComplete, setLastVisited, isLoaded } = useLearning()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const tts = useTTS(topicId ?? '', 'en')
  useTTSKeyboard(tts)

  useEffect(() => {
    if (topicId && subtopic && isLoaded) {
      markSubtopicInProgress(topicId, subtopic)
      setLastVisited(topicId, subtopic)
    }
  }, [topicId, subtopic, isLoaded, markSubtopicInProgress, setLastVisited])

  useEffect(() => {
    if (!isLoaded) return
    const sentinel = sentinelRef.current
    if (!sentinel || !topicId || !subtopic) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          markSubtopicComplete(topicId, subtopic)
          observer.disconnect()
        }
      },
      { threshold: 1.0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isLoaded, topicId, subtopic, markSubtopicComplete])

  const handleReadAll = useCallback(() => {
    const container = contentRef.current
    if (!container) return

    const elements: Array<{ id: string; text: string }> = []
    container.querySelectorAll('[data-tts-id]').forEach(el => {
      const id = el.getAttribute('data-tts-id')
      const text = el.textContent?.trim()
      if (id && text) {
        elements.push({ id, text })
      }
    })
    tts.speakAll(elements)
  }, [tts])

  if (!group || !topic) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-400">Topic not found</h1>
        <Link to={topicId ? `/${topicId}` : '/'} className="text-orange-400 hover:text-orange-300 mt-4 inline-block">
          &larr; Back to topics
        </Link>
      </div>
    )
  }

  const quizCount = group.quizzes.filter(q => q.id.includes(topic.slug)).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link to={`/${topicId}`} className="text-sm text-gray-500 hover:text-orange-400 transition-colors">
          &larr; Back to topics
        </Link>
        <div className="flex items-center gap-3">
          <TTSReader
            onReadAll={handleReadAll}
            onStop={tts.stop}
            isPlaying={tts.isPlaying}
            progress={tts.progress}
            settings={tts.settings}
            voices={tts.voices}
            onSpeedChange={tts.setSpeed}
            onVolumeChange={tts.setVolume}
            onPitchChange={tts.setPitch}
            onVoiceChange={tts.setVoice}
            onPreview={tts.preview}
          />
          {quizCount > 0 && (
            <Link
              to={`/${topicId}/quiz/${topic.slug}`}
              className="text-sm px-4 py-2 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors"
            >
              Take quiz ({quizCount} questions)
            </Link>
          )}
        </div>
      </div>
      <div ref={contentRef}>
        <MarkdownRenderer
          content={topic.content}
          ttsEnabled
          onTTSSpeak={tts.speak}
          ttsPlayingId={tts.currentElementId}
        />
      </div>
      <div ref={sentinelRef} className="h-px" />
    </div>
  )
}

export default TopicDetail
