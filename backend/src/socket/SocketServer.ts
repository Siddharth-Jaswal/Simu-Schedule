import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { SimulationEventType } from '../events/SimulationEvents';

export class SocketServer {
  private io: Server;
  private engine: SimulationEngine;

  constructor(server: HttpServer, engine: SimulationEngine) {
    this.io = new Server(server, {
      cors: {
        origin: '*', // For dev, allow all
        methods: ['GET', 'POST']
      }
    });
    this.engine = engine;
    this.setupEvents();
  }

  private setupEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // Send initial state
      socket.emit('stateUpdate', this.engine.getState());

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    // Broadcaster for engine state
    this.engine.emitter.on(SimulationEventType.TICK, () => {
      this.io.emit('stateUpdate', this.engine.getState());
    });

    this.engine.emitter.on(SimulationEventType.PROCESS_ARRIVAL, (payload) => {
      this.io.emit('event', { type: 'PROCESS_ARRIVAL', payload: { ...payload, process: payload.process.toDTO() } });
    });

    this.engine.emitter.on(SimulationEventType.PROCESS_COMPLETED, (payload) => {
      this.io.emit('event', { type: 'PROCESS_COMPLETED', payload: { ...payload, process: payload.process.toDTO() } });
      this.io.emit('stateUpdate', this.engine.getState());
    });

    this.engine.emitter.on(SimulationEventType.CONTEXT_SWITCH, (payload) => {
      this.io.emit('event', { type: 'CONTEXT_SWITCH', payload });
    });
  }
}
