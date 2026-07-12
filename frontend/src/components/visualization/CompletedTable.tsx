import { useSimulationStore } from '../../store/useSimulationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function CompletedTable() {
  const { state, processes } = useSimulationStore();
  
  const completedProcesses = (state?.completed || []).map(pid => processes[pid]).filter(Boolean);

  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        3. Completed Processes
        <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-foreground font-normal">{completedProcesses.length}</span>
      </h2>

      <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-black/40 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 rounded-tl-xl">PID</th>
              <th className="px-4 py-3">Arrival</th>
              <th className="px-4 py-3">Burst</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Completion Time</th>
              <th className="px-4 py-3">Waiting Time</th>
              <th className="px-4 py-3">Turnaround Time</th>
              <th className="px-4 py-3">Response Time</th>
              <th className="px-4 py-3 rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {completedProcesses.length === 0 && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground/50 italic">
                    No processes have completed yet.
                  </td>
                </motion.tr>
              )}
              {completedProcesses.map(p => (
                <motion.tr 
                  key={p.pid}
                  initial={{ opacity: 0, y: -10, backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                  transition={{ duration: 0.5 }}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-mono font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                    {p.pid}
                  </td>
                  <td className="px-4 py-3 font-mono">{p.arrivalTime}</td>
                  <td className="px-4 py-3 font-mono">{p.burstTime}</td>
                  <td className="px-4 py-3 font-mono">{p.priority}</td>
                  <td className="px-4 py-3 font-mono text-sim-purple">{p.completionTime}</td>
                  <td className="px-4 py-3 font-mono text-sim-orange">{p.waitingTime}</td>
                  <td className="px-4 py-3 font-mono text-sim-cyan">{p.turnaroundTime}</td>
                  <td className="px-4 py-3 font-mono text-sim-blue">{p.responseTime}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-sim-green bg-sim-green/10 px-2 py-1 rounded-full w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
