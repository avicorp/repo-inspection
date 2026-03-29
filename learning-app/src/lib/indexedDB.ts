import type { TopicProgress, QuizScore, TTSSettings } from '../types'

const DB_NAME = 'learningDNA'
const DB_VERSION = 1

let dbInstance: IDBDatabase | null = null

export function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not available'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('topicProgress')) {
        db.createObjectStore('topicProgress')
      }
      if (!db.objectStoreNames.contains('quizResults')) {
        db.createObjectStore('quizResults')
      }
      if (!db.objectStoreNames.contains('ttsSettings')) {
        db.createObjectStore('ttsSettings')
      }
    }

    request.onsuccess = () => {
      dbInstance = request.result
      migrateFromLocalStorage(dbInstance)
      resolve(dbInstance)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

function getStore(db: IDBDatabase, storeName: string, mode: IDBTransactionMode = 'readonly') {
  const tx = db.transaction(storeName, mode)
  return tx.objectStore(storeName)
}

export function loadTopicProgress(slug: string): Promise<TopicProgress | null> {
  return initDB().then(db => new Promise((resolve, reject) => {
    const request = getStore(db, 'topicProgress').get(slug)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  }))
}

export function saveTopicProgress(slug: string, progress: TopicProgress): Promise<void> {
  return initDB().then(db => new Promise((resolve, reject) => {
    const request = getStore(db, 'topicProgress', 'readwrite').put(progress, slug)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  }))
}

export function loadAllTopicProgress(): Promise<Record<string, TopicProgress>> {
  return initDB().then(db => new Promise((resolve, reject) => {
    const store = getStore(db, 'topicProgress')
    const result: Record<string, TopicProgress> = {}
    const request = store.openCursor()
    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        result[cursor.key as string] = cursor.value as TopicProgress
        cursor.continue()
      } else {
        resolve(result)
      }
    }
    request.onerror = () => reject(request.error)
  }))
}

export function loadQuizResults(slug: string): Promise<QuizScore[]> {
  return initDB().then(db => new Promise((resolve, reject) => {
    const request = getStore(db, 'quizResults').get(slug)
    request.onsuccess = () => resolve(request.result ?? [])
    request.onerror = () => reject(request.error)
  }))
}

export function saveQuizResult(slug: string, score: QuizScore): Promise<void> {
  return loadQuizResults(slug).then(existing => {
    return initDB().then(db => new Promise((resolve, reject) => {
      const updated = [...existing, score]
      const request = getStore(db, 'quizResults', 'readwrite').put(updated, slug)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    }))
  })
}

export function loadTTSSettings(slug: string): Promise<TTSSettings | null> {
  return initDB().then(db => new Promise((resolve, reject) => {
    const request = getStore(db, 'ttsSettings').get(slug)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  }))
}

export function saveTTSSettings(slug: string, settings: TTSSettings): Promise<void> {
  return initDB().then(db => new Promise((resolve, reject) => {
    const request = getStore(db, 'ttsSettings', 'readwrite').put(settings, slug)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  }))
}

function migrateFromLocalStorage(db: IDBDatabase): void {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('learningDNA-'))
    if (keys.length === 0) return

    const tx = db.transaction(['topicProgress', 'ttsSettings'], 'readwrite')
    const progressStore = tx.objectStore('topicProgress')
    const ttsStore = tx.objectStore('ttsSettings')

    for (const key of keys) {
      const value = localStorage.getItem(key)
      if (!value) continue

      try {
        const parsed = JSON.parse(value)
        if (key.startsWith('learningDNA-progress-')) {
          const slug = key.replace('learningDNA-progress-', '')
          progressStore.put(parsed, slug)
        } else if (key === 'learningDNA-tts-settings') {
          ttsStore.put(parsed, 'global')
        } else if (key.startsWith('learningDNA-tts-settings-')) {
          const slug = key.replace('learningDNA-tts-settings-', '')
          ttsStore.put(parsed, slug)
        }
      } catch {
        // Skip malformed entries
      }
    }

    tx.oncomplete = () => {
      for (const key of keys) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // localStorage unavailable, skip migration
  }
}
