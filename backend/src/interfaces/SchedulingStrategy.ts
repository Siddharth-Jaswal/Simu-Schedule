import { Process } from '../core/Process';

export interface SchedulingStrategy {
  addProcess(process: Process): void;
  getNextProcess(currentTime: number, currentRunningProcess: Process | null): Process | null;
  removeProcess(pid: string): void;
  getQueue(): Process[];
  isEmpty(): boolean;
}
