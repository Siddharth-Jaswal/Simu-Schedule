import { FCFS } from '../../algorithms/FCFS';
import { RoundRobin } from '../../algorithms/RoundRobin';
import { SRTF } from '../../algorithms/SRTF';
import { Process } from '../../core/Process';

describe('Scheduling Algorithms', () => {
  describe('FCFS', () => {
    it('should return processes in order of arrival', () => {
      const fcfs = new FCFS();
      const p1 = new Process('P1', 0, 5);
      const p2 = new Process('P2', 1, 3);
      
      const readyQueue = [p1, p2];
      
      const res1 = fcfs.getNextProcess(readyQueue, 0, null);
      expect(res1.nextProcess?.pid).toBe('P1');
      expect(res1.updatedQueue.length).toBe(1);
      
      const res2 = fcfs.getNextProcess(res1.updatedQueue, 5, null);
      expect(res2.nextProcess?.pid).toBe('P2');
      expect(res2.updatedQueue.length).toBe(0);
    });
  });

  describe('RoundRobin', () => {
    it('should preempt process when quantum expires', () => {
      const rr = new RoundRobin(2);
      const p1 = new Process('P1', 0, 5);
      const p2 = new Process('P2', 1, 3);
      
      let queue = [p1, p2];
      
      let res = rr.getNextProcess(queue, 0, null);
      expect(res.nextProcess?.pid).toBe('P1');
      
      res = rr.getNextProcess(res.updatedQueue, 1, p1); // quantum=1
      expect(res.nextProcess?.pid).toBe('P1');
      
      res = rr.getNextProcess(res.updatedQueue, 2, p1); // quantum=2, preempts P1, returns P2
      expect(res.nextProcess?.pid).toBe('P2');
      // P1 should be added back to the queue
      expect(res.updatedQueue.find(p => p.pid === 'P1')).toBeDefined();
    });
  });

  describe('SRTF', () => {
    it('should preempt when a shorter process arrives', () => {
      const srtf = new SRTF();
      const p1 = new Process('P1', 0, 10);
      const p2 = new Process('P2', 2, 2);
      
      let queue = [p1];
      let res = srtf.getNextProcess(queue, 0, null);
      expect(res.nextProcess?.pid).toBe('P1');
      
      // Simulate P1 running for 2 ticks
      p1.executeTick();
      p1.executeTick(); // remaining = 8
      
      // P2 arrives
      queue = [...res.updatedQueue, p2];
      
      res = srtf.getNextProcess(queue, 2, p1);
      expect(res.nextProcess?.pid).toBe('P2');
      // P1 should have been preempted and placed in updatedQueue
      expect(res.updatedQueue.find(p => p.pid === 'P1')).toBeDefined();
    });
  });
});
