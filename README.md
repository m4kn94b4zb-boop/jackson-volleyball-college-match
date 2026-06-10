# Jackson Volleyball College Match App

This is a local-save React/Vite app for building a men's college volleyball recruiting list.

## What it does

- Ranks D3 colleges using a fit score algorithm
- Saves player profile, preferences, favorites, notes, and email progress on the computer using localStorage
- No backend, no Supabase, no login
- Includes editable coach email drafts with vertical, academics, and coach references
- Lets you add custom schools

## How to run locally

```bash
npm install
npm run dev
```

## How to deploy on Vercel

1. Upload this folder to GitHub
2. Import the GitHub repo into Vercel
3. Framework preset: Vite
4. Build command: npm run build
5. Output directory: dist

## Important

Data is saved in the browser on that computer. If you clear browser storage or use a different computer/browser, the saved favorites and notes will not be there.
