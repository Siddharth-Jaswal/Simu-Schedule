import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';
import { FIFOQueue } from '../queue/ReadyQueue';

export class FCFS implements SchedulingStrategy {
  private queue: FIFOQueue;

  constructor() {
    this.queue = new FIFOQueue();
  }

  addProcess(process: Process): void {
    this.queue.enqueue(process);
  }

  getNextProcess(currentTime: number, currentRunningProcess: Process | null): Process | null {
    // FCFS is non-preemptive. 
    // If a process is already running, keep running it.
    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      return currentRunningProcess;
    }

    // Otherwise, pick the next from the queue
    return this.queue.dequeue();
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
