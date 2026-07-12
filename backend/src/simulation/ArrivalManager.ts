import { Process } from '../core/Process';
import { SimulationEventEmitter } from '../events/SimulationEventEmitter';
import { SimulationEventType } from '../events/SimulationEvents';

export class ArrivalManager {
  private emitter: SimulationEventEmitter;

  constructor(emitter: SimulationEventEmitter) {
    this.emitter = emitter;
  }

  /**
   * Processes a new incoming process request (e.g. from UI)
   * Validates it and emits an arrival event if valid.
   */
  public processDynamicArrival(processData: any, currentTime: number): void {
    if (!processData || typeof processData.burstTime !== 'number') {
      throw new Error('Invalid process data: burstTime is required');
    }

    if (processData.burstTime <= 0) {
      throw new Error('Invalid burst time: must be greater than zero');
    }

    const arrivalTime = processData.arrivalTime ?? currentTime;
    
    const p = new Process(
      processData.pid || `P${Math.floor(Math.random() * 1000)}`,
      arrivalTime,
      processData.burstTime,
      processData.priority || 0,
      processData.color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
    );

    // If it's meant to arrive in the future, we would store it.
    // For now, assume it's arriving now.
    p.setReady();
    this.emitter.emit(SimulationEventType.PROCESS_ARRIVAL, { process: p });
  }
}
