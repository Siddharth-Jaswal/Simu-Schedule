import { useSimulationStore } from '../../store/useSimulationStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export function MetricsChart() {
  const { metricsHistory } = useSimulationStore();

  if (metricsHistory.length === 0) {
    return (
      <div className="h-48 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-muted-foreground/50">
        [Awaiting Data for Chart]
      </div>
    );
  }

  return (
    <div className="h-64 w-full mt-4 glass-panel p-4 rounded-xl">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">CPU Utilization over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={metricsHistory}
          margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="clock" 
            stroke="rgba(255,255,255,0.2)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
            minTickGap={20}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.2)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area 
            type="monotone" 
            dataKey="cpuUtilization" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCpu)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
