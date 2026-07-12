import { useSimulationStore } from '../../store/useSimulationStore';
import { Terminal } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function EventLogConsole() {
  const { eventLogs } = useSimulationStore();
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [eventLogs]);

  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        5. Event Log Console
      </h2>
      
      <div 
        ref={consoleRef}
        className="h-64 bg-black/80 rounded-xl border border-white/10 p-4 font-mono text-sm overflow-y-auto custom-scrollbar"
      >
        <div className="flex items-center gap-2 text-muted-foreground/50 mb-2 border-b border-white/5 pb-2">
          <Terminal className="w-4 h-4" /> <span>Simulation Kernel Logs</span>
        </div>
        
        {eventLogs.length === 0 ? (
          <div className="text-muted-foreground/30 italic">Awaiting events...</div>
        ) : (
          <ul className="flex flex-col gap-1">
            {eventLogs.map((log, index) => {
              // Simple coloring based on keywords
              let colorClass = "text-white/80";
              if (log.includes("arrived") || log.includes("added")) colorClass = "text-sim-green";
              else if (log.includes("completed")) colorClass = "text-sim-purple";
              else if (log.includes("Context Switch")) colorClass = "text-sim-red";
              else if (log.includes("executing") || log.includes("dispatched")) colorClass = "text-sim-blue";

              return (
                <li key={index} className="flex gap-4">
                  <span className="text-muted-foreground/50 w-6 text-right select-none">{index + 1}</span>
                  <span className={colorClass}>{log}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
