# Memvora UI

Memvora is an AI-powered memory vault for saving, searching, and reasoning over personal context. The frontend is a polished React application that lets users capture memories from notes, links, files, and screenshots, then use AI Chat and summaries to retrieve what matters later.

This UI is designed to feel like a real product: fast onboarding, guest access, screenshot paste support, compact memory browsing, grounded AI Chat, lazy memory detail loading, and a mobile-first desktop/mobile experience.

## Product Capabilities

- Create a personal memory vault with Supabase email/password auth.
- Continue as guest when email confirmation is unavailable or rate-limited.
- Save notes, pasted text, public links, PDFs, TXT/Markdown files, and screenshots.
- Paste screenshots directly into the upload panel.
- Upload PNG, JPG/JPEG, and WebP images.
- View recent uploads in a compact accordion-style memory list.
- Expand a memory to lazy-load and inspect extracted text, OCR output, or saved link context.
- Reopen saved screenshot previews from expanded memories when the backend has stored `image_data_url`.
- Open screenshots in a full-screen viewer with a close button.
- Edit and delete memories from the UI.
- Filter uploads by all time, last 1 week, last 2 weeks, and last 1 month.
- Ask questions and search memories through AI Chat.
- Use a bottom-right floating AI chatbox on desktop.
- Use a bottom-sheet mobile chat layout on smaller screens.
- See grounded AI sources when chat answers are based on saved memories.
- Generate a formatted Thoughts Summary with themes, details, open questions, and next actions.
- Re-summarize after new memories are added.
- Show friendly UX states for loading, empty memories, rate limits, and provider failures.

## Tech Stack

| Layer | Technology | Why It Matters |
| --- | --- | --- |
| Framework | React 19 | Modern component-based UI architecture. |
| Build tool | Vite | Fast local development and optimized production builds. |
| Language | TypeScript | Safer frontend code with typed API contracts. |
| Routing | React Router | Clean page navigation for auth and app screens. |
| Auth client | Supabase JS | Browser-side login, signup, session refresh, and anonymous auth. |
| API client | Axios | Typed and centralized communication with the FastAPI backend. |
| Styling | Tailwind CSS | Responsive, consistent UI without heavy custom CSS. |
| Icons | lucide-react | Clean product-grade iconography. |
| Deployment | Railway-compatible static preview | Simple production deployment for the built React app. |

## User Experience

Memvora's frontend is organized around daily capture and retrieval:

1. The user signs in or starts a guest session.
2. The dashboard opens directly into the memory workspace.
3. The upload panel accepts notes, files, links, or pasted screenshots.
4. Recent uploads stay compact by default and expand only when needed.
5. Full memory content and screenshot previews load only when a memory is opened, keeping dashboard API responses fast.
6. Screenshot memories display previews when the backend has stored the image data.
7. The chatbox sits collapsed at the bottom-right on desktop and becomes a bottom sheet on mobile.
8. AI answers include source context, helping the user trust where the answer came from.

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Notes:

- `VITE_API_URL` points to the deployed FastAPI backend.
- `VITE_APP_URL` is the canonical frontend URL used for Supabase email confirmation and password reset redirects.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safe browser-side Supabase values.
- Never place backend secrets in frontend env. Do not expose `SUPABASE_SERVICE_KEY`, `GEMINI_API_KEY`, or `OPENROUTER_API_KEY` here.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app will run at:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

- `npm run dev`: start the Vite development server.
- `npm run build`: type-check and create a production build.
- `npm run preview`: serve the production build locally or on Railway.

## Backend Contract

The frontend expects the backend to provide:

- `GET /me`
- `GET /memories`
- `GET /memories/{memory_id}`
- `POST /upload`
- `PUT /memories/{memory_id}`
- `DELETE /memories/{memory_id}`
- `POST /chat`
- `POST /summary`

`GET /search` may still exist on the backend for API-level retrieval, but the UI uses AI Chat as the primary search and ask workflow.

Screenshot previews depend on this optional memory field:

```ts
image_data_url?: string | null
```

If the backend/database does not provide `image_data_url`, the UI still works and shows OCR text only.

## Supabase Auth Setup

In Supabase Dashboard:

1. Go to **Authentication -> URL Configuration**.
2. Set **Site URL** to the deployed Memvora UI URL.
3. Add the deployed Memvora UI URL to **Redirect URLs**.
4. Add `http://localhost:5173` for local development.
5. Enable anonymous sign-ins if guest mode should work.

For polished confirmation emails:

1. Go to **Authentication -> Emails / Templates**.
2. Update the confirmation subject to `Confirm your Memvora account`.
3. Replace Supabase-branded copy with Memvora-branded copy.
4. Configure custom SMTP if you want a branded sender domain.

## Railway Deployment

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

Deployment checklist:

- Set `VITE_API_URL` to the deployed backend URL.
- Set `VITE_APP_URL` to the deployed frontend URL.
- Set Supabase URL and anon key.
- Ensure the backend `CORS_ORIGINS` includes the exact deployed frontend URL.
- Ensure Supabase Auth redirect URLs include the deployed frontend URL.

## Production Notes

- Screenshot full-screen preview works for screenshots saved after the backend/database image-preview update.
- Older screenshots remain searchable by OCR/fallback text but cannot show the original image because it was not previously stored.
- Memory cards lazy-load details before expanding, editing, or opening a saved screenshot preview.
- The standalone Semantic Search panel has been removed; AI Chat is the single retrieval workflow.
- Guest sessions are useful for demos, but signed-in accounts are better for durable personal memory.
- AI provider failures are surfaced as friendly messages rather than browser alerts.

## Repository

Frontend repository: `IshitaGupta-IG/memvora-ui`
