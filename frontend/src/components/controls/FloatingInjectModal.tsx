import { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { Plus, X } from 'lucide-react';
import type { ProcessDTO } from '@shared/types';
import { AnimatePresence, motion } from 'framer-motion';

export function FloatingInjectModal() {
  const { showInjectModal, setShowInjectModal, state, addStagedProcess, config } = useSimulationStore();
  const [burstTime, setBurstTime] = useState(5);
  const [priority, setPriority] = useState(0);

  if (!showInjectModal) return null;

  const handleInject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProcess: ProcessDTO = {
      pid: `P${Math.floor(Math.random() * 1000)}`,
      arrivalTime: state?.clock || 0,
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
    setShowInjectModal(false);
  };

  const showPriority = config.algorithm === 'PRIORITY' || config.algorithm === 'PRIORITY_NP' || config.algorithm === 'MLFQ';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-background border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative"
        >
          <button 
            onClick={() => setShowInjectModal(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-sim-cyan">
            <Plus className="w-5 h-5" /> Inject Process
          </h3>
          
          <form onSubmit={handleInject} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Arrival Time (Current Clock)</label>
              <input type="number" value={state?.clock || 0} disabled className="bg-black/40 border border-white/5 rounded px-3 py-2 outline-none text-muted-foreground cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Burst Time</label>
              <input type="number" min="1" value={burstTime} onChange={e => setBurstTime(parseInt(e.target.value) || 1)} className="bg-black/20 border border-white/10 rounded px-3 py-2 outline-none focus:ring-1 ring-primary" required />
            </div>
            {showPriority && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Priority (lower is higher)</label>
                <input type="number" min="0" value={priority} onChange={e => setPriority(parseInt(e.target.value) || 0)} className="bg-black/20 border border-white/10 rounded px-3 py-2 outline-none focus:ring-1 ring-primary" required />
              </div>
            )}
            <button type="submit" className="bg-sim-cyan text-black py-2 rounded-md font-bold hover:bg-sim-cyan/90 transition-colors mt-2">
              Create Draggable Card
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
