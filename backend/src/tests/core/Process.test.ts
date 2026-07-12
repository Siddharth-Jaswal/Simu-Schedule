import { Process } from '../../core/Process';

describe('Process', () => {
  let process: Process;

  beforeEach(() => {
    process = new Process('P1', 0, 5, 1);
  });

  it('should initialize with NEW state', () => {
    expect(process.state).toBe('NEW');
    expect(process.remainingTime).toBe(5);
  });

  it('should transition to READY state', () => {
    process.setReady();
    expect(process.state).toBe('READY');
  });

  it('should calculate response time on first RUNNING state', () => {
    process.setRunning(2);
    expect(process.state).toBe('RUNNING');
    expect(process.responseTime).toBe(2);
  });

  it('should not update response time on subsequent RUNNING states', () => {
    process.setRunning(2);
    process.setReady();
    process.setRunning(5);
    expect(process.responseTime).toBe(2); // Still 2
  });

  it('should decrease remaining time when executing tick', () => {
    process.setRunning(0);
    process.executeTick();
    expect(process.remainingTime).toBe(4);
  });

  it('should transition to TERMINATED state and calculate turnaround time', () => {
    process.terminate(10);
    expect(process.state).toBe('TERMINATED');
    expect(process.completionTime).toBe(10);
    expect(process.turnaroundTime).toBe(10); // 10 - 0
  });

});
