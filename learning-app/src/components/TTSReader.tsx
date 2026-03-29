import { useState } from 'react'
import TTSButton from './TTSButton'

interface TTSReaderProps {
  onReadAll: () => void
  onStop: () => void
  isPlaying: boolean
  progress: number
  settings: {
    speed: number
    volume: number
    pitch: number
    voiceURI: string | null
  }
  voices: SpeechSynthesisVoice[]
  onSpeedChange: (speed: number) => void
  onVolumeChange: (volume: number) => void
  onPitchChange: (pitch: number) => void
  onVoiceChange: (voiceURI: string | null) => void
  onPreview: () => void
}

const SPEED_PRESETS = [
  { label: 'Slow & Clear', value: 0.7 },
  { label: 'Normal', value: 1.0 },
  { label: 'Fast', value: 1.5 },
  { label: 'Speed Reader', value: 2.0 },
]

function TTSReader({
  onReadAll,
  onStop,
  isPlaying,
  progress,
  settings,
  voices,
  onSpeedChange,
  onVolumeChange,
  onPitchChange,
  onVoiceChange,
  onPreview,
}: TTSReaderProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <TTSButton
          onClick={isPlaying ? onStop : onReadAll}
          isPlaying={isPlaying}
        />
        <span className="text-xs text-gray-500">
          {isPlaying ? 'Reading...' : 'Read All'}
        </span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          aria-label="TTS settings"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </div>

      {isPlaying && progress > 0 && (
        <div className="h-[3px] bg-gray-800 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {showSettings && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">TTS Settings</h3>

            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Speed Presets</label>
              <div className="flex flex-wrap gap-1">
                {SPEED_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => onSpeedChange(preset.value)}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                      Math.abs(settings.speed - preset.value) < 0.05
                        ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Speed ({settings.speed.toFixed(1)}x)</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Volume ({Math.round(settings.volume * 100)}%)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Pitch ({settings.pitch.toFixed(1)})</label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            {voices.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">Voice</label>
                <div className="flex gap-2">
                  <select
                    value={settings.voiceURI ?? ''}
                    onChange={(e) => onVoiceChange(e.target.value || null)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
                  >
                    <option value="">Default</option>
                    {voices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={onPreview}
                    className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-orange-400 hover:border-orange-500/30 transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-600">
              <p>Shortcuts: Space=play/pause, Esc=stop, ]/[=speed</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TTSReader
