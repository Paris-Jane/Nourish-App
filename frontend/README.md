# Nourish Frontend

Warm, cookbook-inspired React frontend for the Nourish meal planning app.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- TanStack Query
- Zustand
- Axios
- React Hook Form + Zod

## Important note about auth

This frontend is intentionally set up in a `preview mode` by default.

Why:

- the backend currently protects most routes with JWT auth
- you asked to avoid implementing login/auth for now
- preview mode lets you open and test the UI without signing in every time

Current behavior:

- protected routes allow access when preview mode is enabled
- `/login` exists as a styled placeholder and offers `Continue in preview mode`
- the app uses typed API modules, but query hooks fall back to local preview data if the backend rejects requests

When you are ready to implement real auth, use:

- [AUTH_IMPLEMENTATION_PROMPT.md](/Users/parisward/Nourish/frontend/AUTH_IMPLEMENTATION_PROMPT.md)

## Project structure

```text
frontend/
  src/
    api/
    components/
    hooks/
    lib/
    pages/
    store/
    types/
```

## Setup

1. Install dependencies:

```bash
cd /Users/parisward/Nourish/frontend
npm install
```

2. Start the frontend:

```bash
npm run dev
```

3. Optional: run the backend at `http://localhost:5000`.

Even if the backend is not fully ready, the UI will still render in preview mode with fallback data.

## Notes on backend alignment

The frontend types and API modules were aligned to the current backend DTOs and endpoints in `MealPlanner.Api`.

Known gaps between the original frontend brief and the current backend:

- `/api/recipes/analyze` does not exist yet
- ingredient search is client-side right now because the backend only exposes `GET /api/ingredients`
- saved weeks live under `/api/weeks/saved`
- most data endpoints currently require auth on the backend

## Next recommended steps

1. Install dependencies and run a local build.
2. Decide whether preview mode should stay as a dev-only feature.
3. Implement real auth and remove the fallback route bypass when ready.
4. Connect the remaining write mutations page-by-page.
