interface TTSButtonProps {
  onClick: () => void
  isPlaying: boolean
  size?: 'sm' | 'md'
  className?: string
}

function TTSButton({ onClick, isPlaying, size = 'md', className = '' }: TTSButtonProps) {
  const iconSize = size === 'sm' ? 14 : 18
  const padding = size === 'sm' ? 'p-1' : 'p-1.5'

  return (
    <button
      onClick={onClick}
      className={`${padding} rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-all ${className}`}
      aria-label={isPlaying ? 'Stop reading' : 'Read aloud'}
    >
      {isPlaying ? (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  )
}

export default TTSButton
