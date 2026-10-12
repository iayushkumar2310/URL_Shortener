# Snip URL Shortener

A focused full-stack URL shortener MVP. Paste a long HTTP(S) link, save a unique short code in PostgreSQL, then redirect through the code with HTTP 302.

## Stack

- Frontend: React, TypeScript, Vite
- API: Node.js, Express, TypeScript
- Storage: PostgreSQL with Prisma
- Local services: Docker Compose for PostgreSQL

## Get started

Requirements: Node.js 20.19+ (or 22.12+) and Docker Desktop (or another PostgreSQL 17 instance).

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and adjust values if needed. The included values are only for local development.
3. Start PostgreSQL using `docker compose up -d db`.
4. Create/update the database schema with `npm run db:push`.
5. Start the API and frontend together with `npm run dev`.
6. Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The redirect links are served by the API at `http://localhost:3000`.

Use `npm run build`, `npm run lint`, and `npm test` for verification. Prisma Studio is available with `npm run db:studio`.

## API

- `POST /api/shorten` — JSON body `{ "url": "https://example.com/path" }`; returns a short URL. Only HTTP and HTTPS URLs are accepted.
- `GET /:code` — redirects with 302 or shows a friendly 404 page if the code is unknown or expired.
- `GET /health` — API health check.

The database model is `urls(id, code, original_url, created_at, expires_at)`. Random seven-character Base62 codes are protected by a unique database constraint; collisions are retried.

## Scope

### MVP must-haves

- Responsive form to submit a URL and copy the resulting short link.
- Validated `POST /api/shorten` endpoint and persistent URL storage.
- 302 redirect lookup and a clean not-found page.
- Local environment example, linting, tests, and build scripts.

### Nice-to-haves / future phases

- Accounts, dashboard, custom aliases, expiry controls and password-protected links.
- Click analytics with asynchronous event handling.
- Redis caching/rate limiting, abuse reporting, CAPTCHA and malicious-link screening.
- QR codes, public API keys, bulk tools, custom domains, CI/CD and deployment monitoring.

These are intentionally not part of the initial MVP. Before a public launch, add abuse prevention, domain/redirect safeguards, production HTTPS, operational monitoring, and privacy review.

## Repository layout

- `frontend/` — React user interface
- `backend/` — Express API, Prisma schema, and short-code tests
- `.env.example` — local configuration template (copy to ignored `.env`)
- `docker-compose.yml` — local PostgreSQL service
