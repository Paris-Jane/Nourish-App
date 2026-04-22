Implement real authentication and authorization for the Nourish frontend in `/Users/parisward/Nourish/frontend`.

Context:

- The app currently runs in a deliberate preview mode so protected routes are accessible without logging in.
- Keep the visual design and current app structure intact.
- The backend base URL is `http://localhost:5000`.
- Backend auth endpoints already exist:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Most other backend endpoints require a JWT bearer token.

Goals:

1. Replace preview-mode route bypass with real protected routing.
2. Fully wire the `/login` page for both sign in and register flows.
3. Store the JWT, user info, and household ID in the Zustand `authStore` and localStorage.
4. Ensure the Axios interceptor sends the JWT on all authenticated requests.
5. After successful register:
   - save auth session
   - redirect to `/onboarding`
6. After successful login:
   - save auth session
   - redirect to `/`
7. Add logout support in the main app shell.
8. Gate `/onboarding` so it shows only until household preferences are set.
9. Remove or sharply limit preview fallback data so authenticated backend data is the primary source.
10. Add proper loading and error states for auth mutations.

Implementation details:

- Keep React Hook Form + Zod validation.
- Align the register payload with the real backend DTO in `MealPlanner.Api/DTOs/AuthDtos.cs`, which currently requires:
  - `displayName`
  - `email`
  - `password`
  - `age`
  - `sex`
  - `activityLevel`
  - `householdName`
  - `householdSize`
  - `timezone`
- Update the register form UI to collect any missing required backend fields in a user-friendly way.
- Keep `/login` as the public route.
- Protected routes should redirect unauthenticated users to `/login`.
- If the backend returns 401, clear the invalid session and redirect to `/login`.
- Make the onboarding flow persist household preferences through `PUT /api/households/{id}/preferences`.

Please also:

- remove any preview-only copy that suggests auth is disabled
- document the real auth flow in `frontend/README.md`
- keep the code TypeScript-safe and consistent with the existing folder structure
- run a build and fix any type errors before finishing
