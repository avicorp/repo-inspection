import { useState, useEffect, useCallback, useRef } from 'react'
import type { TTSSettings } from '../types'
import { loadTTSSettings, saveTTSSettings } from '../lib/indexedDB'

const DEFAULT_SETTINGS: TTSSettings = {
  speed: 1.0,
  volume: 1.0,
  pitch: 1.0,
  voiceURI: null,
}

interface TTSState {
  isPlaying: boolean
  isPaused: boolean
  currentElementId: string | null
  progress: number
  settings: TTSSettings
  voices: SpeechSynthesisVoice[]
}

export function useTTS(topicSlug: string, language: string = 'en') {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentElementId: null,
    progress: 0,
    settings: DEFAULT_SETTINGS,
    voices: [],
  })

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const settingsLoadedRef = useRef(false)
  const elementsRef = useRef<Array<{ id: string; text: string }>>([])
  const currentIndexRef = useRef(0)

  // Load voices
  useEffect(() => {
    function loadVoices() {
      const allVoices = speechSynthesis.getVoices()
      const filtered = allVoices.filter(v => v.lang.startsWith(language))
      const ranked = filtered.sort((a, b) => {
        const rank = (v: SpeechSynthesisVoice) => {
          const name = v.name.toLowerCase()
          if (name.includes('natural')) return 0
          if (name.includes('enhanced')) return 1
          if (name.includes('premium')) return 2
          return 3
        }
        return rank(a) - rank(b)
      })
      setState(prev => ({ ...prev, voices: ranked.length > 0 ? ranked : allVoices }))
    }

    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [language])

  // Load settings from IndexedDB
  useEffect(() => {
    if (settingsLoadedRef.current) return
    settingsLoadedRef.current = true

    async function load() {
      const topicSettings = await loadTTSSettings(topicSlug).catch(() => null)
      if (topicSettings) {
        setState(prev => ({ ...prev, settings: topicSettings }))
        return
      }
      const globalSettings = await loadTTSSettings('global').catch(() => null)
      if (globalSettings) {
        setState(prev => ({ ...prev, settings: globalSettings }))
      }
    }
    load()
  }, [topicSlug])

  const persistSettings = useCallback((updated: TTSSettings) => {
    saveTTSSettings(topicSlug, updated).catch(console.error)
  }, [topicSlug])

  const stop = useCallback(() => {
    speechSynthesis.cancel()
    utteranceRef.current = null
    elementsRef.current = []
    currentIndexRef.current = 0
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentElementId: null,
      progress: 0,
    }))

    document.querySelectorAll('.tts-highlight').forEach(el => {
      el.classList.remove('tts-highlight')
    })
  }, [])

  const speakText = useCallback((text: string, elementId: string, onEnd?: () => void) => {
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = state.settings.speed
    utterance.volume = state.settings.volume
    utterance.pitch = state.settings.pitch
    utterance.lang = language

    if (state.settings.voiceURI) {
      const voice = state.voices.find(v => v.voiceURI === state.settings.voiceURI)
      if (voice) utterance.voice = voice
    } else if (state.voices.length > 0) {
      utterance.voice = state.voices[0]
    }

    const el = document.querySelector(`[data-tts-id="${elementId}"]`)
    if (el) el.classList.add('tts-highlight')

    utterance.onend = () => {
      if (el) el.classList.remove('tts-highlight')
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentElementId: null,
        progress: 0,
      }))
      onEnd?.()
    }

    utterance.onerror = () => {
      if (el) el.classList.remove('tts-highlight')
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentElementId: null,
        progress: 0,
      }))
    }

    utteranceRef.current = utterance
    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      currentElementId: elementId,
    }))

    speechSynthesis.speak(utterance)
  }, [state.settings, state.voices, language])

  const speak = useCallback((text: string, elementId: string) => {
    if (state.isPlaying && state.currentElementId === elementId) {
      if (state.isPaused) {
        speechSynthesis.resume()
        setState(prev => ({ ...prev, isPaused: false }))
      } else {
        speechSynthesis.pause()
        setState(prev => ({ ...prev, isPaused: true }))
      }
      return
    }
    speakText(text, elementId)
  }, [state.isPlaying, state.isPaused, state.currentElementId, speakText])

  const speakAll = useCallback((elements: Array<{ id: string; text: string }>) => {
    if (elements.length === 0) return
    elementsRef.current = elements
    currentIndexRef.current = 0

    function speakNext() {
      const idx = currentIndexRef.current
      if (idx >= elementsRef.current.length) {
        stop()
        return
      }
      const item = elementsRef.current[idx]
      setState(prev => ({ ...prev, progress: idx / elementsRef.current.length }))
      currentIndexRef.current = idx + 1
      speakText(item.text, item.id, speakNext)
    }

    speakNext()
  }, [speakText, stop])

  const setSpeed = useCallback((speed: number) => {
    const clamped = Math.min(2, Math.max(0.5, speed))
    setState(prev => {
      const updated = { ...prev.settings, speed: clamped }
      persistSettings(updated)
      return { ...prev, settings: updated }
    })
  }, [persistSettings])

  const setVolume = useCallback((volume: number) => {
    setState(prev => {
      const updated = { ...prev.settings, volume }
      persistSettings(updated)
      return { ...prev, settings: updated }
    })
  }, [persistSettings])

  const setPitch = useCallback((pitch: number) => {
    setState(prev => {
      const updated = { ...prev.settings, pitch }
      persistSettings(updated)
      return { ...prev, settings: updated }
    })
  }, [persistSettings])

  const setVoice = useCallback((voiceURI: string | null) => {
    setState(prev => {
      const updated = { ...prev.settings, voiceURI }
      persistSettings(updated)
      return { ...prev, settings: updated }
    })
  }, [persistSettings])

  const preview = useCallback(() => {
    const sampleText = language === 'he' ? '\u05DB\u05DA \u0410\u043D\u0438 \u05E0\u05E9\u05DE\u05E2' : 'This is how I sound'
    speakText(sampleText, '__preview__')
  }, [language, speakText])

  return {
    ...state,
    speak,
    speakAll,
    stop,
    setSpeed,
    setVolume,
    setPitch,
    setVoice,
    preview,
  }
}
