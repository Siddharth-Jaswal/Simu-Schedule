import { MetricsCollector } from '../../metrics/MetricsCollector';
import { SimulationEventEmitter } from '../../events/SimulationEventEmitter';
import { SimulationEventType } from '../../events/SimulationEvents';
import { Process } from '../../core/Process';

describe('MetricsCollector', () => {
  let emitter: SimulationEventEmitter;
  let collector: MetricsCollector;

  beforeEach(() => {
    emitter = new SimulationEventEmitter();
    collector = new MetricsCollector(emitter);
  });

  it('should initialize with zero metrics', () => {
    const metrics = collector.getMetrics();
    expect(metrics.cpuUtilization).toBe(0);
    expect(metrics.throughput).toBe(0);
    expect(metrics.contextSwitches).toBe(0);
  });

  it('should calculate CPU utilization correctly', () => {
    emitter.emit(SimulationEventType.TICK, { time: 1 });
    emitter.emit(SimulationEventType.TICK, { time: 2 });
    emitter.emit(SimulationEventType.CPU_IDLE, { time: 2 });
    
    const metrics = collector.getMetrics();
    expect(metrics.cpuUtilization).toBe(50); // 1 idle out of 2 ticks
  });

  it('should increment context switches', () => {
    emitter.emit(SimulationEventType.CONTEXT_SWITCH, { from: null, to: 'P1', time: 1 });
    
    const metrics = collector.getMetrics();
    expect(metrics.contextSwitches).toBe(1);
  });

  it('should aggregate process metrics correctly', () => {
    const p1 = new Process('P1', 0, 5);
    p1.waitingTime = 2;
    p1.turnaroundTime = 7;
    p1.responseTime = 2;

    const p2 = new Process('P2', 2, 4);
    p2.waitingTime = 4;
    p2.turnaroundTime = 8;
    p2.responseTime = 4;

    emitter.emit(SimulationEventType.TICK, { time: 1 });
    emitter.emit(SimulationEventType.TICK, { time: 2 });
    
    emitter.emit(SimulationEventType.PROCESS_COMPLETED, { process: p1.toDTO(), time: 7 });
    emitter.emit(SimulationEventType.PROCESS_COMPLETED, { process: p2.toDTO(), time: 10 });
    
    const metrics = collector.getMetrics();
    expect(metrics.waitingTime).toBe(3); // (2+4)/2
    expect(metrics.turnaroundTime).toBe(7.5); // (7+8)/2
    expect(metrics.responseTime).toBe(3); // (2+4)/2
    expect(metrics.throughput).toBe(1); // 2 processes / 2 ticks
  });
});
