import { MainLayout } from './components/layout/MainLayout';
import { Cpu, Server, Activity, Users, Clock } from 'lucide-react';

function App() {
  return (
    <MainLayout
      controls={
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Simulation Setup
          </h2>
          <div className="text-sm text-muted-foreground">
            Configure your processes, select an algorithm, and start the simulation.
          </div>
          
          <div className="h-40 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-muted-foreground/50">
            [Algorithm Selector]
          </div>
          
          <div className="h-60 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-muted-foreground/50">
            [Process Generator]
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Start
            </button>
            <button className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-md font-medium hover:bg-secondary/80 transition-colors">
              Reset
            </button>
          </div>
        </div>
      }
      metrics={
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-sim-cyan" />
            Live Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Example metric cards */}
            <div className="glass-card p-4">
              <div className="text-sm text-muted-foreground mb-1">CPU Utilization</div>
              <div className="text-2xl font-bold text-sim-green">0%</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-sm text-muted-foreground mb-1">Throughput</div>
              <div className="text-2xl font-bold">0.00</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-sm text-muted-foreground mb-1">Avg Wait Time</div>
              <div className="text-2xl font-bold text-sim-orange">0ms</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-sm text-muted-foreground mb-1">Turnaround</div>
              <div className="text-2xl font-bold text-sim-purple">0ms</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-sm text-muted-foreground mb-1">Context Switches</div>
              <div className="text-2xl font-bold text-sim-red">0</div>
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
            CPU IDLE
          </div>
        </div>
      </div>

      {/* Queues Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-medium flex items-center gap-2 mb-4 text-sim-orange">
            <Users className="w-5 h-5" />
            Ready Queue
          </h3>
          <div className="min-h-[200px] border border-white/5 bg-black/20 rounded-xl p-4 flex flex-col gap-2">
             <div className="text-muted-foreground/40 text-sm text-center mt-8">Empty</div>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-medium flex items-center gap-2 mb-4 text-sim-purple">
            <Clock className="w-5 h-5" />
            Waiting / Completed
          </h3>
          <div className="min-h-[200px] border border-white/5 bg-black/20 rounded-xl p-4 flex flex-col gap-2">
             <div className="text-muted-foreground/40 text-sm text-center mt-8">Empty</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
