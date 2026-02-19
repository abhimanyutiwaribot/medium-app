# Xedium · Frontend

A minimalist, distraction-free writing platform built with React, TypeScript, and Vite.

## Quick Start

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the `frontend` directory and add your backend API URL:
```env
VITE_API_URL=your_backend_api_url_here
```

### 4. Development
Run the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## Tech Stack

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Editor**: [Editor.js](https://editorjs.io/)
- **Notifications**: [Sonner](https://sonner.steventey.com/)

## Project Structure

- `src/api`: API client and fetch utilities.
- `src/components`: Reusable UI components (Sidebar, Navbar, Layout, Article elements).
- `src/context`: Auth and global state management.
- `src/pages`: Application views (Home, Profile, Editor, Landing, Version History).
- `src/sidebar`: Sidebar-specific components and logic.
- `src/utils`: Helper functions and auth state management.

## Build for Production

To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist` folder.

## Themes
Xedium supports custom themes for articles, allowing writers to match the visual feel of their story to its content. This is managed via the `src/themes/index.ts` file.

---
*Thank you*
