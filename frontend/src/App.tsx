import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Server, Activity } from 'lucide-react';
import { socketService } from './socket/SocketService';
import { useSimulationStore } from './store/useSimulationStore';
import { SimulationControls } from './components/controls/SimulationControls';
import { CPUViewer } from './components/visualization/CPUViewer';
import { QueueViewer } from './components/visualization/QueueViewer';
import { MetricsChart } from './components/visualization/MetricsChart';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { apiClient } from './services/apiClient';

function App() {
  const { isConnected, state, removeStagedProcess, stagedProcesses } = useSimulationStore();

  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && over.id === 'ready-queue-dropzone') {
      const processDto = active.data.current?.process;
      if (processDto) {
        try {
          // Optimistic UI: remove from staging immediately
          removeStagedProcess(processDto.pid);
          
          // Send to backend
          await apiClient.addProcess(processDto);
        } catch (e) {
          console.error("Failed to add process:", e);
        }
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <MainLayout
        controls={
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Simulation Setup
              <span className={`w-2 h-2 rounded-full ml-auto ${isConnected ? 'bg-sim-green' : 'bg-sim-red'}`}></span>
            </h2>
            <div className="text-sm text-muted-foreground mb-4">
              Configure algorithms or manually stage processes below.
            </div>
            
            <SimulationControls />
          </div>
        }
        metrics={
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-sim-cyan" />
              Live Metrics - Clock: {state?.clock || 0}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="glass-card p-4">
                <div className="text-sm text-muted-foreground mb-1">CPU Utilization</div>
                <div className="text-2xl font-bold text-sim-green">{state?.metrics.cpuUtilization || 0}%</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-sm text-muted-foreground mb-1">Throughput</div>
                <div className="text-2xl font-bold">{state?.metrics.throughput || 0}</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-sm text-muted-foreground mb-1">Avg Wait Time</div>
                <div className="text-2xl font-bold text-sim-orange">{state?.metrics.waitingTime || 0}</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-sm text-muted-foreground mb-1">Turnaround</div>
                <div className="text-2xl font-bold text-sim-purple">{state?.metrics.turnaroundTime || 0}</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-sm text-muted-foreground mb-1">Context Switches</div>
                <div className="text-2xl font-bold text-sim-red">{state?.metrics.contextSwitches || 0}</div>
              </div>
            </div>
            
            <MetricsChart />
          </div>
        }
      >
        <CPUViewer />
        <QueueViewer />
      </MainLayout>
    </DndContext>
  );
}

export default App;
