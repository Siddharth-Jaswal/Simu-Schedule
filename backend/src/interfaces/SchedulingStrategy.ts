import { Process } from '../core/Process';

export interface SchedulingStrategy {
  /**
   * Evaluates the ready queue and returns the next process to execute.
   * Returns the updated ready queue (with the selected process removed, and any preempted processes added).
   */
  getNextProcess(
    readyQueue: Process[],
    currentTime: number,
    currentRunningProcess: Process | null
  ): { nextProcess: Process | null, updatedQueue: Process[] };
}
