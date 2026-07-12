import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';
import { FIFOQueue } from '../queue/ReadyQueue';

export class MLFQ implements SchedulingStrategy {
  private queues: FIFOQueue[] = [];
  private timeQuantums: number[] = [2, 4, 8]; // Example quantums for 3 queues
  private currentProcessLevel: Map<string, number> = new Map();
  private currentQuantumTicks: number = 0;

  constructor(quantums: number[] = [2, 4, 8]) {
    this.timeQuantums = quantums;
    for (let i = 0; i < quantums.length; i++) {
      this.queues.push(new FIFOQueue());
    }
  }

  addProcess(process: Process): void {
    // New processes go to the highest priority queue (index 0)
    if (!this.currentProcessLevel.has(process.pid)) {
      this.currentProcessLevel.set(process.pid, 0);
    }
    const level = this.currentProcessLevel.get(process.pid) || 0;
    this.queues[level].enqueue(process);
  }

  getNextProcess(currentTime: number, currentRunningProcess: Process | null): Process | null {
    let currentLevel = 0;
    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      currentLevel = this.currentProcessLevel.get(currentRunningProcess.pid) || 0;
      this.currentQuantumTicks++;

      if (this.currentQuantumTicks >= this.timeQuantums[currentLevel]) {
        // Quantum expired, demote process if not at lowest queue
        const nextLevel = Math.min(currentLevel + 1, this.queues.length - 1);
        this.currentProcessLevel.set(currentRunningProcess.pid, nextLevel);
        this.queues[nextLevel].enqueue(currentRunningProcess);
        this.currentQuantumTicks = 0;
        return this.fetchNextFromQueues();
      }

      // Check if a higher priority process has arrived
      for (let i = 0; i < currentLevel; i++) {
        if (!this.queues[i].isEmpty()) {
          // Preempt current process by higher priority queue
          this.queues[currentLevel].enqueue(currentRunningProcess);
          this.currentQuantumTicks = 0;
          return this.fetchNextFromQueues();
        }
      }

      // Continue running the current process
      return currentRunningProcess;
    }

    this.currentQuantumTicks = 0;
    return this.fetchNextFromQueues();
  }

  removeProcess(pid: string): void {
    for (const queue of this.queues) {
      queue.remove(pid);
    }
  }

  getQueue(): Process[] {
    // Return a flattened view of all queues for the visualizer
    const allProcesses: Process[] = [];
    for (const queue of this.queues) {
      allProcesses.push(...queue.getProcesses());
    }
    return allProcesses;
  }

  isEmpty(): boolean {
    return this.queues.every(q => q.isEmpty());
  }

  private fetchNextFromQueues(): Process | null {
    for (let i = 0; i < this.queues.length; i++) {
      if (!this.queues[i].isEmpty()) {
        return this.queues[i].dequeue();
      }
    }
    return null;
  }
}
