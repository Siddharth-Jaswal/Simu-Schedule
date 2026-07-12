import { useSimulationStore } from '../../store/useSimulationStore';
import { Cpu } from 'lucide-react';
import { ProcessNode } from './ProcessNode';
import { AnimatePresence, motion } from 'framer-motion';

export function CPUViewer() {
  const { state, processes } = useSimulationStore();
  
  const runningPid = state?.cpu.running;
  const runningProcess = runningPid ? processes[runningPid] : null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sim-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      
      <h2 className="font-semibold text-xl flex items-center gap-2 mb-6 relative z-10">
        <Cpu className="w-6 h-6 text-sim-blue" />
        Central Processing Unit
      </h2>
      
      <div className="flex gap-6 items-center justify-center h-48 border border-white/5 bg-black/20 rounded-xl relative shadow-inner">
        <AnimatePresence mode="wait">
          {runningProcess ? (
            <motion.div
              key={runningProcess.pid}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ProcessNode process={runningProcess} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 text-lg font-medium tracking-widest"
            >
              IDLE
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative execution rings if running */}
        {runningProcess && (
          <>
            <motion.div 
              className="absolute w-40 h-40 rounded-full border border-sim-blue/30"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-48 h-48 rounded-full border border-dashed border-sim-blue/20"
              animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </div>
    </div>
  );
}
