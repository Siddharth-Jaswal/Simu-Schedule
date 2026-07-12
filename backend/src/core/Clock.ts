import { SimulationEventEmitter } from '../events/SimulationEventEmitter';
import { SimulationEventType } from '../events/SimulationEvents';

export class Clock {
  private currentTime: number = 0;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private tickRate: number = 1000; // ms per tick
  private emitter: SimulationEventEmitter;

  constructor(emitter: SimulationEventEmitter) {
    this.emitter = emitter;
  }

  public getTime(): number {
    return this.currentTime;
  }

  public setTickRate(rateMs: number): void {
    this.tickRate = rateMs;
    if (this.isRunning) {
      this.pause();
      this.resume();
    }
  }

  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      if (this.currentTime === 0) {
        // Emit tick 0 immediately to process 0-arrival processes
        this.emitter.emit(SimulationEventType.TICK, { time: this.currentTime });
      }
      this.scheduleNextTick();
    }
  }

  public pause(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  public resume(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.scheduleNextTick();
    }
  }

  public reset(): void {
    this.pause();
    this.currentTime = 0;
  }

  public step(): void {
    if (this.currentTime === 0) {
      this.emitter.emit(SimulationEventType.TICK, { time: this.currentTime });
    }
    this.tick();
  }

  private scheduleNextTick(): void {
    if (!this.isRunning) return;
    this.intervalId = setTimeout(() => {
      this.tick();
      this.scheduleNextTick();
    }, this.tickRate);
  }

  private tick(): void {
    this.currentTime++;
    this.emitter.emit(SimulationEventType.TICK, { time: this.currentTime });
  }
}
