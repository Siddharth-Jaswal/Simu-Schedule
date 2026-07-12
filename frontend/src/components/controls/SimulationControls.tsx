import { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Plus } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { ProcessDTO } from '@shared/types';
import { DraggableProcess } from './DraggableProcess';

export function SimulationControls() {
  const [algorithms, setAlgorithms] = useState<string[]>([]);
  const { config, setConfig, isRunning, setIsRunning, state, stagedProcesses, addStagedProcess } = useSimulationStore();
  
  const [burstTime, setBurstTime] = useState(5);
  const [priority, setPriority] = useState(0);

  useEffect(() => {
    apiClient.getAlgorithms().then(setAlgorithms).catch(console.error);
  }, []);

  const handleStart = async () => {
    // Only pass config. Processes arrive dynamically now.
    await apiClient.start(config, []);
    setIsRunning(true);
  };

  const handlePauseResume = async () => {
    if (isRunning) {
      await apiClient.pause();
    } else {
      await apiClient.resume();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = async () => {
    await apiClient.reset();
    setIsRunning(false);
  };

  const handleSpeedChange = async (speed: number) => {
    await apiClient.setSpeed(speed);
  };

  const handleCreateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    const newProcess: ProcessDTO = {
      pid: `P${Math.floor(Math.random() * 1000)}`,
      arrivalTime: 0,
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
    addStagedProcess(newProcess);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">Algorithm</label>
        <select 
          className="bg-black/20 border border-white/10 rounded-md p-2 text-foreground outline-none focus:ring-2 ring-primary"
          value={config.algorithm}
          onChange={(e) => setConfig({ ...config, algorithm: e.target.value })}
        >
          {algorithms.map(alg => (
            <option key={alg} value={alg} className="bg-background">{alg}</option>
          ))}
        </select>
      </div>

      {(config.algorithm === 'RR' || config.algorithm === 'MLFQ') && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Time Quantum</label>
          <input 
            type="number" 
            min="1" 
            value={config.quantum} 
            onChange={(e) => setConfig({ ...config, quantum: parseInt(e.target.value) || 2 })}
            className="bg-black/20 border border-white/10 rounded-md p-2 outline-none focus:ring-2 ring-primary"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-2">
        {!state ? (
          <button onClick={handleStart} className="col-span-2 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex justify-center items-center gap-2">
            <Play className="w-4 h-4" /> Start Simulation
          </button>
        ) : (
          <>
            <button onClick={handlePauseResume} className={`${isRunning ? 'bg-sim-orange text-white' : 'bg-sim-green text-white'} py-2 rounded-md font-medium hover:opacity-90 transition-colors flex justify-center items-center gap-2`}>
              {isRunning ? <><Square className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
            </button>
            <button onClick={handleReset} className="bg-destructive text-destructive-foreground py-2 rounded-md font-medium hover:bg-destructive/90 transition-colors flex justify-center items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="text-sm font-medium text-muted-foreground">Simulation Speed</label>
        <div className="flex gap-2">
          <button onClick={() => handleSpeedChange(1000)} className="flex-1 text-xs py-1 glass-panel hover:bg-white/5 rounded">1x</button>
          <button onClick={() => handleSpeedChange(500)} className="flex-1 text-xs py-1 glass-panel hover:bg-white/5 rounded">2x</button>
          <button onClick={() => handleSpeedChange(100)} className="flex-1 text-xs py-1 glass-panel hover:bg-white/5 rounded">10x</button>
        </div>
      </div>

      <hr className="border-white/10 my-2" />

      {/* Process Builder */}
      <div>
        <h3 className="font-medium mb-3 flex items-center gap-2 text-sim-cyan">
          <Plus className="w-4 h-4" /> Create Process
        </h3>
        <form onSubmit={handleCreateProcess} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Burst Time</label>
            <input type="number" min="1" value={burstTime} onChange={e => setBurstTime(parseInt(e.target.value) || 1)} className="bg-black/20 border border-white/10 rounded px-2 py-1 outline-none focus:ring-1 ring-primary" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Priority (lower is higher)</label>
            <input type="number" min="0" value={priority} onChange={e => setPriority(parseInt(e.target.value) || 0)} className="bg-black/20 border border-white/10 rounded px-2 py-1 outline-none focus:ring-1 ring-primary" required />
          </div>
          <button type="submit" className="bg-secondary text-secondary-foreground py-1.5 rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors">
            Stage Process
          </button>
        </form>
      </div>

      {/* Staging Area */}
      {stagedProcesses.length > 0 && (
        <div className="mt-4 border border-dashed border-white/20 p-3 rounded-xl bg-black/10">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Drag to Ready Queue</h4>
          <div className="flex flex-wrap gap-2">
            {stagedProcesses.map(p => (
              <DraggableProcess key={p.pid} process={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
