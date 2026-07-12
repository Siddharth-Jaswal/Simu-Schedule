import { io, Socket } from 'socket.io-client';
import { useSimulationStore } from '../store/useSimulationStore';
import { SimulationStateDTO } from '@shared/types';

class SocketService {
  private socket: Socket | null = null;
  private backendUrl = 'http://localhost:3001';

  public connect(): void {
    if (this.socket) return;

    this.socket = io(this.backendUrl, {
      transports: ['websocket'],
    });

    this.setupListeners();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      useSimulationStore.getState().setIsConnected(true);
      console.log('Connected to backend simulation server');
    });

    this.socket.on('disconnect', () => {
      useSimulationStore.getState().setIsConnected(false);
      console.log('Disconnected from backend simulation server');
    });

    this.socket.on('stateUpdate', (state: SimulationStateDTO) => {
      useSimulationStore.getState().setState(state);
    });

    this.socket.on('event', ({ type, payload }: { type: string, payload: any }) => {
      // Handle discrete events (e.g., process arrival, completion)
      if (type === 'PROCESS_ARRIVAL' || type === 'PROCESS_COMPLETED' || type === 'PROCESS_SCHEDULED') {
        if (payload.process) {
          useSimulationStore.getState().addOrUpdateProcess(payload.process);
        }
      }
    });
  }
}

export const socketService = new SocketService();
