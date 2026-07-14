# TTS Console (React + Vite)

React/Vite version of the TTS Console frontend — same audio-console interface as the plain HTML version, rebuilt as a proper component-based app.

## Project structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Top-level state + layout
├── index.css                 # Design tokens + global styles
├── api/
│   └── ttsClient.js          # fetch wrapper (health, voices, synthesize)
├── hooks/
│   ├── useHealthStatus.js    # backend online/offline check
│   ├── useVoices.js          # voice list loader with fallback
│   └── useAudioAnalyser.js   # Web Audio graph for the waveform
├── components/
│   ├── TopBar.jsx
│   ├── ApiConfigPanel.jsx
│   ├── ScriptPanel.jsx       # textarea, controls, synthesize button
│   ├── Fader.jsx             # reusable range control
│   ├── PlaybackPanel.jsx     # transport controls, download
│   └── Waveform.jsx          # canvas visualizer
└── utils/
    └── format.js
```

## Setup

```bash
npm install
cp .env.example .env       # set VITE_API_BASE_URL to your deployed backend
npm run dev                # http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Configuring the backend URL

Two ways to point this at your backend:

1. **Build-time (recommended for deployment):** set `VITE_API_BASE_URL` in `.env` (see `.env.example`) or as an environment variable in your host's dashboard (Vercel/Netlify project settings).
2. **Runtime:** click "API endpoint" in the app itself and enter the URL — useful for quickly testing against a different backend without rebuilding.

## Deploying for free

This is a standard Vite app, so it deploys to any static host:

**Vercel** (recommended, zero config):
1. Push this project to GitHub
2. Import the repo at vercel.com → it auto-detects Vite
3. Add `VITE_API_BASE_URL` under Project Settings → Environment Variables
4. Deploy

**Netlify:**
1. Same GitHub push
2. New site from Git → build command `npm run build`, publish directory `dist`
3. Add `VITE_API_BASE_URL` under Site Settings → Environment Variables

Both have generous free tiers with no credit card required for this kind of static app.

## Note on CORS

Your backend's `CORS_ORIGINS` is currently `["*"]`. That's fine while testing, but once this frontend has a stable deployed URL, consider narrowing `CORS_ORIGINS` in the backend's `app/config.py` to just that URL.
