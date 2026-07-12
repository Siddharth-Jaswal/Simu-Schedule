import { Process } from './Process';
import { SimulationEventEmitter } from '../events/SimulationEventEmitter';
import { SimulationEventType } from '../events/SimulationEvents';

export class CPU {
  private currentProcess: Process | null = null;
  private emitter: SimulationEventEmitter;

  constructor(emitter: SimulationEventEmitter) {
    this.emitter = emitter;
  }

  public getRunningProcess(): Process | null {
    return this.currentProcess;
  }

  public setProcess(process: Process | null, currentTime: number): void {
    const prev = this.currentProcess;
    
    if (prev && prev !== process) {
      if (!prev.isCompleted()) {
        prev.setReady();
        this.emitter.emit(SimulationEventType.PROCESS_PREEMPTED, { process: prev, time: currentTime });
      }
    }

    this.currentProcess = process;
    
    if (this.currentProcess) {
      this.currentProcess.setRunning(currentTime);
      this.emitter.emit(SimulationEventType.PROCESS_SCHEDULED, { process: this.currentProcess, time: currentTime });
    }

    if (prev?.pid !== process?.pid) {
      this.emitter.emit(SimulationEventType.CONTEXT_SWITCH, { 
        from: prev ? prev.pid : null, 
        to: process ? process.pid : null, 
        time: currentTime 
      });
    }
  }

  public executeTick(currentTime: number): void {
    if (this.currentProcess) {
      this.currentProcess.executeTick();
      
      if (this.currentProcess.isCompleted()) {
        this.currentProcess.terminate(currentTime);
        this.emitter.emit(SimulationEventType.PROCESS_COMPLETED, { 
          process: this.currentProcess, 
          time: currentTime 
        });
        this.currentProcess = null; // Free CPU
      }
    } else {
      this.emitter.emit(SimulationEventType.CPU_IDLE, { time: currentTime });
    }
  }
}
