## MEPC Energy News Updates

Clean frontend-backend split:
- Frontend: React SPA (`frontend`) handles UI rendering, page routing, form interactions, and API calls.
- Backend: Express API (`backend`) handles sessions/auth, validation, article extraction, and JSON storage.

## Corrected structure

```text
MEPC-Energy-News-Updates-main/
+-- server.js
+-- package.json
+-- backend/
|   +-- server.js
|   +-- routes/
|   |   +-- apiRoutes.js
|   +-- controllers/
|   |   +-- apiController.js
|   +-- middleware/
|   |   +-- errorMiddleware.js
|   |   +-- validationMiddleware.js
|   +-- data/
|   |   +-- news.json
|   |   +-- admin.json
|   +-- utils/
|   +-- scripts/
|   +-- package.json
|   +-- README.md
+-- frontend/
|   +-- src/
|   |   +-- pages/
|   |   +-- components/
|   |   +-- api/
|   |   +-- utils/
|   +-- dist/
|   +-- package.json
+-- README.md
```

## What changed

- Backend now serves API endpoints only under `/api`.
- Backend no longer performs server-side EJS rendering for home/news/admin pages.
- Frontend app is served as static SPA (`frontend/dist`) with catch-all route to `index.html`.
- API errors now return JSON (instead of EJS error templates).
- Root entry point added (`server.js`) so app starts from project root.
- Root `package.json` now contains required backend dependencies and start scripts.

## Run

```bash
npm install
node server.js
```

Server runs at: `http://localhost:3000`

## Frontend/backend responsibilities

- Frontend (`frontend/src`):
  - Client-side routes (`react-router-dom`)
  - DOM/UI rendering
  - Form handling
  - `fetch()` API calls (`frontend/src/api/client.js`)
- Backend (`backend`):
  - API routes/controllers
  - Auth/session enforcement
  - Validation and slug generation
  - Read/write JSON data in `backend/data`
