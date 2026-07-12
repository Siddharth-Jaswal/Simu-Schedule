import { SchedulingStrategy } from '../interfaces/SchedulingStrategy';
import { FCFS } from '../algorithms/FCFS';
import { SJF } from '../algorithms/SJF';
import { SRTF } from '../algorithms/SRTF';
import { RoundRobin } from '../algorithms/RoundRobin';
import { Priority } from '../algorithms/Priority';
import { MLFQ } from '../algorithms/MLFQ';
import { SimulationConfig } from '@shared/types';

export class SchedulerFactory {
  public static create(config: SimulationConfig): SchedulingStrategy {
    switch (config.algorithm.toUpperCase()) {
      case 'FCFS':
        return new FCFS();
      case 'SJF':
        return new SJF();
      case 'SRTF':
        return new SRTF();
      case 'RR':
        return new RoundRobin(config.quantum || 2);
      case 'PRIORITY':
        // Assuming priority is preemptive if not explicitly non-preemptive.
        // For lab, we can default to preemptive Priority
        return new Priority(true);
      case 'PRIORITY_NP':
        return new Priority(false);
      case 'MLFQ':
        return new MLFQ();
      default:
        throw new Error(`Unknown scheduling algorithm: ${config.algorithm}`);
    }
  }
}
