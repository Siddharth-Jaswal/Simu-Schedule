import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class SRTF implements SchedulingStrategy {
  private queue: Process[] = [];

  addProcess(process: Process): void {
    this.queue.push(process);
    this.sortQueue();
  }

  getNextProcess(currentTime: number, currentRunningProcess: Process | null): Process | null {
    // SRTF is preemptive. 
    // We add the current running process back to the queue (virtually) to compare
    let candidates = [...this.queue];
    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      candidates.push(currentRunningProcess);
    }

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.remainingTime - b.remainingTime);
    const bestProcess = candidates[0];

    // If the best process is already running, just return it
    if (currentRunningProcess && bestProcess.pid === currentRunningProcess.pid) {
      return currentRunningProcess;
    }

    // Otherwise, we need to preempt. 
    // The current running process will be automatically preempted by CPU.setProcess, 
    // but we need to ensure it's in our queue.
    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      // It's already been pushed to queue? No, we only pushed to candidates.
      // So we must formally add it to queue.
      if (!this.queue.find(p => p.pid === currentRunningProcess.pid)) {
        this.queue.push(currentRunningProcess);
      }
    }

    // Remove the best process from the queue because it will run
    this.removeProcess(bestProcess.pid);
    this.sortQueue();

    return bestProcess;
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
    this.queue.sort((a, b) => a.remainingTime - b.remainingTime);
  }
}
