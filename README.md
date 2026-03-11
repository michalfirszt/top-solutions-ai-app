# Top Solutions

Top Solutions is a Vite + React + TypeScript web app for collecting and estimating technological solutions.

## Purpose

Top Solutions helps teams build a shared internal catalog of implementation-ready ideas and technical patterns.

The application is designed to:
- Document solutions in one place using clear titles and Markdown descriptions.
- Organize solutions by categories (for example Back-end, Mobile, Payments, Calendar, Authentication, Access Control).
- Estimate delivery effort across disciplines (Front-end, Back-end, Mobile, DevOps, Design).
- Keep ownership and history visible with author, creation date, and last update date.

This makes planning, discovery, and reuse of proven approaches faster across product and engineering teams.

## Stack

- Vite
- React
- TypeScript
- react-router-dom
- @tanstack/react-query
- react-markdown
- Tailwind CSS
- json-server

## Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm** (v9 or newer)

## Setup

1. **Clone the repository** (if you haven’t already):

   ```bash
   git clone <repository-url>
   cd top-solutions-ai-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. No environment variables or extra configuration are required. The app uses the default API base URL `http://localhost:3001`.

## How to start the application

**Option A – Frontend and API together (recommended):**

```bash
npm run dev:full
```

This starts the Vite dev server and the json-server API with one command.

**Option B – Run frontend and API separately:**

Terminal 1 – API (json-server):

```bash
npm run api
```

Terminal 2 – Frontend (Vite):

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API:** [http://localhost:3001](http://localhost:3001)

Open the frontend URL in your browser to use the app.

## Other scripts

- `npm run build` – TypeScript check and production build
- `npm run preview` – Serve the production build locally
- `npm run lint` – Run ESLint

## Features

- Email-only login persisted in localStorage.
- Auto user creation in `db.json` when email is not found.
- Shared solutions list for all users.
- Create, view, and edit solutions (author-only edit).
- Markdown description with live preview.
- Multi-category assignment with predefined and custom categories.
- Effort estimates for Front-end, Back-end, Mobile, DevOps, and Design (default `0h`).
- Creation and last update timestamps.
- Light/dark theme with persistence.
