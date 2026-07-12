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
import { Loader2 } from 'lucide-react';
import type { ProcessDTO } from '@shared/types';
import { apiClient } from './services/apiClient';

function App() {
  const { state, addEventLog, setIsRunning, setIsComplete, reset, hasStarted, isConnected } = useSimulationStore();

  useEffect(() => {
    // Ensure we always start fresh on page load and avoid race conditions with socket connection
    const init = async () => {
      try {
        await apiClient.reset();
      } catch (e) {
        console.error("Failed to reset backend:", e);
      }
      reset();
      socketService.connect();
    };
    init();
    
    // Subscribe to events for EventLogConsole
    const handleEvent = (data: { type: string, payload: { process?: ProcessDTO, time?: number, from?: string, to?: string }}) => {
      const { type, payload } = data;
      const t = payload.time ?? useSimulationStore.getState().state?.clock ?? 0;
      
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
        case 'SIMULATION_COMPLETED':
          addEventLog(`[Tick ${t}] Simulation Completed.`);
          useSimulationStore.getState().setIsRunning(false);
          useSimulationStore.getState().setIsComplete(true);
          break;
      }
    };

    socketService.onEvent(handleEvent);

    return () => {
      socketService.offEvent(handleEvent);
      socketService.disconnect();
    };
  }, []); // Remove addEventLog dependency to prevent multiple re-renders causing multiple resets

  if (!isConnected) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-pulse">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Waking up the server...</h2>
            <p className="text-muted-foreground text-sm max-w-md text-center">
              Please wait while we establish a connection. Free-tier servers may take up to 30 seconds to wake from sleep.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      
      {/* SECTION 1: Config & Workload */}
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
  );
}

export default App;
