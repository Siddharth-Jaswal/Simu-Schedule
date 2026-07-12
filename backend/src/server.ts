import express from 'express';
import { createServer } from 'http';
import { SimulationEngine } from './simulation/SimulationEngine';
import { SocketServer } from './socket/SocketServer';
import { createApiRouter } from './routes/api';
import cors from 'cors';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

const engine = new SimulationEngine();

// Setup WebSocket server
new SocketServer(server, engine, corsOrigin);

// Setup API routes
app.use('/api/simulation', createApiRouter(engine));

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
