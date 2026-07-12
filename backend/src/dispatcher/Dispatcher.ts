import { Process } from '../core/Process';
import { CPU } from '../core/CPU';

export class Dispatcher {
  private cpu: CPU;

  constructor(cpu: CPU) {
    this.cpu = cpu;
  }

  public dispatch(process: Process | null, currentTime: number): void {
    // If the process is already running on CPU, do nothing
    const current = this.cpu.getRunningProcess();
    if (current && process && current.pid === process.pid) {
      return;
    }

    // Context switch logic: 
    // Dispatch latency could be modeled here by making the CPU idle for N ticks, 
    // but for this lab we assume 0 dispatch latency unless specified.
    this.cpu.setProcess(process, currentTime);
  }

  public unloadProcess(currentTime: number): void {
    this.cpu.setProcess(null, currentTime);
  }
}
