import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class SJF implements SchedulingStrategy {
  private queue: Process[] = [];

  addProcess(process: Process): void {
    this.queue.push(process);
    // Sort by burstTime
    this.queue.sort((a, b) => a.burstTime - b.burstTime);
  }

  getNextProcess(currentTime: number, currentRunningProcess: Process | null): Process | null {
    // Non-preemptive: if currently running, keep it
    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      return currentRunningProcess;
    }

    if (this.queue.length === 0) return null;
    return this.queue.shift() || null;
  }

  removeProcess(pid: string): void {
    const index = this.queue.findIndex(p => p.pid === pid);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  getQueue(): Process[] {
    return [...this.queue];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}
