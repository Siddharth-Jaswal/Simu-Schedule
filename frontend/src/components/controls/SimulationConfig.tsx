import { useState, useEffect } from 'react';
import { Plus, Trash, Play } from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { apiClient } from '../../services/apiClient';
import type { ProcessDTO } from '@shared/types';

export function SimulationConfig() {
  const { config, setConfig, queuedWorkload, addQueuedProcess, removeQueuedProcess, setIsRunning } = useSimulationStore();
  const [algorithms, setAlgorithms] = useState<string[]>([]);
  
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(5);
  const [priority, setPriority] = useState(0);

  useEffect(() => {
    apiClient.getAlgorithms().then(setAlgorithms).catch(console.error);
  }, []);

  const handleAddWorkload = (e: React.FormEvent) => {
    e.preventDefault();
    const newProcess: ProcessDTO = {
      pid: `P${Math.floor(Math.random() * 1000)}`,
      arrivalTime,
      burstTime,
      priority,
      remainingTime: burstTime,
      waitingTime: 0,
      turnaroundTime: 0,
      completionTime: 0,
      responseTime: -1,
      state: 'NEW',
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
    };
    addQueuedProcess(newProcess);
  };

  const handleStart = async () => {
    await apiClient.start(config, queuedWorkload);
    setIsRunning(true);
  };

  const showQuantum = config.algorithm === 'RR' || config.algorithm === 'MLFQ';
  const showPriority = config.algorithm === 'PRIORITY' || config.algorithm === 'PRIORITY_NP' || config.algorithm === 'MLFQ';

  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        1. Simulation Configuration
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Algorithm</label>
          <select 
            className="bg-black/20 border border-white/10 rounded-md p-2 outline-none focus:ring-2 ring-primary"
            value={config.algorithm}
            onChange={(e) => setConfig({ ...config, algorithm: e.target.value })}
          >
            {algorithms.map(alg => (
              <option key={alg} value={alg} className="bg-background">{alg}</option>
            ))}
          </select>
        </div>

        {showQuantum && (
          <div className="flex flex-col gap-2 animate-in fade-in zoom-in duration-300">
            <label className="text-sm font-medium text-muted-foreground">Time Quantum</label>
            <input 
              type="number" min="1" 
              value={config.quantum} 
              onChange={(e) => setConfig({ ...config, quantum: parseInt(e.target.value) || 2 })}
              className="bg-black/20 border border-white/10 rounded-md p-2 outline-none focus:ring-2 ring-primary"
            />
          </div>
        )}
      </div>

      <hr className="border-white/5 my-6" />

      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-sim-cyan">
        Workload Builder
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleAddWorkload} className="flex flex-col gap-4 bg-black/10 p-4 rounded-xl border border-white/5 h-fit">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Arrival Time</label>
              <input type="number" min="0" value={arrivalTime} onChange={e => setArrivalTime(parseInt(e.target.value) || 0)} className="bg-black/20 border border-white/10 rounded px-2 py-1.5 outline-none focus:ring-1 ring-primary" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Burst Time</label>
              <input type="number" min="1" value={burstTime} onChange={e => setBurstTime(parseInt(e.target.value) || 1)} className="bg-black/20 border border-white/10 rounded px-2 py-1.5 outline-none focus:ring-1 ring-primary" required />
            </div>
          </div>
          
          {showPriority && (
            <div className="flex flex-col gap-1 animate-in slide-in-from-top-2">
              <label className="text-xs text-muted-foreground">Priority (lower is higher)</label>
              <input type="number" min="0" value={priority} onChange={e => setPriority(parseInt(e.target.value) || 0)} className="bg-black/20 border border-white/10 rounded px-2 py-1.5 outline-none focus:ring-1 ring-primary" required />
            </div>
          )}

          <button type="submit" className="bg-secondary text-secondary-foreground py-2 rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 mt-2">
            <Plus className="w-4 h-4" /> Add to Workload
          </button>
        </form>

        {/* Queued Workload List */}
        <div className="lg:col-span-2 bg-black/10 p-4 rounded-xl border border-white/5">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Queued Processes ({queuedWorkload.length})</h4>
          
          {queuedWorkload.length === 0 ? (
            <div className="text-sm text-muted-foreground/50 h-32 flex items-center justify-center border border-dashed border-white/10 rounded-lg">
              No processes queued. Add some to start!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-black/20 border-b border-white/10">
                  <tr>
                    <th className="px-3 py-2 rounded-tl-lg">PID</th>
                    <th className="px-3 py-2">Arrival</th>
                    <th className="px-3 py-2">Burst</th>
                    {showPriority && <th className="px-3 py-2">Priority</th>}
                    <th className="px-3 py-2 rounded-tr-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queuedWorkload.map(p => (
                    <tr key={p.pid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                        {p.pid}
                      </td>
                      <td className="px-3 py-2">{p.arrivalTime}</td>
                      <td className="px-3 py-2">{p.burstTime}</td>
                      {showPriority && <td className="px-3 py-2">{p.priority}</td>}
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => removeQueuedProcess(p.pid)} className="text-red-400 hover:text-red-300">
                          <Trash className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleStart} 
          disabled={queuedWorkload.length === 0}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" /> Start Simulation
        </button>
      </div>
    </div>
  );
}
