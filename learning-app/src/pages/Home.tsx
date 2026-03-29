import { Link } from 'react-router-dom'
import { topicGroups } from '../data/topics-registry'
import { useLearning } from '../contexts/LearningContext'

function Home() {
  const { getTopicProgress } = useLearning()

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Learning Hub</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Choose a course to start learning. Each course includes structured topics and interactive quizzes.
        </p>
      </div>

      <div className="grid gap-6">
        {topicGroups.map((group) => {
          const progress = getTopicProgress(group.id)
          const completedCount = Object.values(progress.subtopicStatus).filter(s => s === 'completed').length
          const totalSubtopics = group.topics.length
          const progressPct = totalSubtopics > 0 ? Math.round((completedCount / totalSubtopics) * 100) : 0

          return (
            <Link
              key={group.id}
              to={`/${group.id}`}
              className="block p-6 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-orange-500/50 hover:bg-gray-900 transition-all group"
            >
              <h2 className="text-xl font-semibold text-gray-100 group-hover:text-orange-300 transition-colors mb-2">
                {group.name}
              </h2>
              <p className="text-gray-400 text-sm mb-3">{group.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{group.topics.length} topics</span>
                <span>{group.quizzes.length} quiz questions</span>
                {progressPct > 0 && <span className="text-orange-400">{progressPct}% complete</span>}
                {progress.lastScore && (
                  <span className="text-orange-400">
                    Quiz: {progress.lastScore.correct}/{progress.lastScore.total}
                  </span>
                )}
              </div>
              {progress.lastVisited && (
                <p className="text-xs text-gray-600 mt-2">
                  Last visited: {progress.lastVisited}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home
