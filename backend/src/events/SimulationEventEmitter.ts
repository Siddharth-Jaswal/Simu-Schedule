import { EventEmitter } from 'events';
import { SimulationEventType, SimulationEventPayloads } from './SimulationEvents';

export class SimulationEventEmitter {
  private emitter = new EventEmitter();

  public emit<K extends SimulationEventType>(event: K, payload: SimulationEventPayloads[K]): void {
    this.emitter.emit(event, payload);
  }

  public on<K extends SimulationEventType>(
    event: K,
    listener: (payload: SimulationEventPayloads[K]) => void
  ): void {
    this.emitter.on(event, listener);
  }

  public off<K extends SimulationEventType>(
    event: K,
    listener: (payload: SimulationEventPayloads[K]) => void
  ): void {
    this.emitter.off(event, listener);
  }

  public removeAllListeners(): void {
    this.emitter.removeAllListeners();
  }
}
