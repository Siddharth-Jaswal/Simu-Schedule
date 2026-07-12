import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class Priority implements SchedulingStrategy {
  private queue: Process[] = [];
  private isPreemptive: boolean;

  // Assuming lower number means higher priority
  constructor(isPreemptive: boolean = false) {
    this.isPreemptive = isPreemptive;
  }

  addProcess(process: Process): void {
    this.queue.push(process);
    this.sortQueue();
  }

  getNextProcess(currentTime: number, currentRunningProcess: Process | null): Process | null {
    if (!this.isPreemptive) {
      if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
        return currentRunningProcess;
      }
      if (this.queue.length === 0) return null;
      return this.queue.shift() || null;
    } else {
      // Preemptive
      let candidates = [...this.queue];
      if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
        candidates.push(currentRunningProcess);
      }

      if (candidates.length === 0) return null;

      candidates.sort((a, b) => {
        if (a.priority === b.priority) return a.arrivalTime - b.arrivalTime;
        return a.priority - b.priority;
      });

      const bestProcess = candidates[0];

      if (currentRunningProcess && bestProcess.pid === currentRunningProcess.pid) {
        return currentRunningProcess;
      }

      if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
        if (!this.queue.find(p => p.pid === currentRunningProcess.pid)) {
          this.queue.push(currentRunningProcess);
        }
      }

      this.removeProcess(bestProcess.pid);
      this.sortQueue();

      return bestProcess;
    }
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

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      if (a.priority === b.priority) return a.arrivalTime - b.arrivalTime;
      return a.priority - b.priority;
    });
  }
}
