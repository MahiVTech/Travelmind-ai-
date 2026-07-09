# TravelMind AI (front-end prototype)

## What this repository actually contains

This is a **single-page front-end prototype** — one React component
(`src/App.jsx`) containing the entire app: dashboard, AI-style brief,
Safety Hub with scoring, hidden-places discovery feed, food
recommendations, cab guidance, a mock itinerary generator, and a
documents vault. Everything is client-side, in-memory, and uses
rule-based logic over a hand-authored dataset of 40 destinations —
there is no live model call, no database, and no backend.

## What this repository does NOT contain (yet)

The original product spec described a full stack: Node/Express API,
PostgreSQL + Prisma, Redis, Socket.IO, Clerk/Firebase auth, Supabase
storage, and real Gemini/OpenAI calls. **None of that has been built.**
This repo is only the front-end layer, scaffolded so it can run as a
real Vite project instead of living only inside a chat artifact.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## File tree

```
travelmind-ai/
├── README.md
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

## Notes on `App.jsx`

- Unchanged from the version already shared in the conversation —
  copied verbatim, not rewritten.
- Fonts (Fraunces / Inter / IBM Plex Mono) are loaded at runtime via a
  Google Fonts `<link>` injected in a `useEffect`, so no local font
  files are bundled.
- Uses `lucide-react` for icons. An earlier version of this project
  used `recharts` for budget charts, but the current `App.jsx` does
  not include a budget/charts tab, so `recharts` is not listed as a
  dependency here.
