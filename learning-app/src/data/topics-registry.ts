import claudeCodeTopics from './claude-code-topics.json'
import claudeCodeQuizzes from './claude-code-quizzes.json'

import owaspTop10Topics from './owasp-top10-topics.json'
import owaspTop10Quizzes from './owasp-top10-quizzes.json'

export interface Topic {
  slug: string
  title: string
  content: string
}

export interface QuizQuestion {
  id: string
  topicSlug: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface TopicGroup {
  id: string
  name: string
  description: string
  topics: Topic[]
  quizzes: QuizQuestion[]
  order: string[]
}

export const topicGroups: TopicGroup[] = [
{
    id: 'claude-code',
    name: 'Claude Code',
    description: 'A comprehensive guide for professionals contributing to the Claude Code repository.',
    topics: claudeCodeTopics as Topic[],
    quizzes: claudeCodeQuizzes as QuizQuestion[],
    order: [
      'overview',
      'repo-goals',
      'cli-features',
      'plugin-development',
      'repo-automation',
      'contributing',
      'pr-reviews',
      'changelog-roadmap',
      'recent-changes',
    ],
  },
  {
    id: 'owasp-top10',
    name: 'OWASP Top 10:2025',
    description: 'Web application security fundamentals — the 10 most critical risks, LLM security, injection, access control, supply chain, and cryptography.',
    topics: owaspTop10Topics as Topic[],
    quizzes: owaspTop10Quizzes as QuizQuestion[],
    order: [
      'overview',
      'repo-goals',
      'owasp-llm-top10',
      'broken-access-control',
      'injection-attacks',
      'supply-chain-security',
      'auth-and-crypto',
      'recent-changes',
      'pr-reviews',
    ],
  },
]

export function getTopicGroup(id: string): TopicGroup | undefined {
  return topicGroups.find(g => g.id === id)
}
