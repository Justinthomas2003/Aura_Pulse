
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity, ActivityCategory } from '../types';

interface AnalyticsChartProps {
  activities: Activity[];
}

const COLORS: Record<string, string> = {
  [ActivityCategory.WORK]: '#6366f1',
  [ActivityCategory.HEALTH]: '#10b981',
  [ActivityCategory.LEISURE]: '#ec4899',
  [ActivityCategory.EDUCATION]: '#22d3ee',
  [ActivityCategory.CHORES]: '#f59e0b',
  [ActivityCategory.SLEEP]: '#1e293b',
  [ActivityCategory.OTHER]: '#64748b',
};

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ activities }) => {
  const getDurationInHours = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff < 0) diff += 24 * 60;
    return diff / 60;
  };

  const data = Object.values(ActivityCategory).map(cat => {
    const totalHours = activities
      .filter(a => a.category === cat)
      .reduce((sum, a) => sum + getDurationInHours(a.startTime, a.endTime), 0);
    return { name: cat, value: totalHours };
  }).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="glass h-[400px] flex items-center justify-center rounded-[2rem] border-dashed">
        <p className="text-white/20 font-bold uppercase tracking-widest">Aura Empty</p>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-[2rem]">
      <h3 className="text-lg font-black text-white mb-6 tracking-tight">Resource Allocation</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as ActivityCategory] || '#fff'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
