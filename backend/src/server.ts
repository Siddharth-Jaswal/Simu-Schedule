import express from 'express';
import { createServer } from 'http';
import { SimulationEngine } from './simulation/SimulationEngine';
import { SocketServer } from './socket/SocketServer';
import { createApiRouter } from './routes/api';
import cors from 'cors';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

const engine = new SimulationEngine();

// Setup WebSocket server
new SocketServer(server, engine);

// Setup API routes
app.use('/api', createApiRouter(engine));

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
