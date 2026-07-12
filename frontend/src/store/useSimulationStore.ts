import { create } from 'zustand';
import type { SimulationStateDTO, ProcessDTO, SimulationConfig } from '@shared/types';

interface SimulationStore {
  // Connection state
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
  isApiReady: boolean;
  setIsApiReady: (status: boolean) => void;

  // Simulation Data
  state: SimulationStateDTO | null;
  setState: (state: SimulationStateDTO) => void;
  
  metricsHistory: Array<{ clock: number; cpuUtilization: number; waitingTime: number }>;

  // Processes detail mapping (from arrival events)
  processes: Record<string, ProcessDTO>;
  addOrUpdateProcess: (process: ProcessDTO) => void;
  
  // Local Config
  config: SimulationConfig;
  setConfig: (config: SimulationConfig) => void;

  // App state
  isRunning: boolean;
  setIsRunning: (status: boolean) => void;
  hasStarted: boolean;
  setHasStarted: (status: boolean) => void;
  isFinishedInstantly: boolean;
  setIsFinishedInstantly: (status: boolean) => void;
  isComplete: boolean;
  setIsComplete: (status: boolean) => void;

  // Pre-simulation Workload
  queuedWorkload: ProcessDTO[];
  addQueuedProcess: (process: ProcessDTO) => void;
  removeQueuedProcess: (pid: string) => void;
  editQueuedProcess: (process: ProcessDTO) => void;

  // Event Log
  eventLogs: string[];
  addEventLog: (log: string) => void;
  
  reset: () => void;
}

const DEFAULT_CONFIG: SimulationConfig = {
  algorithm: 'FCFS',
  quantum: 2,
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),
  isApiReady: false,
  setIsApiReady: (status) => set({ isApiReady: status }),
  
  state: null,
  metricsHistory: [],
  setState: (state) => set((store) => {
    const history = [...store.metricsHistory];
    if (state.clock > 0 && (!history.length || history[history.length - 1].clock !== state.clock)) {
      history.push({
        clock: state.clock,
        cpuUtilization: state.metrics.cpuUtilization,
        waitingTime: state.metrics.waitingTime
      });
    }
    // Keep last 100 points
    if (history.length > 100) history.shift();
    return { state, metricsHistory: history };
  }),
  
  processes: {},
  addOrUpdateProcess: (process) => set((store) => ({
    processes: { ...store.processes, [process.pid]: process }
  })),

  config: DEFAULT_CONFIG,
  setConfig: (config) => set({ config }),
  
  isRunning: false,
  setIsRunning: (status) => set({ isRunning: status }),
  hasStarted: false,
  setHasStarted: (status) => set({ hasStarted: status }),
  isFinishedInstantly: false,
  setIsFinishedInstantly: (status) => set({ isFinishedInstantly: status }),
  isComplete: false,
  setIsComplete: (status) => set({ isComplete: status }),

  queuedWorkload: [],
  addQueuedProcess: (process) => set((store) => ({
    queuedWorkload: [...store.queuedWorkload, process]
  })),
  removeQueuedProcess: (pid) => set((store) => ({
    queuedWorkload: store.queuedWorkload.filter(p => p.pid !== pid)
  })),
  editQueuedProcess: (process) => set((store) => ({
    queuedWorkload: store.queuedWorkload.map(p => p.pid === process.pid ? process : p)
  })),

  eventLogs: [],
  addEventLog: (log) => set((store) => ({
    eventLogs: [...store.eventLogs, log]
  })),

  reset: () => set({ 
    state: null, 
    processes: {}, 
    isRunning: false, 
    hasStarted: false,
    isFinishedInstantly: false,
    isComplete: false,
    eventLogs: [],
    metricsHistory: [] 
    // Notice: we don't clear queuedWorkload on reset so they can replay
  })
}));
