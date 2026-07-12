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

  it('should calculate CPU utilization correctly', () => {
    // 10 ticks total, CPU active for 6
    emitter.emit(SimulationEventType.TICK, { time: 1 });
    emitter.emit(SimulationEventType.CPU_IDLE, { time: 1 });
    
    for (let i = 2; i <= 7; i++) {
      emitter.emit(SimulationEventType.TICK, { time: i });
      // Not idle
    }
    
    for (let i = 8; i <= 10; i++) {
      emitter.emit(SimulationEventType.TICK, { time: i });
      emitter.emit(SimulationEventType.CPU_IDLE, { time: i });
    }

    const metrics = collector.getMetrics();
    expect(metrics.cpuUtilization).toBe(60); // 6 / 10
  });

  it('should collect averages when processes complete', () => {
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
    
    emitter.emit(SimulationEventType.PROCESS_COMPLETED, { process: p1, time: 7 });
    emitter.emit(SimulationEventType.PROCESS_COMPLETED, { process: p2, time: 10 });
    
    const metrics = collector.getMetrics();
    expect(metrics.waitingTime).toBe(3); // (2+4)/2
    expect(metrics.turnaroundTime).toBe(7.5); // (7+8)/2
    expect(metrics.responseTime).toBe(3); // (2+4)/2
    expect(metrics.throughput).toBe(1); // 2 processes / 2 ticks
  });
});
