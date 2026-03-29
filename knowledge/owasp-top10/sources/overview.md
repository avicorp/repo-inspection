# OWASP Top 10 — Repository Knowledge Base

Overview of knowledge extracted from [OWASP/Top10](https://github.com/OWASP/Top10).

The OWASP Top 10 is the most widely recognized standard awareness document for web application security. The 2025 edition (8th installment) was released on December 24, 2025, based on data from 2.8 million+ applications tested by 13+ data contributors. It maps 248 CWEs across 10 categories, with 8 categories data-driven and 2 community-voted.

## OWASP Top 10:2025 at a Glance

| # | Category | CWEs | Key Change from 2021 |
|---|----------|------|---------------------|
| A01 | Broken Access Control | 40 | Holds #1; SSRF rolled in |
| A02 | Security Misconfiguration | 16 | Up from #5 to #2 |
| A03 | Software Supply Chain Failures | 6 | **New** — expands "Vulnerable Components" |
| A04 | Cryptographic Failures | 32 | Down from #2 to #4 |
| A05 | Injection | 37 | Down from #3 to #5; includes XSS |
| A06 | Insecure Design | 39 | Down from #4 to #6; improvements noted |
| A07 | Authentication Failures | 36 | Renamed for accuracy |
| A08 | Software or Data Integrity Failures | 14 | Clarifying name change |
| A09 | Security Logging & Alerting Failures | 5 | Renamed to emphasize alerting |
| A10 | Mishandling of Exceptional Conditions | 24 | **New** category for 2025 |

## Subtopics

### From Repository Inspection
1. [Repo Goals & Architecture](repo-goals.md) — purpose, design, technologies, and the full OWASP Top 10:2025 breakdown
2. [Recent Changes](recent-changes.md) — commit activity, release process, and focus areas
3. [PR Review Insights](pr-reviews.md) — code review patterns, contributor dynamics, and quality themes

### Web Research Subtopics
4. [OWASP Top 10 for LLMs](owasp-llm-top10.md) — the OWASP Top 10 for Large Language Model Applications (prompt injection, data poisoning, insecure output handling, and more)
5. [Broken Access Control Deep Dive](broken-access-control.md) — A01 in depth: IDOR, path traversal, CSRF, SSRF, privilege escalation with real-world examples and code
6. [Injection Attacks Deep Dive](injection-attacks.md) — A05 in depth: SQL injection, XSS, command injection, template injection with prevention patterns
7. [Supply Chain Security](supply-chain-security.md) — A03 in depth: SBOMs, dependency tracking, CI/CD hardening, real-world attack case studies
8. [Modern Authentication & Cryptography](auth-and-crypto.md) — A04+A07 combined: TLS, password hashing, JWT security, MFA, post-quantum cryptography
