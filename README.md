# Top Solutions

Top Solutions is a Vite + React + TypeScript web app for collecting and estimating technological solutions.

## Stack

- Vite
- React
- TypeScript
- react-router-dom
- @tanstack/react-query
- react-markdown
- Tailwind CSS
- json-server

## Getting Started

Install dependencies:

```bash
npm install
```

Run frontend and backend together:

```bash
npm run dev:full
```

Or run separately:

```bash
npm run dev
npm run api
```

Frontend runs on `http://localhost:5173` and API runs on `http://localhost:3001`.

## Features

- Email-only login persisted in localStorage.
- Auto user creation in `db.json` when email is not found.
- Shared solutions list for all users.
- Create, view, and edit solutions (author-only edit).
- Markdown description with live preview.
- Multi-category assignment with predefined and custom categories.
- Effort estimates for Front-end, Back-end, Mobile, DevOps, and Design (default `0h`).
- Creation and last update timestamps.
