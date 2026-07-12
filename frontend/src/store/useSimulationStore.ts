import { create } from 'zustand';
import { SimulationStateDTO, ProcessDTO, SimulationConfig } from '@shared/types';

interface SimulationStore {
  // Connection state
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;

  // Simulation Data
  state: SimulationStateDTO | null;
  setState: (state: SimulationStateDTO) => void;

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
  setState: (state) => set({ state }),
  
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
