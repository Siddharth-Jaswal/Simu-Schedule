import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';
import { FIFOQueue } from '../queue/ReadyQueue';

export class RoundRobin implements SchedulingStrategy {
  private queue: FIFOQueue;
  private timeQuantum: number;
  private currentQuantumTicks: number = 0;

  constructor(timeQuantum: number = 2) {
    this.queue = new FIFOQueue();
    this.timeQuantum = timeQuantum;
  }

  addProcess(process: Process): void {
    this.queue.enqueue(process);
  }

  getNextProcess(currentTime: number, currentRunningProcess: Process | null): Process | null {
    if (!currentRunningProcess || currentRunningProcess.isCompleted()) {
      this.currentQuantumTicks = 0;
      return this.queue.dequeue();
    }

    // Process is currently running. Check if quantum expired.
    this.currentQuantumTicks++;

    if (this.currentQuantumTicks >= this.timeQuantum) {
      // Quantum expired, preempt
      // Add current back to queue
      this.queue.enqueue(currentRunningProcess);
      
      this.currentQuantumTicks = 0;
      return this.queue.dequeue();
    }

    // Quantum not expired
    return currentRunningProcess;
  }

  removeProcess(pid: string): void {
    this.queue.remove(pid);
  }

  getQueue(): Process[] {
    return this.queue.getProcesses();
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}
