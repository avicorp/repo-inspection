# Contributing

Thanks for your interest in contributing to Learning Hub! Here's how to get started.

## Ways to Contribute

- **Add a new learning topic** — research a subject, write content, and generate quizzes
- **Improve existing content** — fix errors, add examples, update outdated information
- **Enhance the app** — UI improvements, new features, accessibility fixes
- **Report issues** — found a bug or inaccuracy? Open an issue

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/repo-inspection.git
   cd repo-inspection
   ```
3. Install dependencies:
   ```bash
   cd learning-app && npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Adding a New Topic

1. Create the knowledge directory:
   ```
   knowledge/<topic-name>/
   ├── sources/
   │   ├── overview.md
   │   └── <subtopic>.md
   └── quizzes/
       └── quiz-bank.json
   ```

2. Write Markdown content in `sources/`. Each file becomes a subtopic. Use:
   - H1 for the title
   - H2/H3 for sections
   - Mermaid code blocks for diagrams
   - Code blocks with language tags for syntax highlighting

3. Create quiz questions in `quiz-bank.json`:
   ```json
   {
     "id": "<topic>-<subtopic>-<number>",
     "topicSlug": "<topic>",
     "question": "Your question?",
     "options": ["Option A", "Option B", "Option C", "Option D"],
     "correctIndex": 0,
     "explanation": "Why this answer is correct",
     "difficulty": "easy"
   }
   ```

4. Register the topic in `learning-app/src/data/topics-registry.ts`

5. Verify the build:
   ```bash
   cd learning-app && npm run build
   ```

## Content Guidelines

- Write for professionals who are new to the subject
- Explain terminology before using it
- Include real-world examples alongside theory
- Use mermaid diagrams for visual concepts
- Provide code examples in multiple languages where relevant
- Quiz questions should test understanding, not trivia

## Pull Requests

1. Create a feature branch: `git checkout -b add-topic-kubernetes`
2. Make your changes and verify the build passes
3. Commit with a clear message describing what and why
4. Push and open a PR against `main`

Keep PRs focused — one topic or one feature per PR.

## Code Style

- TypeScript for all app code
- Functional React components with hooks
- Tailwind CSS for styling
- No `any` types unless absolutely necessary

## Reporting Issues

Open a GitHub issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce (if applicable)
- Browser/OS if it's a UI issue
