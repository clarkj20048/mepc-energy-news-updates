# MEPC News Updates Backend (Express API)

## Run
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and update values.
4. `npm start`
5. Open `http://localhost:3000`

## Admin Login
- Endpoint: `POST /api/auth/login`
- First run uses `.env` values (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) and stores a bcrypt hash in `data/admin.json`.

## Sync News Images From Source URLs
- Uses each news item's `sourceUrl` and extracts `og:image` / `twitter:image`.
- Updates both backend and frontend news JSON files.

Commands:
- `npm run sync:images` (fills only missing `image` fields)
- `npm run sync:images:force` (replaces existing `image` fields too)

## Architecture
- `controllers/` request handling
- `routes/` route definitions
- `middleware/` auth, validation, and global errors
- `utils/` JSON file database helpers and format/sanitize utilities
- `data/news.json` local JSON database
