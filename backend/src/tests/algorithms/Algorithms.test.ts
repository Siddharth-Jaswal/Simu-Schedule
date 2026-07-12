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
      
      fcfs.addProcess(p1);
      fcfs.addProcess(p2);
      
      const first = fcfs.getNextProcess(0, null);
      expect(first?.pid).toBe('P1');
      
      const second = fcfs.getNextProcess(5, null);
      expect(second?.pid).toBe('P2');
    });
  });

  describe('RoundRobin', () => {
    it('should preempt process when quantum expires', () => {
      const rr = new RoundRobin(2);
      const p1 = new Process('P1', 0, 5);
      const p2 = new Process('P2', 1, 3);
      
      rr.addProcess(p1);
      rr.addProcess(p2);
      
      let current = rr.getNextProcess(0, null); // returns P1
      expect(current?.pid).toBe('P1');
      
      current = rr.getNextProcess(1, p1); // quantum=1, returns P1
      expect(current?.pid).toBe('P1');
      
      current = rr.getNextProcess(2, p1); // quantum=2, preempts P1, returns P2
      expect(current?.pid).toBe('P2');
    });
  });

  describe('SRTF', () => {
    it('should preempt when a shorter process arrives', () => {
      const srtf = new SRTF();
      const p1 = new Process('P1', 0, 10);
      const p2 = new Process('P2', 2, 2);
      
      srtf.addProcess(p1);
      let current = srtf.getNextProcess(0, null);
      expect(current?.pid).toBe('P1');
      
      // Simulate P1 running for 2 ticks
      p1.executeTick();
      p1.executeTick(); // remaining = 8
      
      srtf.addProcess(p2);
      // getNextProcess should now return P2 because it has 2 remaining vs P1's 8
      current = srtf.getNextProcess(2, p1);
      expect(current?.pid).toBe('P2');
    });
  });
});
