import { useState, useMemo, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicGroup, type QuizQuestion } from '../data/topics-registry'
import { useLearning } from '../contexts/LearningContext'
import type { QuizScore } from '../types'

const DIFFICULTY_COLORS = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  hard: 'text-red-400 bg-red-400/10 border-red-400/30',
}

function Quiz() {
  const { topic: topicId, subtopic } = useParams<{ topic: string; subtopic: string }>()
  const group = topicId ? getTopicGroup(topicId) : undefined
  const allQuestions = (group?.quizzes ?? []) as QuizQuestion[]
  const { updateQuizScore } = useLearning()
  const scoreSavedRef = useRef(false)

  const questions = useMemo(() => {
    const filtered = subtopic
      ? allQuestions.filter(q => q.id.includes(subtopic))
      : allQuestions
    return [...filtered].sort(() => Math.random() - 0.5)
  }, [subtopic, allQuestions])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [correctByDifficulty, setCorrectByDifficulty] = useState({ easy: 0, medium: 0, hard: 0 })
  const [totalByDifficulty, setTotalByDifficulty] = useState({ easy: 0, medium: 0, hard: 0 })

  const backLink = topicId ? `/${topicId}` : '/'

  if (!group || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-400">No questions found</h1>
        <Link to={backLink} className="text-orange-400 hover:text-orange-300 mt-4 inline-block">
          &larr; Back to topics
        </Link>
      </div>
    )
  }

  const isComplete = currentIndex >= questions.length
  const question = !isComplete ? questions[currentIndex] : null

  useEffect(() => {
    if (isComplete && topicId && !scoreSavedRef.current && answered > 0) {
      scoreSavedRef.current = true
      const quizScore: QuizScore = {
        total: answered,
        correct: score,
        breakdown: {
          easy: [correctByDifficulty.easy, totalByDifficulty.easy],
          medium: [correctByDifficulty.medium, totalByDifficulty.medium],
          hard: [correctByDifficulty.hard, totalByDifficulty.hard],
        },
      }
      updateQuizScore(topicId, quizScore)
    }
  }, [isComplete, topicId, answered, score, correctByDifficulty, totalByDifficulty, updateQuizScore])

  function handleAnswer(index: number) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
    setAnswered(a => a + 1)
    const diff = question!.difficulty
    setTotalByDifficulty(prev => ({ ...prev, [diff]: prev[diff] + 1 }))
    if (index === question!.correctIndex) {
      setScore(s => s + 1)
      setCorrectByDifficulty(prev => ({ ...prev, [diff]: prev[diff] + 1 }))
    }
  }

  function handleNext() {
    setCurrentIndex(i => i + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  function handleRestart() {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setAnswered(0)
    setCorrectByDifficulty({ easy: 0, medium: 0, hard: 0 })
    setTotalByDifficulty({ easy: 0, medium: 0, hard: 0 })
    scoreSavedRef.current = false
  }

  if (isComplete) {
    const pct = Math.round((score / answered) * 100)
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
        <div className="text-6xl font-bold mb-2 text-orange-400">{pct}%</div>
        <p className="text-gray-400 mb-8 text-lg">
          {score} correct out of {answered} questions
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
          <Link
            to={backLink}
            className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
          >
            Back to Topics
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Link to={backLink} className="text-sm text-gray-500 hover:text-orange-400 transition-colors">
          &larr; Back
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Score: {score}/{answered}</span>
          <span>Question {currentIndex + 1}/{questions.length}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <span className={`text-xs px-2 py-1 rounded border ${DIFFICULTY_COLORS[question!.difficulty]}`}>
          {question!.difficulty}
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-100">
        {question!.question}
      </h2>

      <div className="grid gap-3 mb-6">
        {question!.options.map((option, i) => {
          let borderClass = 'border-gray-800 hover:border-gray-600'
          let bgClass = 'bg-gray-900/50'

          if (selectedAnswer !== null) {
            if (i === question!.correctIndex) {
              borderClass = 'border-green-500'
              bgClass = 'bg-green-500/10'
            } else if (i === selectedAnswer) {
              borderClass = 'border-red-500'
              bgClass = 'bg-red-500/10'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`text-left p-4 rounded-lg border ${borderClass} ${bgClass} transition-all ${
                selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="text-gray-400 font-mono text-sm mr-3">
                {String.fromCharCode(65 + i)}.
              </span>
              <span className="text-gray-200">{option}</span>
            </button>
          )
        })}
      </div>

      {showExplanation && (
        <div className="mb-6 p-5 rounded-lg border border-gray-700 bg-gray-900/70">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            Explanation
          </h3>
          <p className="text-gray-300 leading-relaxed">{question!.explanation}</p>
        </div>
      )}

      {selectedAnswer !== null && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
          >
            {currentIndex + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Quiz
