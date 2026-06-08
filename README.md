# Memvora UI

React frontend for Memvora, a modern AI memory vault.

GitHub repository: `IshitaGupta-IG/memvora-ui`

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

`VITE_APP_URL` is the canonical frontend URL used in Supabase email confirmation and password reset links. In local development this is usually `http://localhost:5173`; in Railway it should be the deployed Memvora UI URL.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Product Features

- Forgot password and password reset flow through Supabase Auth.
- Paste screenshots into Add Memory; the backend uses Gemini to extract text and context.
- Save readable public links, including article/blog/social post URLs, as searchable memories.
- My Uploads filters for all memories, last 1 week, last 2 weeks, and last 1 month.
- Thoughts Summary uses the backend AI endpoint to summarize recent memories.

## Deployment on Railway

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

Add the frontend environment variables in Railway before deploying.

## Guest Sign In

Memvora supports temporary guest access through Supabase anonymous auth. Enable it in Supabase before using the "Continue as guest" button:

Supabase Dashboard -> Authentication -> Sign In / Providers -> Anonymous sign-ins.

If anonymous auth is disabled, the UI falls back to a temporary generated email/password account. That fallback only works when Supabase email confirmation is disabled for temporary demo accounts.

## Supabase Confirmation Email Branding

Email confirmation is sent by Supabase when a user registers. The frontend sets the confirmation redirect back to Memvora and sends `app_name: "Memvora"` as signup metadata.

To make the email itself show Memvora:

1. Supabase Dashboard -> Authentication -> Emails / Templates.
2. Update the confirmation email subject to `Confirm your Memvora account`.
3. Update the template copy to use the Memvora name.
4. Supabase Dashboard -> Authentication -> URL Configuration.
5. Set Site URL to your deployed Memvora UI URL.
6. Add your deployed Memvora UI URL to Redirect URLs.
7. For local testing, add `http://localhost:5173` to Redirect URLs and set `VITE_APP_URL=http://localhost:5173`.

If you want the From address to use your domain instead of Supabase's default mailer, configure custom SMTP in Supabase.
