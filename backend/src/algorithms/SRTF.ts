import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { Process } from '../core/Process';

export class SRTF implements SchedulingStrategy {
  getNextProcess(
    readyQueue: Process[],
    currentTime: number,
    currentRunningProcess: Process | null
  ): { nextProcess: Process | null; updatedQueue: Process[] } {
    let updatedQueue = [...readyQueue];
    let candidates = [...updatedQueue];

    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      candidates.push(currentRunningProcess);
    }

    if (candidates.length === 0) {
      return { nextProcess: null, updatedQueue };
    }

    // Sort by shortest remaining time
    candidates.sort((a, b) => {
      if (a.remainingTime === b.remainingTime) return a.arrivalTime - b.arrivalTime;
      return a.remainingTime - b.remainingTime;
    });

    const bestProcess = candidates[0];

    // Reconstruct the queue based on the decision
    if (currentRunningProcess && bestProcess.pid === currentRunningProcess.pid) {
      // Current process keeps running, queue remains unchanged
      return { nextProcess: currentRunningProcess, updatedQueue };
    }

    // Preemption or CPU was idle
    if (currentRunningProcess && !currentRunningProcess.isCompleted()) {
      updatedQueue.push(currentRunningProcess); // Preempt current
    }

    updatedQueue = updatedQueue.filter(p => p.pid !== bestProcess.pid); // Remove the new best from ready queue
    return { nextProcess: bestProcess, updatedQueue };
  }
}
