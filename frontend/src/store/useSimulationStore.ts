import { create } from 'zustand';
import type { SimulationStateDTO, ProcessDTO, SimulationConfig } from '@shared/types';

interface SimulationStore {
  // Connection state
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;

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
  
  reset: () => void;
}

const DEFAULT_CONFIG: SimulationConfig = {
  algorithm: 'FCFS',
  quantum: 2,
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),
  
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

  reset: () => set({ state: null, processes: {}, isRunning: false })
}));
