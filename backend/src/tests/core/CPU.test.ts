import { CPU } from '../../core/CPU';
import { Process } from '../../core/Process';
import { SimulationEventEmitter } from '../../events/SimulationEventEmitter';
import { SimulationEventType } from '../../events/SimulationEvents';

describe('CPU', () => {
  let cpu: CPU;
  let emitter: SimulationEventEmitter;

  beforeEach(() => {
    emitter = new SimulationEventEmitter();
    cpu = new CPU(emitter);
  });

  it('should initialize with no running process', () => {
    expect(cpu.getRunningProcess()).toBeNull();
  });

  it('should set process and emit scheduled event', () => {
    const process = new Process('P1', 0, 5);
    const mockFn = jest.fn();
    emitter.on(SimulationEventType.PROCESS_SCHEDULED, mockFn);
    emitter.on(SimulationEventType.CONTEXT_SWITCH, mockFn);

    cpu.setProcess(process, 1);
    
    expect(cpu.getRunningProcess()).toBe(process);
    expect(mockFn).toHaveBeenCalledTimes(2); // scheduled + context switch
  });

  it('should preempt previous process when setting new one', () => {
    const p1 = new Process('P1', 0, 5);
    const p2 = new Process('P2', 1, 3);
    const mockPreempt = jest.fn();
    
    emitter.on(SimulationEventType.PROCESS_PREEMPTED, mockPreempt);
    
    cpu.setProcess(p1, 1);
    cpu.setProcess(p2, 2);
    
    expect(mockPreempt).toHaveBeenCalledTimes(1);
    expect(p1.state).toBe('READY');
  });

  it('should execute tick and decrease remaining time', () => {
    const process = new Process('P1', 0, 2);
    cpu.setProcess(process, 0);
    
    cpu.executeTick(1);
    expect(process.remainingTime).toBe(1);
  });

  it('should emit idle event if no process is running', () => {
    const mockIdle = jest.fn();
    emitter.on(SimulationEventType.CPU_IDLE, mockIdle);
    
    cpu.executeTick(1);
    expect(mockIdle).toHaveBeenCalledTimes(1);
  });

  it('should emit completed event when process finishes', () => {
    const process = new Process('P1', 0, 1);
    const mockComplete = jest.fn();
    emitter.on(SimulationEventType.PROCESS_COMPLETED, mockComplete);
    
    cpu.setProcess(process, 0);
    cpu.executeTick(1);
    
    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(cpu.getRunningProcess()).toBeNull();
  });
});
