export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';

export interface ProcessDTO {
  pid: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  waitingTime: number;
  turnaroundTime: number;
  completionTime: number;
  responseTime: number;
  state: ProcessState;
  color: string;
}

export interface MetricsDTO {
  cpuUtilization: number;
  throughput: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  contextSwitches: number;
}

export interface SimulationStateDTO {
  clock: number;
  cpu: { running: string | null };
  readyQueue: string[];
  waitingQueue: string[];
  completed: string[];
  metrics: MetricsDTO;
}

export interface SimulationConfig {
  algorithm: string;
  quantum?: number;
  processCount?: number;
}
