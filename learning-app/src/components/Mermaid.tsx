import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#f97316',
    primaryTextColor: '#f3f4f6',
    primaryBorderColor: '#f97316',
    lineColor: '#6b7280',
    secondaryColor: '#1f2937',
    tertiaryColor: '#111827',
  },
})

let mermaidId = 0

function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const id = `mermaid-${++mermaidId}`
    mermaid.render(id, chart).then(({ svg }) => {
      if (ref.current) {
        ref.current.innerHTML = svg
      }
    }).catch(() => {
      if (ref.current) {
        ref.current.innerHTML = `<pre class="text-red-400 text-sm">${chart}</pre>`
      }
    })
  }, [chart])

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto bg-gray-900/50 rounded-lg p-4 border border-gray-800"
    />
  )
}

export default Mermaid
