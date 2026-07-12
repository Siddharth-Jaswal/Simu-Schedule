import { motion } from 'framer-motion';
import type { ProcessDTO } from '@shared/types';
import { Clock, Hash, Zap } from 'lucide-react';

interface ProcessNodeProps {
  process: ProcessDTO;
  compact?: boolean;
}

export function ProcessNode({ process, compact = false }: ProcessNodeProps) {
  const percent = process.burstTime > 0 
    ? Math.round(((process.burstTime - process.remainingTime) / process.burstTime) * 100) 
    : 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden rounded-lg border border-white/10 ${compact ? 'p-2 w-16 h-16' : 'p-3 w-32'} flex flex-col justify-between`}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      {/* Background progress fill */}
      <div 
        className="absolute bottom-0 left-0 right-0 opacity-20 transition-all duration-300 ease-in-out"
        style={{ 
          height: `${percent}%`, 
          backgroundColor: process.color 
        }}
      />
      
      {/* Top accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: process.color }}
      />
      
      {compact ? (
        <div className="flex-1 flex items-center justify-center font-bold text-lg relative z-10">
          {process.pid}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start relative z-10 mb-2">
            <span className="font-bold text-lg">{process.pid}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 font-mono">
              P{process.priority}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground relative z-10">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {process.remainingTime}
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Zap className="w-3 h-3" /> {process.burstTime}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
