# OS Scheduler Lab

OS Scheduler Lab is a real-time Operating System Process Scheduling Simulator built with React, Node.js, and WebSockets.
Unlike traditional simulators, this project visually demonstrates every scheduling decision in real-time, resembling a modern developer tool like Chrome DevTools or VS Code.

## Features

- **Real-Time Simulation**: Watch the CPU, Ready Queue, and Waiting Queues evolve instantly.
- **Multiple Algorithms**:
  - First-Come, First-Served (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Time First (SRTF)
  - Round Robin (RR)
  - Priority (Preemptive & Non-Preemptive)
  - Multi-Level Feedback Queue (MLFQ)
- **Live Metrics**: Monitor CPU utilization, throughput, waiting time, turnaround time, and context switches as they happen.
- **Modern UI**: Built with TailwindCSS and Framer Motion for sleek glassmorphism designs and smooth transitions.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Framer Motion, Recharts, Zustand.
- **Backend**: Node.js, Express, Socket.io, TypeScript, Jest.

## Quick Start

### 1. Install Dependencies

Open two terminal windows (one for frontend, one for backend):

```bash
# Terminal 1 - Backend
cd backend
npm install

# Terminal 2 - Frontend
cd frontend
npm install
```

### 2. Start the Servers

```bash
# Terminal 1 - Backend (Starts on port 3001)
npm run dev

# Terminal 2 - Frontend (Starts on port 5173)
npm run dev
```

### 3. Open the App
Navigate to `http://localhost:5173` in your browser. 

- Select an algorithm from the sidebar.
- Adjust the number of processes or quantum time (if applicable).
- Click **Start Simulation**.
- You can dynamically adjust the simulation speed (1x, 2x, 10x) and pause/resume at will.

## Architecture

The system uses an Event-Driven backend model:
- **SimulationEngine**: Coordinates ticks and controls the flow.
- **Clock**: Ticks at an adjustable rate.
- **Dispatcher**: Handles Context Switches.
- **Strategies**: Implements the Strategy Pattern for different algorithms.
- **SocketServer**: Broadcasts state updates to the React frontend.
