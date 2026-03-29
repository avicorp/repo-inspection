import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import Mermaid from './Mermaid'
import TTSButton from './TTSButton'

interface MarkdownRendererProps {
  content: string
  ttsEnabled?: boolean
  onTTSSpeak?: (text: string, elementId: string) => void
  ttsPlayingId?: string | null
}

function MarkdownRenderer({ content, ttsEnabled, onTTSSpeak, ttsPlayingId }: MarkdownRendererProps) {
  const ttsIdCounter = useRef(0)

  function getNextTTSId() {
    return `tts-${ttsIdCounter.current++}`
  }

  function extractText(children: React.ReactNode): string {
    if (typeof children === 'string') return children
    if (Array.isArray(children)) return children.map(extractText).join('')
    if (children && typeof children === 'object' && 'props' in children) {
      return extractText((children as React.ReactElement<{ children?: React.ReactNode }>).props.children)
    }
    return String(children ?? '')
  }

  // Reset counter on each render so IDs are stable
  ttsIdCounter.current = 0

  const components: Components = {
    h1: ({ children }) => {
      const id = getNextTTSId()
      return (
        <div className="flex justify-between items-center mt-8 mb-4" data-tts-id={id}>
          <h1 className="text-3xl font-bold text-gray-100">{children}</h1>
          {ttsEnabled && onTTSSpeak && (
            <TTSButton
              onClick={() => onTTSSpeak(extractText(children), id)}
              isPlaying={ttsPlayingId === id}
            />
          )}
        </div>
      )
    },
    h2: ({ children }) => {
      const id = getNextTTSId()
      return (
        <div className="flex justify-between items-center mt-8 mb-3 border-b border-gray-800 pb-2" data-tts-id={id}>
          <h2 className="text-2xl font-semibold text-gray-200">{children}</h2>
          {ttsEnabled && onTTSSpeak && (
            <TTSButton
              onClick={() => onTTSSpeak(extractText(children), id)}
              isPlaying={ttsPlayingId === id}
            />
          )}
        </div>
      )
    },
    h3: ({ children }) => {
      const id = getNextTTSId()
      return (
        <div className="flex justify-between items-center mt-6 mb-2" data-tts-id={id}>
          <h3 className="text-xl font-semibold text-gray-300">{children}</h3>
          {ttsEnabled && onTTSSpeak && (
            <TTSButton
              onClick={() => onTTSSpeak(extractText(children), id)}
              isPlaying={ttsPlayingId === id}
              size="sm"
            />
          )}
        </div>
      )
    },
    h4: ({ children }) => (
      <h4 className="text-lg font-medium mt-4 mb-2 text-gray-300">{children}</h4>
    ),
    p: ({ children }) => {
      const id = getNextTTSId()
      return (
        <div className="group/p relative mb-4" data-tts-id={id}>
          <p className="leading-relaxed text-gray-300">{children}</p>
          {ttsEnabled && onTTSSpeak && (
            <TTSButton
              onClick={() => onTTSSpeak(extractText(children), id)}
              isPlaying={ttsPlayingId === id}
              size="sm"
              className="absolute top-0 right-0 opacity-0 group-hover/p:opacity-100 transition-opacity"
            />
          )}
        </div>
      )
    },
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc text-gray-300 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal text-gray-300 space-y-1">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-orange-400 hover:text-orange-300 underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-orange-500/50 pl-4 my-4 text-gray-400 italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-gray-800" />,
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-800/50">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="text-left px-4 py-2 border border-gray-700 text-gray-300 font-semibold">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 border border-gray-800 text-gray-400">{children}</td>
    ),
    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className || '')
      const text = String(children).replace(/\n$/, '')

      if (match?.[1] === 'mermaid') {
        return <Mermaid chart={text} />
      }

      if (match) {
        return (
          <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto mb-4">
            <code className="text-sm text-gray-300 font-mono">{text}</code>
          </pre>
        )
      }

      return (
        <code className="bg-gray-800 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      )
    },
    pre: ({ children }) => <>{children}</>,
    strong: ({ children }) => (
      <strong className="text-gray-100 font-semibold">{children}</strong>
    ),
  }

  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
