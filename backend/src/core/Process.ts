import { ProcessDTO, ProcessState } from '@shared/types';

export class Process {
  public pid: string;
  public arrivalTime: number;
  public burstTime: number;
  public priority: number;
  
  public remainingTime: number;
  public waitingTime: number = 0;
  public turnaroundTime: number = 0;
  public completionTime: number = 0;
  public responseTime: number = -1;
  public state: ProcessState = 'NEW';
  public color: string;

  private firstScheduled: boolean = false;

  constructor(pid: string, arrivalTime: number, burstTime: number, priority: number = 0, color: string = '#ffffff') {
    this.pid = pid;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
    this.remainingTime = burstTime;
    this.priority = priority;
    this.color = color;
  }

  public setReady(): void {
    if (this.state === 'NEW' || this.state === 'RUNNING' || this.state === 'WAITING') {
      this.state = 'READY';
    }
  }

  public setRunning(currentTime: number): void {
    this.state = 'RUNNING';
    if (!this.firstScheduled) {
      this.responseTime = currentTime - this.arrivalTime;
      this.firstScheduled = true;
    }
  }

  public setWaiting(): void {
    this.state = 'WAITING';
  }

  public executeTick(): void {
    if (this.state === 'RUNNING' && this.remainingTime > 0) {
      this.remainingTime -= 1;
    }
  }

  public terminate(currentTime: number): void {
    this.state = 'TERMINATED';
    this.completionTime = currentTime + 1;
    this.turnaroundTime = this.completionTime - this.arrivalTime;
    this.waitingTime = this.turnaroundTime - this.burstTime;
  }

  public isCompleted(): boolean {
    return this.remainingTime === 0;
  }

  public toDTO(): ProcessDTO {
    return {
      pid: this.pid,
      arrivalTime: this.arrivalTime,
      burstTime: this.burstTime,
      priority: this.priority,
      remainingTime: this.remainingTime,
      waitingTime: this.waitingTime,
      turnaroundTime: this.turnaroundTime,
      completionTime: this.completionTime,
      responseTime: this.responseTime,
      state: this.state,
      color: this.color
    };
  }
}
