import { useSimulationStore } from '../../store/useSimulationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function CompletedTable() {
  const { state, processes } = useSimulationStore();
  
  const completedProcesses = (state?.completed || []).map(pid => processes[pid]).filter(Boolean);

  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-border/50">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        Completed Processes
        <span className="bg-foreground/10 text-xs px-2 py-0.5 rounded-full text-foreground font-normal">{completedProcesses.length}</span>
      </h2>

      {completedProcesses.length === 0 ? (
        <div className="text-center text-muted-foreground/50 py-8 border border-dashed border-border/50 rounded-xl">
          No processes have completed yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/50 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-black/5 dark:bg-black/40 border-b border-border/50">
              <tr>
                <th className="px-4 py-3">PID</th>
                <th className="px-4 py-3">Arrival</th>
                <th className="px-4 py-3">Burst</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Completion Time</th>
                <th className="px-4 py-3">Turnaround Time</th>
                <th className="px-4 py-3">Waiting Time</th>
                <th className="px-4 py-3">Response Time</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <AnimatePresence>
                {completedProcesses.map(p => (
                  <motion.tr 
                    key={p.pid} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-accent/30 transition-colors group"
                  >
                    <td className="px-4 py-3 font-mono font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: p.color }}></span>
                      <span className="text-foreground">{p.pid}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground/80">{p.arrivalTime}</td>
                    <td className="px-4 py-3 font-mono text-foreground/80">{p.burstTime}</td>
                    <td className="px-4 py-3 font-mono text-foreground/80">{p.priority}</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{p.completionTime}</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{p.turnaroundTime}</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{p.waitingTime}</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{p.responseTime}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}</div>
  );
}
