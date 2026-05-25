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
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

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
