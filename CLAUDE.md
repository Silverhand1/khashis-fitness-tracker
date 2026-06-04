# Khashi's Fitness Tracker

## Project
A PWA fitness tracker for logging workouts and meals. Installable on iPhone via Safari "Add to Home Screen".

## Tech Stack
- React 18 + Vite
- Plain CSS Variables (no framework)
- localStorage for persistence
- Vercel (Hosting)

## Folder Structure
- src/ — React components and logic
- public/ — static assets, manifest.json, icons
- dist/ — production build output

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally

## Coding Conventions
- Functional components + hooks only, no class components
- No TypeScript — plain JavaScript
- Keep everything in as few files as possible (simple app)
- CSS via inline styles + CSS variables (matching existing design system)
- No UI libraries — custom only
- `localStorage` for all persistence (replaces `window.storage` from Claude artifact)
