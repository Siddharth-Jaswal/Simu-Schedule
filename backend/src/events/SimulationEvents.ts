import { ProcessDTO, MetricsDTO } from '@shared/types';

export enum SimulationEventType {
  TICK = 'TickEvent',
  PROCESS_ARRIVAL = 'ProcessArrivalEvent',
  PROCESS_SCHEDULED = 'ProcessScheduledEvent',
  PROCESS_COMPLETED = 'ProcessCompletedEvent',
  PROCESS_PREEMPTED = 'ProcessPreemptedEvent',
  CONTEXT_SWITCH = 'ContextSwitchEvent',
  CPU_IDLE = 'CPUIdleEvent',
  METRICS_UPDATED = 'MetricsUpdatedEvent',
}

export interface SimulationEventPayloads {
  [SimulationEventType.TICK]: { time: number };
  [SimulationEventType.PROCESS_ARRIVAL]: { process: ProcessDTO };
  [SimulationEventType.PROCESS_SCHEDULED]: { process: ProcessDTO; time: number };
  [SimulationEventType.PROCESS_COMPLETED]: { process: ProcessDTO; time: number };
  [SimulationEventType.PROCESS_PREEMPTED]: { process: ProcessDTO; time: number };
  [SimulationEventType.CONTEXT_SWITCH]: { from: string | null; to: string | null; time: number };
  [SimulationEventType.CPU_IDLE]: { time: number };
  [SimulationEventType.METRICS_UPDATED]: { metrics: MetricsDTO };
}
