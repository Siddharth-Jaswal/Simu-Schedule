import { SimulationEventEmitter } from '../events/SimulationEventEmitter';
import { SimulationEventType } from '../events/SimulationEvents';
import { MetricsDTO } from '@shared/types';

export class MetricsCollector {
  private totalTicks: number = 0;
  private idleTicks: number = 0;
  private contextSwitches: number = 0;
  private totalWaitingTime: number = 0;
  private totalTurnaroundTime: number = 0;
  private totalResponseTime: number = 0;
  private completedProcesses: number = 0;

  constructor(emitter: SimulationEventEmitter) {
    this.setupListeners(emitter);
  }

  private setupListeners(emitter: SimulationEventEmitter): void {
    emitter.on(SimulationEventType.TICK, () => {
      this.totalTicks++;
    });

    emitter.on(SimulationEventType.CPU_IDLE, () => {
      this.idleTicks++;
    });

    emitter.on(SimulationEventType.CONTEXT_SWITCH, () => {
      this.contextSwitches++;
    });

    emitter.on(SimulationEventType.PROCESS_COMPLETED, ({ process }) => {
      this.completedProcesses++;
      this.totalWaitingTime += process.waitingTime;
      this.totalTurnaroundTime += process.turnaroundTime;
      this.totalResponseTime += process.responseTime;
    });
  }

  public getMetrics(): MetricsDTO {
    const cpuUtilization = this.totalTicks === 0 ? 0 : ((this.totalTicks - this.idleTicks) / this.totalTicks) * 100;
    const throughput = this.totalTicks === 0 ? 0 : this.completedProcesses / this.totalTicks;
    
    return {
      cpuUtilization: Number(cpuUtilization.toFixed(2)),
      throughput: Number(throughput.toFixed(4)),
      waitingTime: this.completedProcesses === 0 ? 0 : Number((this.totalWaitingTime / this.completedProcesses).toFixed(2)),
      turnaroundTime: this.completedProcesses === 0 ? 0 : Number((this.totalTurnaroundTime / this.completedProcesses).toFixed(2)),
      responseTime: this.completedProcesses === 0 ? 0 : Number((this.totalResponseTime / this.completedProcesses).toFixed(2)),
      contextSwitches: this.contextSwitches
    };
  }

  public reset(): void {
    this.totalTicks = 0;
    this.idleTicks = 0;
    this.contextSwitches = 0;
    this.totalWaitingTime = 0;
    this.totalTurnaroundTime = 0;
    this.totalResponseTime = 0;
    this.completedProcesses = 0;
  }
}
