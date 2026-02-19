# Xedium

Xedium is a minimalist writing platform built for people who value deep thoughts over short-form noise. It is a personal project designed to be a quiet, distraction-free corner of the web.

## Core Features

### Distraction-Free Editor
A clean slate for your thoughts. The editor is based on block-level logic but presented as a blank sheet of paper. There are no sidebars or popups to break your focus.

### Version History and Diffing
Writing is a process. Xedium tracks the evolution of your stories, allowing you to view previous versions and compare changes through a dedicated side-by-side diffing interface.

### Custom Themes
Authors can choose from a curated set of themes to match the mood of their story. These range from classic serif styles to dark, high-contrast layouts.

### Chronological Discovery
No algorithms decide what you see. Stories are shared chronologically with people who follow you, ensuring a fair and predictable experience.

### Writing Insights
A personal dashboard includes a contribution heatmap and streak tracking to help you maintain a consistent writing habit.

## Technical Architecture

The project is structured as a monorepo with a shared logic package for consistency across the stack.

### Backend
- Framework: Hono
- Runtime: Cloudflare Workers
- Database: PostgreSQL
- ORM: Prisma
- Infrastructure: Edge-ready serverless functions

### Frontend
- Library: React 19
- Build Tool: Vite 7
- Styling: Tailwind CSS
- Routing: React Router 7
- State: Custom Auth Context

## Local Setup

### Prerequisites
- Node.js (v18+)
- npm
- A PostgreSQL database instance

### 1. Database Configuration
Navigate to the backend directory and set up your environment:
```bash
cd backend
cp .env.example .env
cp .env.example .dev.vars
# Update DATABASE_URL and DIRECT_URL in .env
npx prisma generate
npx prisma db push
```

### 2. Backend Deployment
The backend runs on Cloudflare Workers:
```bash
npm install
npx wrangler dev
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
npm install
npm run dev
```
By default, the frontend will be available at http://localhost:5173.

---

Thank you for exploring Xedium.
