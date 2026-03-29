import { Link } from 'react-router-dom'
import { topicGroups } from '../data/topics-registry'
import { useLearning } from '../contexts/LearningContext'

function QuizStatus() {
  const { getTopicProgress } = useLearning()

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Quiz Status</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Track your quiz progress across all courses.
        </p>
      </div>

      <div className="grid gap-4">
        {topicGroups.map((group) => {
          const progress = getTopicProgress(group.id)
          const lastScore = progress.lastScore

          return (
            <div
              key={group.id}
              className="p-5 rounded-lg border border-gray-800 bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-100">{group.name}</h2>
                <span className="text-sm text-gray-500">
                  {group.quizzes.length} questions
                </span>
              </div>

              {lastScore ? (
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-orange-400">
                      {lastScore.correct}/{lastScore.total}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({Math.round((lastScore.correct / lastScore.total) * 100)}%)
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="text-green-400">
                      Easy: {lastScore.breakdown.easy[0]}/{lastScore.breakdown.easy[1]}
                    </span>
                    <span className="text-yellow-400">
                      Medium: {lastScore.breakdown.medium[0]}/{lastScore.breakdown.medium[1]}
                    </span>
                    <span className="text-red-400">
                      Hard: {lastScore.breakdown.hard[0]}/{lastScore.breakdown.hard[1]}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">Not attempted yet</p>
              )}

              <Link
                to={`/${group.id}/quiz`}
                className="inline-block px-4 py-2 rounded-lg text-sm bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                {lastScore ? 'Retake Quiz' : 'Take Quiz'}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuizStatus
