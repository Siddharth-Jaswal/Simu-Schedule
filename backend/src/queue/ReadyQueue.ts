import { Process } from '../core/Process';

export interface ReadyQueue {
  enqueue(process: Process): void;
  dequeue(): Process | null;
  peek(): Process | null;
  remove(pid: string): Process | null;
  isEmpty(): boolean;
  getProcesses(): Process[];
  size(): number;
  clear(): void;
}

export class FIFOQueue implements ReadyQueue {
  private queue: Process[] = [];

  enqueue(process: Process): void {
    this.queue.push(process);
  }

  dequeue(): Process | null {
    return this.queue.shift() || null;
  }

  peek(): Process | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  remove(pid: string): Process | null {
    const index = this.queue.findIndex(p => p.pid === pid);
    if (index !== -1) {
      return this.queue.splice(index, 1)[0];
    }
    return null;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  getProcesses(): Process[] {
    return [...this.queue];
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}
