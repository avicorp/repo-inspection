# Learning App

The frontend application for Learning Hub. Built with React 19, TypeScript, Vite 8, and Tailwind CSS 4.

## Development

```bash
npm install
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx        # App shell (navbar + sidebar + footer)
│   ├── Navbar.tsx        # Top navigation
│   ├── Sidebar.tsx       # Topic navigation sidebar
│   ├── MarkdownRenderer  # Renders markdown with syntax highlighting
│   ├── Mermaid.tsx       # Renders mermaid diagrams
│   ├── TTSReader.tsx     # Text-to-speech panel
│   └── TTSButton.tsx     # TTS toggle button
├── pages/            # Route components
│   ├── Home.tsx          # Landing page with topic list
│   ├── TopicHome.tsx     # Topic overview with subtopic list
│   ├── TopicDetail.tsx   # Individual subtopic content
│   ├── Quiz.tsx          # Quiz interface
│   └── QuizStatus.tsx    # Quiz results and progress
├── contexts/         # React Context
│   └── LearningContext   # Global learning state (current topic, progress)
├── hooks/            # Custom hooks
│   ├── useIndexedDB      # Persisted progress storage
│   ├── useTTS            # Text-to-speech controls
│   └── useTTSKeyboard    # TTS keyboard shortcuts
├── data/             # Compiled content
│   ├── topics-registry   # Topic group definitions and imports
│   └── *-topics.json     # Content JSON per topic group
├── lib/              # Utilities
│   └── indexedDB.ts      # IndexedDB wrapper
└── types/            # TypeScript type definitions
```

## Data Flow

1. Markdown content lives in `knowledge/<topic>/sources/*.md`
2. At build time, content is imported as JSON via `data/topics-registry.ts`
3. React components render markdown, mermaid diagrams, and quizzes
4. User progress (completed topics, quiz scores) is stored in IndexedDB
