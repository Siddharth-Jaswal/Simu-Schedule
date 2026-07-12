import { Play, Square, RotateCcw, FastForward } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useSimulationStore } from '../../store/useSimulationStore';

export function SimulationControls() {
  const { config, isRunning, setIsRunning, state, isFinishedInstantly, setIsFinishedInstantly, isComplete, reset } = useSimulationStore();
  
  const handlePauseResume = async () => {
    if (isRunning) {
      await apiClient.pause();
    } else {
      await apiClient.resume();
    }
    setIsRunning(!isRunning);
  };

  const handleFinishInstantly = async () => {
    setIsFinishedInstantly(true);
    await apiClient.finish();
    setIsRunning(false);
  };

  const handleReset = async () => {
    await apiClient.reset();
    reset(); // Reset local store
  };

  const handleSpeedChange = async (speed: number) => {
    await apiClient.setSpeed(speed);
  };

  let statusText = "Ready";
  let statusColor = "text-muted-foreground";
  
  if (state) {
    if (isFinishedInstantly) {
      statusText = "Completed (Instantly)";
      statusColor = "text-sim-purple";
    } else if (isComplete) {
      statusText = "Completed";
      statusColor = "text-sim-purple";
    } else if (isRunning) {
      statusText = "Running";
      statusColor = "text-sim-green animate-pulse";
    } else {
      statusText = "Paused";
      statusColor = "text-sim-orange";
    }
  }

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 sticky top-4 z-40 border border-white/10 bg-black/40 backdrop-blur-md mb-8">
      
      <div className="flex items-center gap-6">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Algorithm</div>
          <div className="font-bold text-primary">{config.algorithm} {config.algorithm === 'RR' ? `(Q=${config.quantum})` : ''}</div>
        </div>
        
        <div className="h-8 w-px bg-white/10 mx-2"></div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Status</div>
          <div className={`font-bold ${statusColor}`}>{statusText}</div>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2"></div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Clock Tick</div>
          <div className="font-mono font-bold text-xl">{state?.clock || 0}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-black/30 rounded-lg p-1 border border-white/5 mr-4">
          <button onClick={() => handleSpeedChange(1000)} className="px-3 py-1.5 text-xs hover:bg-white/10 rounded-md transition-colors">1x</button>
          <button onClick={() => handleSpeedChange(500)} className="px-3 py-1.5 text-xs hover:bg-white/10 rounded-md transition-colors">2x</button>
          <button onClick={() => handleSpeedChange(100)} className="px-3 py-1.5 text-xs hover:bg-white/10 rounded-md transition-colors">10x</button>
        </div>

        <button 
          onClick={handlePauseResume} 
          disabled={isComplete || isFinishedInstantly}
          className={`${isRunning ? 'bg-sim-orange text-white' : 'bg-sim-green text-white'} px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRunning ? <><Square className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> {state?.clock && state.clock > 0 ? 'Resume' : 'Play'}</>}
        </button>
        
        <button 
          onClick={handleFinishInstantly}
          disabled={isComplete || isFinishedInstantly || (!isRunning && !state)}
          className="bg-sim-purple text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FastForward className="w-4 h-4" /> Finish Instantly
        </button>

        <button 
          onClick={handleReset} 
          className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

    </div>
  );
}
