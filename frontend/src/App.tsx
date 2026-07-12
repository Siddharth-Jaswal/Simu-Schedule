import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Cpu, Server, Activity, Users, Clock } from 'lucide-react';
import { socketService } from './socket/SocketService';
import { useSimulationStore } from './store/useSimulationStore';
import { SimulationControls } from './components/controls/SimulationControls';

function App() {
  const { isConnected, state } = useSimulationStore();

  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <MainLayout
      controls={
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Simulation Setup
            <span className={`w-2 h-2 rounded-full ml-auto ${isConnected ? 'bg-sim-green' : 'bg-sim-red'}`}></span>
          </h2>
          <div className="text-sm text-muted-foreground mb-4">
            Configure your processes, select an algorithm, and start the simulation.
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
          
          <div className="h-48 mt-4 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-muted-foreground/50">
            [Gantt Chart / Timeline]
          </div>
        </div>
      }
    >
      {/* Center column children - CPU and Queues */}
      
      {/* CPU Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sim-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <h2 className="font-semibold text-xl flex items-center gap-2 mb-6">
          <Cpu className="w-6 h-6 text-sim-blue" />
          Central Processing Unit
        </h2>
        
        <div className="flex gap-6 items-center justify-center h-48 border border-white/5 bg-black/20 rounded-xl relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 text-lg font-medium">
            {state?.cpu.running ? (
              <span className="text-sim-green animate-pulse text-2xl font-bold">RUNNING: {state.cpu.running}</span>
            ) : (
              "CPU IDLE"
            )}
          </div>
        </div>
      </div>

      {/* Queues Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-medium flex items-center gap-2 mb-4 text-sim-orange">
            <Users className="w-5 h-5" />
            Ready Queue ({state?.readyQueue.length || 0})
          </h3>
          <div className="min-h-[200px] border border-white/5 bg-black/20 rounded-xl p-4 flex flex-col gap-2">
             {!state || state.readyQueue.length === 0 ? (
               <div className="text-muted-foreground/40 text-sm text-center mt-8">Empty</div>
             ) : (
               <div className="flex flex-wrap gap-2">
                 {state.readyQueue.map(pid => (
                   <span key={pid} className="px-3 py-1 bg-sim-orange/20 border border-sim-orange/50 rounded-md text-sim-orange font-mono">
                     {pid}
                   </span>
                 ))}
               </div>
             )}
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-medium flex items-center gap-2 mb-4 text-sim-purple">
            <Clock className="w-5 h-5" />
            Completed ({state?.completed.length || 0})
          </h3>
          <div className="min-h-[200px] border border-white/5 bg-black/20 rounded-xl p-4 flex flex-col gap-2">
             {!state || state.completed.length === 0 ? (
               <div className="text-muted-foreground/40 text-sm text-center mt-8">Empty</div>
             ) : (
               <div className="flex flex-wrap gap-2">
                 {state.completed.map(pid => (
                   <span key={pid} className="px-3 py-1 bg-sim-purple/20 border border-sim-purple/50 rounded-md text-sim-purple font-mono opacity-50">
                     {pid}
                   </span>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
