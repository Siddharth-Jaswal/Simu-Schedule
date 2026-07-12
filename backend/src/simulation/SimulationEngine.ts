import { Process } from '../core/Process';
import { CPU } from '../core/CPU';
import { Clock } from '../core/Clock';
import { Dispatcher } from '../dispatcher/Dispatcher';
import { MetricsCollector } from '../metrics/MetricsCollector';
import { SimulationEventEmitter } from '../events/SimulationEventEmitter';
import { SimulationEventType } from '../events/SimulationEvents';
import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { SchedulerFactory } from '../factories/SchedulerFactory';
import { SimulationStateDTO, SimulationConfig } from '@shared/types';
import { ArrivalManager } from './ArrivalManager';

export class SimulationEngine {
  public emitter: SimulationEventEmitter;
  public clock: Clock;
  public cpu: CPU;
  public dispatcher: Dispatcher;
  public metricsCollector: MetricsCollector;
  public arrivalManager: ArrivalManager;
  
  private strategy: SchedulingStrategy | null = null;
  private allProcesses: Process[] = [];
  private readyQueue: Process[] = [];
  private waitingProcesses: Process[] = [];
  private completedProcesses: Process[] = [];

  constructor() {
    this.emitter = new SimulationEventEmitter();
    this.clock = new Clock(this.emitter);
    this.cpu = new CPU(this.emitter);
    this.dispatcher = new Dispatcher(this.cpu);
    this.metricsCollector = new MetricsCollector(this.emitter);
    this.arrivalManager = new ArrivalManager(this.emitter);

    this.setupListeners();
  }

  public init(config: SimulationConfig, initialProcesses: Process[]): void {
    this.reset();
    this.strategy = SchedulerFactory.create(config);
    
    // Sort processes by arrival time initially
    const sorted = [...initialProcesses].sort((a, b) => a.arrivalTime - b.arrivalTime);
    this.allProcesses = sorted;
  }

  public start(): void {
    this.clock.start();
  }

  public pause(): void {
    this.clock.pause();
  }

  public resume(): void {
    this.clock.resume();
  }

  public reset(): void {
    this.clock.reset();
    this.metricsCollector.reset();
    this.allProcesses = [];
    this.readyQueue = [];
    this.waitingProcesses = [];
    this.completedProcesses = [];
    this.strategy = null;
    this.dispatcher.unloadProcess(0);
  }

  public step(): void {
    this.clock.step();
  }

  public finish(): void {
    this.clock.pause();
    let failsafe = 10000;
    while (this.completedProcesses.length < this.allProcesses.length && failsafe > 0) {
      this.clock.step();
      failsafe--;
    }
    // Final state update will be emitted by the last TICK
  }

  public setSpeed(speedMs: number): void {
    this.clock.setTickRate(speedMs);
  }

  public getState(): SimulationStateDTO {
    return {
      clock: this.clock.getTime(),
      cpu: {
        running: this.cpu.getRunningProcess()?.pid || null
      },
      readyQueue: this.readyQueue.map(p => p.pid),
      waitingQueue: this.waitingProcesses.map(p => p.pid),
      completed: this.completedProcesses.map(p => p.pid),
      metrics: this.metricsCollector.getMetrics()
    };
  }

  private setupListeners(): void {
    this.emitter.on(SimulationEventType.TICK, ({ time }) => {
      this.handleTick(time);
    });

    this.emitter.on(SimulationEventType.PROCESS_ARRIVAL, ({ process }) => {
      // Dynamic or static arrival
      if (!this.allProcesses.find(p => p.pid === process.pid)) {
        this.allProcesses.push(process);
      }
      this.readyQueue.push(process);
    });

    this.emitter.on(SimulationEventType.PROCESS_COMPLETED, ({ process }) => {
      const p = this.allProcesses.find(x => x.pid === process.pid);
      if (p) {
        this.completedProcesses.push(p);
      }
    });
  }

  private handleTick(currentTime: number): void {
    if (!this.strategy) return;

    // 1. Check for arriving static processes that were pre-loaded
    const arriving = this.allProcesses.filter(p => p.arrivalTime === currentTime && p.state === 'NEW');
    for (const p of arriving) {
      p.setReady();
      this.emitter.emit(SimulationEventType.PROCESS_ARRIVAL, { process: p });
    }

    // 2. Increase wait time for processes in ready queue
    for (const p of this.readyQueue) {
      p.waitTick();
    }

    // 3. Scheduler selects process using pure strategy
    const currentRunning = this.cpu.getRunningProcess();
    const { nextProcess, updatedQueue } = this.strategy.getNextProcess(
      this.readyQueue,
      currentTime,
      currentRunning
    );

    this.readyQueue = updatedQueue;

    // 4. Dispatcher context switch
    this.dispatcher.dispatch(nextProcess, currentTime);

    // 5. CPU executes
    this.cpu.executeTick(currentTime);

    // Optional check: if all processes are completed, auto-pause
    if (this.completedProcesses.length === this.allProcesses.length && this.allProcesses.length > 0) {
      this.clock.pause();
    }
  }
}
