import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class MLFQ implements SchedulingStrategy {
  private timeQuantums: number[] = [2, 4, 8]; // 3 queues
  private currentProcessLevel: Map<string, number> = new Map();
  private currentQuantumTicks: number = 0;

  constructor(quantums: number[] = [2, 4, 8]) {
    this.timeQuantums = quantums;
  }

  getNextProcess(
    readyQueue: Process[],
    currentTime: number,
    currentRunningProcess: Process | null
  ): { nextProcess: Process | null; updatedQueue: Process[] } {
    let updatedQueue = [...readyQueue];

    // Ensure all processes have a known level (default 0 for new arrivals)
    for (const p of updatedQueue) {
      if (!this.currentProcessLevel.has(p.pid)) {
        this.currentProcessLevel.set(p.pid, 0);
      }
    }

    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      let currentLevel = this.currentProcessLevel.get(currentRunningProcess.pid) || 0;
      this.currentQuantumTicks++;

      if (this.currentQuantumTicks >= this.timeQuantums[currentLevel]) {
        // Quantum expired, demote process
        const nextLevel = Math.min(currentLevel + 1, this.timeQuantums.length - 1);
        this.currentProcessLevel.set(currentRunningProcess.pid, nextLevel);
        updatedQueue.push(currentRunningProcess);
        this.currentQuantumTicks = 0;
        return this.selectHighestPriorityProcess(updatedQueue);
      }

      // Check for strictly higher priority arrivals
      // A process is higher priority if its level < currentLevel
      const hasHigherPriority = updatedQueue.some(p => (this.currentProcessLevel.get(p.pid) || 0) < currentLevel);
      if (hasHigherPriority) {
        updatedQueue.push(currentRunningProcess);
        this.currentQuantumTicks = 0;
        return this.selectHighestPriorityProcess(updatedQueue);
      }

      // Keep running
      return { nextProcess: currentRunningProcess, updatedQueue };
    }

    this.currentQuantumTicks = 0;
    return this.selectHighestPriorityProcess(updatedQueue);
  }

  private selectHighestPriorityProcess(queue: Process[]): { nextProcess: Process | null; updatedQueue: Process[] } {
    if (queue.length === 0) return { nextProcess: null, updatedQueue: queue };

    // Sort queue such that processes in level 0 come before level 1, then by arrival time
    queue.sort((a, b) => {
      const levelA = this.currentProcessLevel.get(a.pid) || 0;
      const levelB = this.currentProcessLevel.get(b.pid) || 0;
      if (levelA === levelB) return a.arrivalTime - b.arrivalTime;
      return levelA - levelB;
    });

    const nextProcess = queue.shift() || null;
    return { nextProcess, updatedQueue: queue };
  }
}
