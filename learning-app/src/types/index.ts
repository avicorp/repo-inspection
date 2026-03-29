export interface QuizScore {
  total: number
  correct: number
  breakdown: {
    easy: [number, number]
    medium: [number, number]
    hard: [number, number]
  }
}

export interface TopicProgress {
  learningStatus: boolean
  quizStatus: boolean
  lastScore: QuizScore | null
  subtopicStatus: Record<string, 'completed' | 'in-progress' | 'not-started'>
  lastVisited: string | null
}

export interface TTSSettings {
  speed: number
  volume: number
  pitch: number
  voiceURI: string | null
}

export interface AppState {
  topics: TopicMeta[]
  topicProgress: Record<string, TopicProgress>
}

export interface TopicMeta {
  slug: string
  name: string
  subtopics: string[]
}
