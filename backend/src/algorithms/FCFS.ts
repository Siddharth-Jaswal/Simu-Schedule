import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class FCFS implements SchedulingStrategy {
  getNextProcess(
    readyQueue: Process[],
    currentTime: number,
    currentRunningProcess: Process | null
  ): { nextProcess: Process | null; updatedQueue: Process[] } {
    let updatedQueue = [...readyQueue];

    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      return { nextProcess: currentRunningProcess, updatedQueue };
    }

    if (updatedQueue.length === 0) {
      return { nextProcess: null, updatedQueue };
    }

    const nextProcess = updatedQueue.shift() || null;
    return { nextProcess, updatedQueue };
  }
}
