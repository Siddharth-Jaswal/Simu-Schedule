import { Router } from 'express';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { Process } from '../core/Process';
import { ProcessDTO, SimulationConfig } from '@shared/types';

export function createApiRouter(engine: SimulationEngine): Router {
  const router = Router();

  router.post('/start', (req, res) => {
    const { config, processes }: { config: SimulationConfig; processes: ProcessDTO[] } = req.body;
    
    if (!config || !processes) {
      return res.status(400).json({ error: 'Missing config or processes' });
    }

    const processModels = processes.map(p => 
      new Process(p.pid, p.arrivalTime, p.burstTime, p.priority || 0, p.color || '#ffffff')
    );

    engine.init(config, processModels);
    engine.start();
    
    res.json({ status: 'started' });
  });

  router.post('/pause', (req, res) => {
    engine.pause();
    res.json({ status: 'paused' });
  });

  router.post('/resume', (req, res) => {
    engine.resume();
    res.json({ status: 'resumed' });
  });

  router.post('/reset', (req, res) => {
    engine.reset();
    res.json({ status: 'reset' });
  });

  router.post('/step', (req, res) => {
    engine.step();
    res.json({ status: 'stepped', state: engine.getState() });
  });

  router.post('/speed', (req, res) => {
    const { speedMs } = req.body;
    if (typeof speedMs !== 'number') {
      return res.status(400).json({ error: 'speedMs must be a number' });
    }
    engine.setSpeed(speedMs);
    res.json({ status: 'speed_updated' });
  });

  router.get('/algorithms', (req, res) => {
    res.json([
      'FCFS',
      'SJF',
      'SRTF',
      'RR',
      'PRIORITY',
      'PRIORITY_NP',
      'MLFQ'
    ]);
  });

  router.post('/processes', (req, res) => {
    try {
      const processDto: ProcessDTO = req.body;
      const currentTime = engine.clock.getTime();
      engine.arrivalManager.processDynamicArrival(processDto, currentTime);
      res.json({ status: 'process_added' });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  return router;
}
