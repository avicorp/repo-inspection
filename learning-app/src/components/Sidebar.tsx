import { Link, useParams } from 'react-router-dom'
import { getTopicGroup } from '../data/topics-registry'
import { useLearning } from '../contexts/LearningContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function StatusIcon({ status }: { status: 'completed' | 'in-progress' | 'not-started' }) {
  if (status === 'completed') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" className="text-green-400 shrink-0">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (status === 'in-progress') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" className="text-orange-400 shrink-0">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1a7 7 0 0 1 0 14" fill="currentColor" opacity="0.3" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-600 shrink-0">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { topic: topicId, subtopic: activeSubtopic } = useParams<{ topic: string; subtopic: string }>()
  const { getTopicProgress } = useLearning()

  const group = topicId ? getTopicGroup(topicId) : undefined
  const progress = topicId ? getTopicProgress(topicId) : null

  const sorted = group
    ? [...group.topics].sort((a, b) => {
        const ai = group.order.indexOf(a.slug)
        const bi = group.order.indexOf(b.slug)
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      })
    : []

  const completedCount = progress
    ? Object.values(progress.subtopicStatus).filter(s => s === 'completed').length
    : 0
  const totalItems = sorted.length + 1
  const quizDone = progress?.quizStatus ? 1 : 0
  const overallPercent = totalItems > 0 ? Math.round(((completedCount + quizDone) / totalItems) * 100) : 0

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-[53px] left-0 bottom-0 z-40 w-[280px] bg-gray-900 border-r border-gray-800 overflow-y-auto transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {group ? (
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {group.name}
            </h2>

            <nav className="flex-1 space-y-1">
              {sorted.map(t => {
                const status = progress?.subtopicStatus[t.slug] ?? 'not-started'
                const isActive = activeSubtopic === t.slug
                return (
                  <Link
                    key={t.slug}
                    to={`/${topicId}/${t.slug}`}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-300 border border-orange-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100 border border-transparent'
                    }`}
                  >
                    <StatusIcon status={status} />
                    <span className="truncate">{t.title}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <Link
                to={`/${topicId}/quiz`}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <span>Quiz</span>
                <span className="text-xs text-gray-500">
                  {progress?.lastScore
                    ? `${progress.lastScore.correct}/${progress.lastScore.total}`
                    : 'Not attempted'}
                </span>
              </Link>

              {progress?.lastScore && (
                <div className="px-3 py-1 text-xs text-gray-500">
                  Easy: {progress.lastScore.breakdown.easy[0]}/{progress.lastScore.breakdown.easy[1]}
                  {' \u00B7 '}Med: {progress.lastScore.breakdown.medium[0]}/{progress.lastScore.breakdown.medium[1]}
                  {' \u00B7 '}Hard: {progress.lastScore.breakdown.hard[0]}/{progress.lastScore.breakdown.hard[1]}
                </div>
              )}

              <div className="mt-3 px-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{overallPercent}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300 rounded-full"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm text-gray-500">Select a topic to see navigation.</p>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
