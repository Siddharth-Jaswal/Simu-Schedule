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

export class SimulationEngine {
  public emitter: SimulationEventEmitter;
  public clock: Clock;
  public cpu: CPU;
  public dispatcher: Dispatcher;
  public metricsCollector: MetricsCollector;
  
  private strategy: SchedulingStrategy | null = null;
  private processes: Process[] = [];
  private waitingProcesses: Process[] = []; // Currently not doing I/O wait, but good to have
  private completedProcesses: Process[] = [];

  constructor() {
    this.emitter = new SimulationEventEmitter();
    this.clock = new Clock(this.emitter);
    this.cpu = new CPU(this.emitter);
    this.dispatcher = new Dispatcher(this.cpu);
    this.metricsCollector = new MetricsCollector(this.emitter);

    this.setupListeners();
  }

  public init(config: SimulationConfig, initialProcesses: Process[]): void {
    this.reset();
    this.strategy = SchedulerFactory.create(config);
    this.processes = [...initialProcesses];
    // Sort processes by arrival time initially
    this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
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
    this.processes = [];
    this.waitingProcesses = [];
    this.completedProcesses = [];
    this.strategy = null;
    this.dispatcher.unloadProcess(0);
  }

  public step(): void {
    this.clock.step();
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
      readyQueue: this.strategy ? this.strategy.getQueue().map(p => p.pid) : [],
      waitingQueue: this.waitingProcesses.map(p => p.pid),
      completed: this.completedProcesses.map(p => p.pid),
      metrics: this.metricsCollector.getMetrics()
    };
  }

  private setupListeners(): void {
    this.emitter.on(SimulationEventType.TICK, ({ time }) => {
      this.handleTick(time);
    });

    this.emitter.on(SimulationEventType.PROCESS_COMPLETED, ({ process }) => {
      const p = this.processes.find(x => x.pid === process.pid);
      if (p) {
        this.completedProcesses.push(p);
      }
    });
  }

  private handleTick(currentTime: number): void {
    if (!this.strategy) return;

    // 1. Check for arriving processes
    const arriving = this.processes.filter(p => p.arrivalTime === currentTime && p.state === 'NEW');
    for (const p of arriving) {
      p.setReady();
      this.strategy.addProcess(p);
      this.emitter.emit(SimulationEventType.PROCESS_ARRIVAL, { process: p.toDTO() });
    }

    // 2. Increase wait time for processes in ready queue
    const readyQueueProcesses = this.strategy.getQueue();
    for (const p of readyQueueProcesses) {
      p.waitTick();
    }

    // 3. Scheduler selects process
    const currentRunning = this.cpu.getRunningProcess();
    const nextProcess = this.strategy.getNextProcess(currentTime, currentRunning);

    // 4. Dispatcher context switch
    this.dispatcher.dispatch(nextProcess, currentTime);

    // 5. CPU executes
    this.cpu.executeTick(currentTime);

    // Optional check: if all processes are completed, auto-pause
    if (this.completedProcesses.length === this.processes.length && this.processes.length > 0) {
      this.clock.pause();
    }
  }
}
