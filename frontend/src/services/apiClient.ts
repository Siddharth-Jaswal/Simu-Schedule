import type { SimulationConfig, ProcessDTO } from '@shared/types';

const API_BASE = 'http://localhost:3001/api';

export const apiClient = {
  start: async (config: SimulationConfig, processes: ProcessDTO[]) => {
    return fetch(`${API_BASE}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, processes }),
    }).then(res => res.json());
  },
  
  pause: async () => {
    return fetch(`${API_BASE}/pause`, { method: 'POST' }).then(res => res.json());
  },
  
  resume: async () => {
    return fetch(`${API_BASE}/resume`, { method: 'POST' }).then(res => res.json());
  },
  
  reset: async () => {
    return fetch(`${API_BASE}/reset`, { method: 'POST' }).then(res => res.json());
  },
  
  step: async () => {
    return fetch(`${API_BASE}/step`, { method: 'POST' }).then(res => res.json());
  },

  setSpeed: async (speedMs: number) => {
    return fetch(`${API_BASE}/speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speedMs }),
    }).then(res => res.json());
  },

  getAlgorithms: async () => {
    return fetch(`${API_BASE}/algorithms`).then(res => res.json());
  }
};
