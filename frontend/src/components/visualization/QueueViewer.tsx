import { useSimulationStore } from '../../store/useSimulationStore';
import { Users, Clock } from 'lucide-react';
import { ProcessNode } from './ProcessNode';
import { AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';

export function QueueViewer() {
  const { state, processes } = useSimulationStore();
  
  const readyProcesses = (state?.readyQueue || []).map(pid => processes[pid]).filter(Boolean);
  const completedProcesses = (state?.completed || []).map(pid => processes[pid]).filter(Boolean);

  const { isOver, setNodeRef } = useDroppable({
    id: 'ready-queue-dropzone',
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* Ready Queue (Dropzone) */}
      <div 
        ref={setNodeRef}
        className={`glass-panel p-6 rounded-2xl flex flex-col h-full min-h-[300px] transition-colors duration-300 ${isOver ? 'ring-2 ring-sim-orange bg-sim-orange/5' : ''}`}
      >
        <h3 className="font-medium flex items-center gap-2 mb-4 text-sim-orange">
          <Users className="w-5 h-5" />
          Ready Queue ({readyProcesses.length})
          {isOver && <span className="ml-auto text-xs animate-pulse text-sim-orange font-bold">Drop to add!</span>}
        </h3>
        
        <div className="flex-1 border border-white/5 bg-black/20 rounded-xl p-4 overflow-x-auto custom-scrollbar">
           {!state || readyProcesses.length === 0 ? (
             <div className="h-full flex items-center justify-center text-muted-foreground/40 text-sm">Empty</div>
           ) : (
             <div className="flex gap-4 items-center h-full">
               <AnimatePresence>
                 {readyProcesses.map((process, idx) => (
                   <div key={process.pid} className="flex items-center">
                     <ProcessNode process={process} />
                     {idx < readyProcesses.length - 1 && (
                       <div className="w-4 h-0.5 bg-white/10 mx-2" />
                     )}
                   </div>
                 ))}
               </AnimatePresence>
             </div>
           )}
        </div>
      </div>
      
      {/* Completed Queue */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col h-full min-h-[300px]">
        <h3 className="font-medium flex items-center gap-2 mb-4 text-sim-purple">
          <Clock className="w-5 h-5" />
          Completed ({completedProcesses.length})
        </h3>
        
        <div className="flex-1 border border-white/5 bg-black/20 rounded-xl p-4 overflow-x-auto custom-scrollbar">
           {!state || completedProcesses.length === 0 ? (
             <div className="h-full flex items-center justify-center text-muted-foreground/40 text-sm">Empty</div>
           ) : (
             <div className="flex flex-wrap gap-3 content-start">
               <AnimatePresence>
                 {completedProcesses.map(process => (
                   <ProcessNode key={process.pid} process={process} compact />
                 ))}
               </AnimatePresence>
             </div>
           )}
        </div>
      </div>
      
    </div>
  );
}
