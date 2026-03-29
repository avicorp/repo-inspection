import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'

interface NavbarProps {
  onToggleSidebar: () => void
}

function Navbar({ onToggleSidebar }: NavbarProps) {
  const { topic } = useParams<{ topic: string }>()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
          <Link to="/" className="text-lg font-bold text-orange-400 hover:text-orange-300 transition-colors">
            Learning Hub
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-orange-300 hover:bg-gray-800 transition-colors"
          >
            Topics
          </Link>
          <Link
            to="/quiz-status"
            className="px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-orange-300 hover:bg-gray-800 transition-colors"
          >
            Quiz
          </Link>
          {topic && (
            <Link
              to={`/${topic}/quiz`}
              className="px-3 py-1.5 rounded-lg text-sm text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 transition-colors"
            >
              Take Quiz
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen
              ? <path d="M5 5l10 10M15 5L5 15" />
              : <path d="M3 6h14M3 10h14M3 14h14" />
            }
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-gray-900/95 px-4 py-3 flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-orange-300 hover:bg-gray-800 transition-colors"
          >
            Topics
          </Link>
          <Link
            to="/quiz-status"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-orange-300 hover:bg-gray-800 transition-colors"
          >
            Quiz Status
          </Link>
          {topic && (
            <Link
              to={`/${topic}/quiz`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-orange-400 hover:bg-orange-500/10 transition-colors"
            >
              Take Quiz
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
