import { useState, useEffect } from 'react';
import { Play, Square, FastForward, RotateCcw } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useSimulationStore } from '../../store/useSimulationStore';
import { ProcessDTO } from '@shared/types';

export function SimulationControls() {
  const [algorithms, setAlgorithms] = useState<string[]>([]);
  const { config, setConfig, isRunning, setIsRunning, state, processes } = useSimulationStore();
  const [processCount, setProcessCount] = useState(5);

  useEffect(() => {
    apiClient.getAlgorithms().then(setAlgorithms).catch(console.error);
  }, []);

  const generateProcesses = (): ProcessDTO[] => {
    const procs: ProcessDTO[] = [];
    for (let i = 1; i <= processCount; i++) {
      procs.push({
        pid: `P${i}`,
        arrivalTime: Math.floor(Math.random() * 5),
        burstTime: Math.floor(Math.random() * 8) + 2,
        priority: Math.floor(Math.random() * 5),
        remainingTime: 0,
        waitingTime: 0,
        turnaroundTime: 0,
        completionTime: 0,
        responseTime: -1,
        state: 'NEW',
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      });
    }
    return procs;
  };

  const handleStart = async () => {
    const procs = generateProcesses();
    await apiClient.start(config, procs);
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">Process Count</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" max="20" 
            value={processCount} 
            onChange={(e) => setProcessCount(parseInt(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="font-mono bg-black/20 px-2 py-1 rounded border border-white/10">{processCount}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="text-sm font-medium text-muted-foreground">Simulation Speed</label>
        <div className="flex gap-2">
          <button onClick={() => handleSpeedChange(1000)} className="flex-1 text-xs py-1 glass-panel hover:bg-white/5 rounded">1x</button>
          <button onClick={() => handleSpeedChange(500)} className="flex-1 text-xs py-1 glass-panel hover:bg-white/5 rounded">2x</button>
          <button onClick={() => handleSpeedChange(100)} className="flex-1 text-xs py-1 glass-panel hover:bg-white/5 rounded">10x</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
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
    </div>
  );
}
