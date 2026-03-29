#!/usr/bin/env node
/**
 * Parses knowledge markdown files and quiz bank into JSON for the learning app.
 * Usage: node scripts/parse-knowledge.mjs <topic>
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const topic = process.argv[2] || 'claude-code';
const knowledgeDir = join('..', 'knowledge', topic);
const sourcesDir = join(knowledgeDir, 'sources');
const quizzesDir = join(knowledgeDir, 'quizzes');
const outDir = join('src', 'data');

// Parse all markdown source files
const files = readdirSync(sourcesDir).filter(f => f.endsWith('.md'));
const topics = files.map(file => {
  const slug = basename(file, '.md');
  const content = readFileSync(join(sourcesDir, file), 'utf-8');
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;
  return { slug, title, content };
});

writeFileSync(
  join(outDir, `${topic}-topics.json`),
  JSON.stringify(topics, null, 2)
);
console.log(`Wrote ${topics.length} topics to ${outDir}/${topic}-topics.json`);

// Copy quiz bank
const quizBank = readFileSync(join(quizzesDir, 'quiz-bank.json'), 'utf-8');
writeFileSync(join(outDir, `${topic}-quizzes.json`), quizBank);
console.log(`Wrote quizzes to ${outDir}/${topic}-quizzes.json`);
