# Technical Reference

This guide captures the technical stack, deployment structure, and current implementation state.

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

## Deployment Structure

### Frontend

- Vercel
- React + TypeScript + Vite application

### Backend

- Azure App Service
- .NET 8 Web API

### Database

- Azure Database for PostgreSQL Flexible Server
- PostgreSQL application database

### Optional supporting services

- Cloudflare R2 for image storage later if needed
- LLM API for AI-assisted recipe entry later
- OCR service later for receipt scanning

## Deployment Status

- frontend deployed on Vercel
- backend not yet deployed
- production PostgreSQL not yet provisioned
- frontend API configuration still needs to move fully off localhost for production use

## Frontend Development Approach

The frontend can be developed independently of the backend.

### Current approach

- define API interfaces early
- create mock API responses
- use realistic seed/mock data
- switch to real API later with an env flag

This supports parallel frontend and backend development.

## Current Build Direction

As of the latest development decisions in this repo:

- backend exists in `.NET`
- frontend exists as a React/Vite app
- frontend is currently set up to be testable without forcing real auth every session
- real auth/login is deferred until later

This is an intentional staging choice for the current testing phase.

## Near-Term Technical Priorities

- make the backend fully deployment-ready
- generate and seed a strong ingredient dataset before relying on production Postgres
- move frontend API configuration off localhost and into environment variables
- deploy backend and database
- wire real auth when ready
