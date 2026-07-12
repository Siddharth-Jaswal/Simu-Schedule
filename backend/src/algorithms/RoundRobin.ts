import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class RoundRobin implements SchedulingStrategy {
  private timeQuantum: number;
  private currentQuantumTicks: number = 0;

  constructor(timeQuantum: number = 2) {
    this.timeQuantum = timeQuantum;
  }

  getNextProcess(
    readyQueue: Process[],
    currentTime: number,
    currentRunningProcess: Process | null
  ): { nextProcess: Process | null; updatedQueue: Process[] } {
    let updatedQueue = [...readyQueue];

    if (!currentRunningProcess || currentRunningProcess.isCompleted()) {
      this.currentQuantumTicks = 0;
      if (updatedQueue.length === 0) return { nextProcess: null, updatedQueue };
      return { nextProcess: updatedQueue.shift() || null, updatedQueue };
    }

    // Process is currently running. Check if quantum expired.
    this.currentQuantumTicks++;

    if (this.currentQuantumTicks >= this.timeQuantum) {
      // Quantum expired, preempt
      updatedQueue.push(currentRunningProcess);
      this.currentQuantumTicks = 0;
      const nextProcess = updatedQueue.shift() || null;
      return { nextProcess, updatedQueue };
    }

    // Quantum not expired
    return { nextProcess: currentRunningProcess, updatedQueue };
  }
}
