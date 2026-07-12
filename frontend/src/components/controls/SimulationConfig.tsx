import { useState, useEffect } from 'react';
import { Plus, Trash, Play, Settings2, Cpu } from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { apiClient } from '../../services/apiClient';
import type { ProcessDTO } from '@shared/types';
import { motion, AnimatePresence } from 'framer-motion';

export function SimulationConfig() {
  const { state, config, setConfig, queuedWorkload, addQueuedProcess, removeQueuedProcess, setIsRunning, hasStarted, setHasStarted } = useSimulationStore();
  const [algorithms, setAlgorithms] = useState<string[]>([]);
  
  const [arrivalTime, setArrivalTime] = useState<number | string>(0);
  const [burstTime, setBurstTime] = useState<number | string>(5);
  const [priority, setPriority] = useState<number | string>(0);

  useEffect(() => {
    apiClient.getAlgorithms()
      .then(algs => setAlgorithms(algs.filter(a => a !== 'MLFQ')))
      .catch(console.error);
  }, []);

  const handleAddWorkload = (e: React.FormEvent) => {
    e.preventDefault();
    const newProcess: ProcessDTO = {
      pid: `P${queuedWorkload.length + 1}`,
      arrivalTime: Number(arrivalTime) || 0,
      burstTime: Number(burstTime) || 1,
      priority: Number(priority) || 0,
      remainingTime: Number(burstTime) || 1,
      waitingTime: 0,
      turnaroundTime: 0,
      completionTime: 0,
      responseTime: -1,
      state: 'NEW',
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
    };
    addQueuedProcess(newProcess);
  };

  const handleStart = async () => {
    await apiClient.start(config, queuedWorkload);
    setHasStarted(true);
    setIsRunning(true);
  };

  const showQuantum = config.algorithm === 'RR' || config.algorithm === 'MLFQ';
  const showPriority = config.algorithm === 'PRIORITY' || config.algorithm === 'PRIORITY_NP' || config.algorithm === 'MLFQ';

  return (
    <motion.div 
      layout
      className={`glass-panel p-6 sm:p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden transition-all duration-500 ${hasStarted ? 'opacity-80 scale-[0.99] grayscale-[0.2]' : 'ring-1 ring-border/50'}`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary relative z-10">
        <Settings2 className="w-6 h-6" />
        Simulation Configuration
        {hasStarted && <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-wider font-bold ml-4">Read Only</span>}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Algorithm</label>
          <select 
            disabled={hasStarted}
            className="bg-black/5 dark:bg-black/30 border border-border/50 rounded-xl p-3 outline-none focus:ring-2 ring-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed appearance-none text-foreground"
            value={config.algorithm}
            onChange={(e) => setConfig({ ...config, algorithm: e.target.value })}
          >
            {algorithms.map(alg => (
              <option key={alg} value={alg} className="bg-background text-foreground font-medium">{alg}</option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {showQuantum && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-2"
            >
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Time Quantum</label>
              <input 
                type="number" min="1" 
                disabled={hasStarted}
                value={config.quantum} 
                onChange={(e) => setConfig({ ...config, quantum: parseInt(e.target.value) || 2 })}
                className="bg-black/5 dark:bg-black/30 border border-border/50 rounded-xl p-3 outline-none focus:ring-2 ring-primary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <hr className="border-border/50 my-8 relative z-10" />

      <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary relative z-10">
        <Cpu className="w-5 h-5" />
        Workload Staging
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleAddWorkload} className="flex flex-col gap-5 bg-card/50 dark:bg-black/20 p-6 rounded-2xl border border-border/50 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Arrival</label>
                <input disabled={hasStarted} type="number" min="0" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} className="bg-background/50 border border-border/50 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary font-mono transition-all disabled:opacity-50 text-foreground" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Burst</label>
                <input disabled={hasStarted} type="number" min="1" value={burstTime} onChange={e => setBurstTime(e.target.value)} className="bg-background/50 border border-border/50 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary font-mono transition-all disabled:opacity-50 text-foreground" required />
              </div>
            </div>
            
            <AnimatePresence>
              {showPriority && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-2 relative z-10">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority <span className="opacity-50 lowercase normal-case">(lower is higher)</span></label>
                  <input disabled={hasStarted} type="number" min="0" value={priority} onChange={e => setPriority(e.target.value)} className="bg-background/50 border border-border/50 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary font-mono transition-all disabled:opacity-50 text-foreground" required />
                </motion.div>
              )}
            </AnimatePresence>

            <button disabled={hasStarted} type="submit" className="relative z-10 mt-2 bg-foreground text-background py-3 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed">
              <Plus className="w-5 h-5" /> Stage Process
            </button>
          </form>
        </div>

        {/* Queued Workload List */}
        <div className="lg:col-span-8 bg-card/50 dark:bg-black/20 p-1 rounded-2xl border border-border/50 flex flex-col h-full min-h-[250px]">
          {queuedWorkload.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/50 gap-3 border-2 border-dashed border-border/50 rounded-xl m-2">
              <Cpu className="w-12 h-12 opacity-20" />
              <p className="font-medium tracking-wide">No processes staged. Build your workload!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl flex-1 m-2 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/80 dark:bg-black/60 sticky top-0 backdrop-blur-md z-20">
                  <tr>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider rounded-tl-lg">PID</th>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider">Arrival</th>
                    <th className="px-4 py-4 font-semibold uppercase tracking-wider">Burst</th>
                    {showPriority && <th className="px-4 py-4 font-semibold uppercase tracking-wider">Priority</th>}
                    {!hasStarted && <th className="px-4 py-4 font-semibold uppercase tracking-wider text-right rounded-tr-lg">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <AnimatePresence>
                    {queuedWorkload.map((p, idx) => (
                      <motion.tr 
                        key={p.pid} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-accent/50 transition-colors group"
                      >
                        <td className="px-4 py-3 font-mono font-bold flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: p.color }}></span>
                          <span className="text-foreground">{p.pid}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-foreground/80">{p.arrivalTime}</td>
                        <td className="px-4 py-3 font-mono text-foreground/80">{p.burstTime}</td>
                        {showPriority && <td className="px-4 py-3 font-mono text-foreground/80">{p.priority}</td>}
                        {!hasStarted && (
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => removeQueuedProcess(p.pid)} className="text-red-500/70 hover:text-red-500 bg-red-500/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <Trash className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {!hasStarted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 flex justify-end relative z-10"
        >
          <button 
            onClick={handleStart} 
            disabled={queuedWorkload.length === 0}
            className="group relative bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-xl shadow-primary/20"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Play className="w-6 h-6 relative z-10 fill-current" /> 
            <span className="relative z-10">START SIMULATION</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
