import type { SimulationConfig, ProcessDTO } from '@shared/types';

let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/simulation';

// Automatically correct the URL if the user forgot to append /api/simulation
if (!API_BASE.includes('/api/simulation')) {
  API_BASE = API_BASE.replace(/\/$/, '') + '/api/simulation';
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network or parsing error' }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
};

export const apiClient = {
  healthCheck: async () => {
    return fetch(`${API_BASE}/algorithms`).then(handleResponse);
  },

  start: async (config: SimulationConfig, processes: ProcessDTO[]) => {
    return fetch(`${API_BASE}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, processes }),
    }).then(handleResponse);
  },
  
  pause: async () => {
    return fetch(`${API_BASE}/pause`, { method: 'POST' }).then(handleResponse);
  },
  
  resume: async () => {
    return fetch(`${API_BASE}/resume`, { method: 'POST' }).then(handleResponse);
  },
  
  finish: async () => {
    return fetch(`${API_BASE}/finish`, { method: 'POST' }).then(handleResponse);
  },
  
  reset: async () => {
    return fetch(`${API_BASE}/reset`, { method: 'POST' }).then(handleResponse);
  },
  
  step: async () => {
    return fetch(`${API_BASE}/step`, { method: 'POST' }).then(handleResponse);
  },

  setSpeed: async (speedMs: number) => {
    return fetch(`${API_BASE}/speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speedMs }),
    }).then(handleResponse);
  },

  getAlgorithms: async () => {
    return fetch(`${API_BASE}/algorithms`).then(handleResponse);
  },

  addProcess: async (process: ProcessDTO) => {
    return fetch(`${API_BASE}/processes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(process),
    }).then(handleResponse);
  }
};
