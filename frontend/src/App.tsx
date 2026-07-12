import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { socketService } from './socket/SocketService';
import { useSimulationStore } from './store/useSimulationStore';
import { SimulationConfig } from './components/controls/SimulationConfig';
import { SimulationControls } from './components/controls/SimulationControls';
import { LiveVisualization } from './components/visualization/LiveVisualization';
import { CompletedTable } from './components/visualization/CompletedTable';
import { GlobalMetrics } from './components/visualization/GlobalMetrics';
import { EventLogConsole } from './components/visualization/EventLogConsole';
import { FloatingInjectModal } from './components/controls/FloatingInjectModal';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { ProcessDTO } from '@shared/types';
import { apiClient } from './services/apiClient';
import { Plus } from 'lucide-react';
import { DraggableProcess } from './components/controls/DraggableProcess';

function App() {
  const { state, removeStagedProcess, setShowInjectModal, stagedProcesses, addEventLog } = useSimulationStore();

  useEffect(() => {
    socketService.connect();
    
    // Subscribe to events for EventLogConsole
    const handleEvent = (data: { type: string, payload: { process?: ProcessDTO, time?: number, from?: string, to?: string }}) => {
      const { type, payload } = data;
      const t = payload.time ?? state?.clock ?? 0;
      
      switch(type) {
        case 'PROCESS_ARRIVAL':
          addEventLog(`[Tick ${t}] Process ${payload.process?.pid} arrived and added to Ready Queue.`);
          break;
        case 'PROCESS_COMPLETED':
          addEventLog(`[Tick ${t}] Process ${payload.process?.pid} completed execution.`);
          break;
        case 'PROCESS_SCHEDULED':
          addEventLog(`[Tick ${t}] Process ${payload.process?.pid} dispatched to CPU.`);
          break;
        case 'PROCESS_PREEMPTED':
          addEventLog(`[Tick ${t}] Process ${payload.process?.pid} preempted.`);
          break;
        case 'CONTEXT_SWITCH':
          if (payload.from && payload.to) {
            addEventLog(`[Tick ${t}] Context Switch: ${payload.from} -> ${payload.to}.`);
          } else if (payload.to) {
            addEventLog(`[Tick ${t}] CPU idle -> Context Switch to ${payload.to}.`);
          }
          break;
      }
    };

    socketService.onEvent(handleEvent);

    return () => {
      socketService.disconnect();
    };
  }, [addEventLog, state?.clock]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && over.id === 'ready-queue-dropzone') {
      const processDto = active.data.current?.process;
      if (processDto) {
        try {
          // Optimistic UI
          removeStagedProcess(processDto.pid);
          // Send to backend
          await apiClient.addProcess(processDto);
        } catch (e) {
          console.error("Failed to add process:", e);
        }
      }
    }
  };

  const hasStarted = state !== null;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <MainLayout>
        
        {/* SECTION 1: Config & Workload (Hidden if running, unless user wants to see it? Actually let's hide it when started to focus on simulation) */}
        {!hasStarted ? (
          <SimulationConfig />
        ) : (
          <>
            {/* SECTION 2: Controls */}
            <SimulationControls />
            
            {/* SECTION 3: Live Visualization */}
            <LiveVisualization />
            
            {/* SECTION 4: Completed Processes */}
            <CompletedTable />
            
            {/* SECTION 5: Live Metrics */}
            <GlobalMetrics />
            
            {/* SECTION 6: Event Log */}
            <EventLogConsole />
          </>
        )}

      </MainLayout>
      
      <FloatingInjectModal />
      
      {/* Floating Action Button for Inject */}
      {hasStarted && (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4">
          {/* Render draggable processes if they are staged */}
          {stagedProcesses.map(p => (
            <div key={p.pid} className="animate-in slide-in-from-right bg-black/60 p-2 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Drag to Queue</span>
              <DraggableProcess process={p} />
            </div>
          ))}
          
          <button 
            onClick={() => setShowInjectModal(true)}
            className="w-14 h-14 bg-sim-cyan text-black rounded-full shadow-lg hover:shadow-sim-cyan/20 hover:scale-105 transition-all flex items-center justify-center border border-white/20"
            title="Inject Process"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
      
    </DndContext>
  );
}

export default App;
