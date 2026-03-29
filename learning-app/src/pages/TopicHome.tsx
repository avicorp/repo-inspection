import { Link, useParams } from 'react-router-dom'
import { getTopicGroup } from '../data/topics-registry'
import { useLearning } from '../contexts/LearningContext'

function TopicHome() {
  const { topic: topicId } = useParams<{ topic: string }>()
  const group = topicId ? getTopicGroup(topicId) : undefined
  const { getTopicProgress } = useLearning()

  if (!group) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-400">Course not found</h1>
        <Link to="/" className="text-orange-400 hover:text-orange-300 mt-4 inline-block">
          &larr; Back to courses
        </Link>
      </div>
    )
  }

  const progress = getTopicProgress(group.id)

  const sorted = [...group.topics].sort((a, b) => {
    const ai = group.order.indexOf(a.slug)
    const bi = group.order.indexOf(b.slug)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  return (
    <div>
      <Link to="/" className="text-sm text-gray-500 hover:text-orange-400 transition-colors mb-6 inline-block">
        &larr; All courses
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">{group.name}</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          {group.description} {group.topics.length} topics, {group.quizzes.length} quiz questions.
        </p>
      </div>

      <div className="grid gap-4">
        {sorted.map((topic, i) => {
          const subtopicQuizCount = group.quizzes.filter(q =>
            q.id.includes(topic.slug)
          ).length
          const status = progress.subtopicStatus[topic.slug] ?? 'not-started'
          return (
            <Link
              key={topic.slug}
              to={`/${topicId}/${topic.slug}`}
              className="block p-5 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-orange-500/50 hover:bg-gray-900 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-orange-400/60 text-sm font-mono mt-1 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 text-left">
                  <h2 className="text-lg font-semibold text-gray-100 group-hover:text-orange-300 transition-colors">
                    {topic.title}
                  </h2>
                  <div className="flex gap-3 mt-1">
                    {subtopicQuizCount > 0 && (
                      <span className="text-xs text-gray-500">
                        {subtopicQuizCount} quiz questions
                      </span>
                    )}
                    {status !== 'not-started' && (
                      <span className={`text-xs ${status === 'completed' ? 'text-green-400' : 'text-orange-400'}`}>
                        {status === 'completed' ? 'Completed' : 'In progress'}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-600 group-hover:text-orange-400 transition-colors mt-1">
                  &rarr;
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 p-5 rounded-lg border border-gray-800 bg-gray-900/30">
        <Link
          to={`/${topicId}/quiz`}
          className="flex items-center justify-between group"
        >
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-100 group-hover:text-orange-300 transition-colors">
              Take the Quiz
            </h2>
            <p className="text-sm text-gray-500">
              Test your knowledge across all {group.quizzes.length} questions
            </p>
          </div>
          <span className="text-2xl text-gray-600 group-hover:text-orange-400 transition-colors">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  )
}

export default TopicHome
