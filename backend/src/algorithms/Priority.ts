import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class Priority implements SchedulingStrategy {
  private isPreemptive: boolean;

  // Assuming lower number means higher priority
  constructor(isPreemptive: boolean = false) {
    this.isPreemptive = isPreemptive;
  }

  getNextProcess(
    readyQueue: Process[],
    currentTime: number,
    currentRunningProcess: Process | null
  ): { nextProcess: Process | null; updatedQueue: Process[] } {
    let updatedQueue = [...readyQueue];

    if (!this.isPreemptive) {
      if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
        return { nextProcess: currentRunningProcess, updatedQueue };
      }
      if (updatedQueue.length === 0) return { nextProcess: null, updatedQueue };
      
      this.sortQueue(updatedQueue);
      return { nextProcess: updatedQueue.shift() || null, updatedQueue };
    } else {
      // Preemptive
      let candidates = [...updatedQueue];
      if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
        candidates.push(currentRunningProcess);
      }

      if (candidates.length === 0) return { nextProcess: null, updatedQueue };

      this.sortQueue(candidates);
      const bestProcess = candidates[0];

      if (currentRunningProcess && bestProcess.pid === currentRunningProcess.pid) {
        return { nextProcess: currentRunningProcess, updatedQueue };
      }

      if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
        updatedQueue.push(currentRunningProcess);
      }

      updatedQueue = updatedQueue.filter(p => p.pid !== bestProcess.pid);
      return { nextProcess: bestProcess, updatedQueue };
    }
  }

  private sortQueue(queue: Process[]): void {
    queue.sort((a, b) => {
      if (a.priority === b.priority) return a.arrivalTime - b.arrivalTime;
      return a.priority - b.priority; // Lower number = higher priority
    });
  }
}
