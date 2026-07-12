# Scheduler Lab

Scheduler Lab is a full-stack, real-time operating system CPU scheduling visualization tool. It provides a highly interactive and visually driven interface to understand, configure, and observe various CPU scheduling algorithms in action.

## Project Structure

The repository is structured as a monorepo containing a frontend and a backend, sharing common TypeScript definitions.

- `frontend/`: React application powered by Vite, Tailwind CSS, and Framer Motion.
- `backend/`: Node.js Express server utilizing Socket.IO for real-time simulation streaming.
- `shared/`: Shared TypeScript interfaces and types.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Environment Configuration

Both the frontend and backend require environment variables to function correctly, particularly for deployment or overriding default ports.

### Backend

Create a `.env` file in the `backend/` directory (you can copy `.env.example`):

```bash
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

- `PORT`: The port on which the Express server and Socket.IO will listen.
- `CORS_ORIGIN`: The allowed origin for cross-origin requests. Use your frontend URL.

### Frontend

Create a `.env` file in the `frontend/` directory (you can copy `.env.example`):

```bash
VITE_API_URL=http://localhost:3001/api/simulation
VITE_SOCKET_URL=http://localhost:3001
```

- `VITE_API_URL`: The HTTP endpoint for the backend API.
- `VITE_SOCKET_URL`: The WebSocket endpoint for the backend real-time server.

## Running Locally

To run the project on your local machine, you will need to start both the backend and frontend servers.

### 1. Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
npm run dev
```

The backend will start using `nodemon` on the specified port (default 3001).

### 2. Start the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start using Vite (default port 5173). Navigate to `http://localhost:5173` in your browser.

## Deployment Guide

The architecture is designed to be easily deployed to modern cloud hosting platforms.

### Deploying the Backend (e.g., to Render)

1. Connect your repository to your hosting provider.
2. Select the `backend` directory as the root if your provider supports it, or configure the build commands accordingly.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables:
   - Set `CORS_ORIGIN` to your deployed frontend URL.
   - The hosting provider will typically inject the `PORT` automatically.

### Deploying the Frontend (e.g., to Vercel)

1. Connect your repository to Vercel.
2. Set the Root Directory to `frontend`.
3. The framework preset should automatically detect Vite.
4. Environment Variables:
   - Set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com/api/simulation`).
   - Set `VITE_SOCKET_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com`).
5. Deploy.

## Available Scripts

### Backend (`backend/package.json`)
- `npm run dev`: Starts the server with hot-reloading via nodemon.
- `npm run build`: Compiles the TypeScript source code into the `dist/` directory.
- `npm start`: Runs the compiled output from the `dist/` directory (used for production).
- `npm test`: Runs the Jest test suite.

### Frontend (`frontend/package.json`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production into the `dist/` directory.
- `npm run preview`: Bootstraps a local static web server to preview the production build.
