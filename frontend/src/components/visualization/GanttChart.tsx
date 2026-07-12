import { useSimulationStore } from '../../store/useSimulationStore';
import { motion } from 'framer-motion';

export function GanttChart() {
  const { state, processes } = useSimulationStore();
  
  const history = state?.executionHistory || [];
  const maxTime = state?.clock || 1; // Prevent division by zero

  return (
    <div className="glass-panel p-6 rounded-2xl mt-6 border border-border/50">
      <h3 className="font-medium text-primary mb-4">Gantt Chart Timeline</h3>
      <div className="relative h-16 bg-black/5 dark:bg-black/20 rounded-lg border border-border/50 overflow-hidden flex items-stretch">
        
        {history.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm">
            Waiting for execution data...
          </div>
        ) : (
          history.map((slice, idx) => {
            const p = processes[slice.pid];
            const duration = slice.end - slice.start;
            const widthPct = (duration / maxTime) * 100;
            const color = p?.color || '#555';

            return (
              <motion.div
                key={`${slice.pid}-${idx}`}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: color,
                  transformOrigin: 'left'
                }}
                className="h-full border-r border-black/30 dark:border-black/50 flex items-center justify-center min-w-[20px] overflow-hidden group relative"
              >
                <span className="text-[10px] font-bold text-white drop-shadow-md z-10 truncate px-1">
                  {slice.pid}
                </span>
                
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] py-1 px-2 rounded -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  {slice.pid} [{slice.start} - {slice.end}]
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Time axis */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono px-1">
        <span>0</span>
        <span>{maxTime}</span>
      </div>
    </div>
  );
}
