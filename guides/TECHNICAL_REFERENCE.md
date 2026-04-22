# Technical Reference

This guide captures the technical stack, deployment direction, and current implementation state.

## Preferred Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod

### Backend

- .NET 8 Web API
- Minimal APIs
- Entity Framework Core
- PostgreSQL
- JWT auth
- BCrypt password hashing

### Optional / adjacent services

- Cloudflare R2 for image storage
- LLM API for AI-assisted recipe entry
- OCR service later for receipt scanning

## Deployment Direction

### Original low-cost deployment idea

The original early-stage deployment recommendation was:

- Vercel for frontend
- Railway for .NET API
- Railway Postgres for database

Why:

- close to existing familiarity
- cheap or free for early testing
- avoids needing Supabase unless specifically desired
- keeps backend in .NET

### Current deployment direction

The frontend has been deployed to Vercel.

The likely full-stack production path now is:

- Vercel for frontend
- Azure App Service for the .NET API
- Azure Database for PostgreSQL Flexible Server for the database

This fits the current stack and the Azure student plan.

## Frontend Development Approach

The frontend does not need to wait for the backend to be complete.

### Recommended approach

- define API interfaces early
- create mock API responses
- use realistic seed/mock data
- switch to real API later with an env flag

This allows parallel frontend and backend development.

## Current Build Direction

As of the latest development decisions in this repo:

- backend exists in `.NET`
- frontend exists as a React/Vite app
- frontend is currently set up to be testable without forcing real auth every session
- real auth/login is deferred until later

This is aligned with the current testing goal and should be treated as an intentional staging choice, not a permanent product behavior.

## Near-Term Technical Priorities

- make the backend fully deployment-ready
- generate and seed a strong ingredient dataset before relying on production Postgres
- move frontend API configuration off localhost and into environment variables
- deploy backend and database
- wire real auth when ready
