import { useEffect } from 'react'

interface TTSKeyboardOptions {
  isPlaying: boolean
  isPaused: boolean
  speak: (text: string, elementId: string) => void
  stop: () => void
  setSpeed: (speed: number) => void
  settings: { speed: number }
}

export function useTTSKeyboard(options: TTSKeyboardOptions) {
  const { isPlaying, isPaused, stop, setSpeed, settings } = options

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
        return
      }

      switch (e.key) {
        case ' ':
          if (isPlaying) {
            e.preventDefault()
            if (isPaused) {
              speechSynthesis.resume()
            } else {
              speechSynthesis.pause()
            }
          }
          break
        case 'Escape':
          stop()
          break
        case ']':
          setSpeed(Math.round((settings.speed + 0.1) * 10) / 10)
          break
        case '[':
          setSpeed(Math.round((settings.speed - 0.1) * 10) / 10)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, isPaused, stop, setSpeed, settings.speed])
}
