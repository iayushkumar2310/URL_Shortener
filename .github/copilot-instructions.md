# URL Shortener Project Notes

- This repo uses a React + TypeScript + Vite frontend and an Express + TypeScript API in separate `frontend/` and `backend/` workspaces.
- PostgreSQL is accessed through Prisma. Keep schema changes in `backend/prisma/schema.prisma` and run the documented database push step.
- Redirects use HTTP 302. Short codes are random Base62 and must remain unique; rely on the database unique constraint and retry collisions.
- Validate all submitted destinations as HTTP(S), keep secrets out of source control, and update `.env.example` when adding configuration.
- Verify changes with `npm run lint`, `npm test`, and `npm run build` from the repository root when applicable.
- Features beyond the create-and-redirect MVP (accounts, analytics, custom aliases, Redis, CAPTCHA, and deployment) should stay out of scope unless requested.
