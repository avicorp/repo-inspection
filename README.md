# Learning Hub

An interactive learning platform that generates structured educational content from GitHub repositories and web research, then serves it as a React app with quizzes, text-to-speech, and progress tracking.

## Topics

| Topic | Subtopics | Quiz Questions | Source |
|-------|-----------|----------------|--------|
| **OWASP Top 10:2025** | 9 | 65 | [OWASP/Top10](https://github.com/OWASP/Top10) repo + web research |
| **Claude Code** | 9 | 60+ | [anthropics/claude-code](https://github.com/anthropics/claude-code) repo |

### OWASP Top 10:2025

Covers all 10 categories of the 2025 edition plus deep dives into:

- OWASP Top 10 for LLM Applications (prompt injection, data poisoning, etc.)
- Broken Access Control (IDOR, SSRF, CSRF, privilege escalation)
- Injection Attacks (SQL injection, XSS, command injection with code examples)
- Supply Chain Security (SBOMs, CI/CD hardening, SolarWinds/Log4Shell case studies)
- Modern Authentication & Cryptography (TLS, JWT, MFA, post-quantum crypto)

### Claude Code

Repository analysis and feature deep dives covering CLI features, plugin development, agent orchestration, and contribution patterns.

## Project Structure

```
.
├── knowledge/                # Source content and quizzes
│   ├── LearningDNA.md        # Learner profile (shapes all generated content)
│   ├── owasp-top10/
│   │   ├── sources/           # Markdown learning content (9 files)
│   │   └── quizzes/           # Quiz questions (JSON)
│   └── claude-code/
│       ├── sources/
│       └── quizzes/
└── learning-app/              # React + Vite + TypeScript app
    ├── src/
    │   ├── components/        # UI (Navbar, Sidebar, Mermaid, TTS, Markdown)
    │   ├── pages/             # Routes (Home, TopicHome, TopicDetail, Quiz)
    │   ├── contexts/          # React Context for learning state
    │   ├── hooks/             # IndexedDB, TTS hooks
    │   ├── data/              # Compiled topic + quiz JSON
    │   └── lib/               # IndexedDB utilities
    └── public/
```

## Quick Start

```bash
# Install dependencies
cd learning-app && npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open the URL shown in the terminal (default: http://localhost:5173).

## How It Works

1. **Knowledge Base** (`knowledge/`) contains structured Markdown content and quiz JSON files. Content is shaped by the learner profile in `LearningDNA.md`.

2. **Data Pipeline** — Markdown sources are converted to JSON and imported by the React app at build time.

3. **Learning App** (`learning-app/`) renders the content with:
   - Markdown rendering with syntax highlighting
   - Mermaid diagram support
   - Text-to-speech (browser TTS API)
   - Quiz engine with difficulty levels (easy/medium/hard)
   - Progress tracking via IndexedDB (persists across sessions)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Markdown | react-markdown + remark-gfm |
| Diagrams | Mermaid |
| Storage | IndexedDB (client-side progress) |

## Adding a New Topic

1. Create `knowledge/<topic>/sources/` and `knowledge/<topic>/quizzes/quiz-bank.json`
2. Add Markdown files to `sources/` — each becomes a subtopic
3. Register the topic in `learning-app/src/data/topics-registry.ts`
4. Run `npm run build` to verify

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

Content in `knowledge/` references third-party material (OWASP, etc.) under their respective licenses. OWASP content is [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/).
