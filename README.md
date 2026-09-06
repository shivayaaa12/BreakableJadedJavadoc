Screenroom

Screenroom is a movie and show tracking app that lets users build and manage a personal watchlist. It's built as a full-stack web application with a React frontend and an Express-based API backend.

Features
Browse and search for movies and shows
Add titles to a personal watchlist
Track watched vs. unwatched status
Clean, responsive UI with toast notifications and tooltips
Tech Stack

Frontend

React with TypeScript
TanStack Query for data fetching and caching
Lucide React for icons
Custom UI components (toaster, tooltip provider, error boundary)

Backend

Node.js with Express
TypeScript
CORS for cross-origin requests
Pino for structured logging
Project Structure
artifacts/
  api-server/     # Express backend API
    src/
      app.ts      # Main Express app setup
      routes/     # API route handlers
      lib/        # Shared utilities (logger, etc.)
  screenroom/     # React frontend
    src/
      App.tsx     # Main application component
      components/ # Reusable UI components
      pages/      # Page-level components
Getting Started
Prerequisites
Node.js
pnpm
Installation
bash
pnpm install
Running Locally
bash
pnpm run build
pnpm start

The API server runs on port 8080 by default.

Author

Built by Shivaya as part of a full-stack development training program.
