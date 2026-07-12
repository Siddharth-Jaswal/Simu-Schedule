import { useSimulationStore } from '../../store/useSimulationStore';
import { Activity } from 'lucide-react';

export function GlobalMetrics() {
  const { state, isComplete, isFinishedInstantly } = useSimulationStore();
  const metrics = state?.metrics;

  const isDone = isComplete || isFinishedInstantly;

  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-border/50">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        Global Metrics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-xl border border-border/50 bg-black/5 dark:bg-black/20">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Clock</div>
          <div className="text-2xl font-bold text-foreground font-mono">{state?.clock || 0}</div>
        </div>
        
        <div className="glass-card p-4 rounded-xl border border-border/50 bg-black/5 dark:bg-black/20">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-sim-green" /> CPU Util
          </div>
          <div className="text-2xl font-bold text-sim-green font-mono">
            {isDone ? '0.0' : (metrics ? metrics.cpuUtilization.toFixed(1) : '0.0')}%
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-border/50 bg-black/5 dark:bg-black/20">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Throughput</div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {metrics ? metrics.throughput.toFixed(2) : '0.00'}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-border/50 bg-black/5 dark:bg-black/20">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Avg Wait</div>
          <div className="text-2xl font-bold text-sim-orange font-mono">
            {metrics ? metrics.waitingTime.toFixed(2) : '0.00'}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-border/50 bg-black/5 dark:bg-black/20">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Avg Turnaround</div>
          <div className="text-2xl font-bold text-sim-cyan font-mono">
            {metrics ? metrics.turnaroundTime.toFixed(2) : '0.00'}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-border/50 bg-black/5 dark:bg-black/20">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Switches</div>
          <div className="text-2xl font-bold text-sim-red font-mono">
            {metrics ? metrics.contextSwitches : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
