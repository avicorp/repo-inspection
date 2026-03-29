import { useState, useEffect, useRef } from 'react'
import { initDB } from '../lib/indexedDB'

export function useIndexedDB() {
  const [isReady, setIsReady] = useState(false)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    initDB()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.warn('IndexedDB unavailable, using in-memory state:', err)
        setIsReady(true)
      })
  }, [])

  return { isReady }
}
