import { useSimulationStore } from '../../store/useSimulationStore';
import { Cpu, Users } from 'lucide-react';
import { ProcessNode } from './ProcessNode';
import { AnimatePresence, motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { GanttChart } from './GanttChart';

export function LiveVisualization() {
  const { state, processes } = useSimulationStore();
  
  const readyProcesses = (state?.readyQueue || []).map(pid => processes[pid]).filter(Boolean);
  const runningProcess = state?.cpu.running ? processes[state.cpu.running] : null;

  const { isOver, setNodeRef } = useDroppable({
    id: 'ready-queue-dropzone',
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        2. Live Visualization
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CPU Visualization */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sim-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-6 text-sim-blue self-start w-full border-b border-white/10 pb-2">
            <Cpu className="w-5 h-5" />
            CPU
          </h2>
          
          <div className="flex-1 flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {runningProcess ? (
                <motion.div
                  key={runningProcess.pid}
                  initial={{ scale: 0.8, opacity: 0, x: -50 }}
                  animate={{ scale: 1.2, opacity: 1, x: 0 }}
                  exit={{ scale: 0.8, opacity: 0, x: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative"
                >
                  {/* Glowing ring */}
                  <div className="absolute -inset-4 rounded-full border-2 border-dashed border-sim-green animate-[spin_4s_linear_infinite] opacity-50 pointer-events-none"></div>
                  <ProcessNode process={runningProcess} />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground/40 text-lg font-medium tracking-widest uppercase"
                >
                  IDLE
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Ready Queue (Dropzone) */}
        <div 
          ref={setNodeRef}
          className={`lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col min-h-[250px] transition-colors duration-300 ${isOver ? 'ring-2 ring-sim-orange bg-sim-orange/5' : ''}`}
        >
          <h3 className="font-medium flex items-center gap-2 mb-4 text-sim-orange border-b border-white/10 pb-2">
            <Users className="w-5 h-5" />
            Ready Queue
            <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full ml-2">{readyProcesses.length}</span>
            {isOver && <span className="ml-auto text-xs animate-pulse text-sim-orange font-bold">Drop to Inject!</span>}
          </h3>
          
          <div className="flex-1 border border-white/5 bg-black/20 rounded-xl p-4 overflow-x-auto custom-scrollbar flex items-center">
             {!state || readyProcesses.length === 0 ? (
               <div className="w-full text-center text-muted-foreground/40 text-sm">Waiting for processes...</div>
             ) : (
               <div className="flex gap-4 items-center">
                 <AnimatePresence>
                   {readyProcesses.map((process, idx) => (
                     <motion.div 
                       key={process.pid} 
                       layout
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.5 }}
                       className="flex items-center"
                     >
                       <ProcessNode process={process} />
                       {idx < readyProcesses.length - 1 && (
                         <div className="w-4 h-0.5 bg-white/10 mx-2" />
                       )}
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
             )}
          </div>
        </div>

      </div>

      <GanttChart />
    </div>
  );
}
