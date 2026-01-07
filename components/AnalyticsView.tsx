
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Habit, DailyLog, AnalyticsSubView } from '../types';
import { getTodayString, getDatesLastNDays, formatDateShort } from '../utils';

interface Props {
  habits: Habit[];
  logs: DailyLog;
  onToggleHabit: (id: string, date: string) => void;
}

const AnalyticsView: React.FC<Props> = ({ habits, logs, onToggleHabit }) => {
  const [subView, setSubView] = useState<AnalyticsSubView>(AnalyticsSubView.Momentum);
  const today = getTodayString();
  
  // Synced 14-Day Window (Dec 25 to Jan 07)
  const last14Days = useMemo(() => getDatesLastNDays(today, 14), [today]);

  // Data for Momentum Chart
  const momentumData = useMemo(() => {
    return last14Days.map(date => {
      const completions = habits.reduce((acc, h) => acc + (logs[date]?.[h.id] ? 1 : 0), 0);
      return {
        dateLabel: formatDateShort(date),
        fullDate: date,
        completions
      };
    });
  }, [last14Days, habits, logs]);

  // Summary Metrics (calculated on the 14-day window for consistency)
  const summary = useMemo(() => {
    const totalPossible = habits.length * 14;
    const totalDone = last14Days.reduce((acc, date) => {
      return acc + habits.reduce((hAcc, h) => hAcc + (logs[date]?.[h.id] ? 1 : 0), 0);
    }, 0);
    
    const peaks = last14Days.map(date => ({
      date,
      count: habits.reduce((hAcc, h) => hAcc + (logs[date]?.[h.id] ? 1 : 0), 0)
    }));
    const peakDay = peaks.reduce((prev, current) => (prev.count > current.count) ? prev : current, peaks[0]);

    return {
      avgSuccess: (totalDone / totalPossible).toFixed(2),
      totalVolume: totalDone,
      peakDay: formatDateShort(peakDay.date)
    };
  }, [last14Days, habits, logs]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg shadow-xl">
          <p className="text-[10px] font-mono text-zinc-500 uppercase">{payload[0].payload.fullDate}</p>
          <p className="text-xs font-bold text-[#10b981]">
            {payload[0].value} <span className="text-zinc-400 font-normal">COMPLETED</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Side-by-Side Tabs */}
      <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800 gap-1 shadow-inner">
        <button 
          onClick={() => setSubView(AnalyticsSubView.Momentum)}
          className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-[0.1em] rounded-lg transition-all duration-300 ${
            subView === AnalyticsSubView.Momentum ? 'bg-[#10b981] text-black font-bold shadow-lg shadow-[#10b981]/20' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Momentum Trajectory
        </button>
        <button 
          onClick={() => setSubView(AnalyticsSubView.Matrix)}
          className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-[0.1em] rounded-lg transition-all duration-300 ${
            subView === AnalyticsSubView.Matrix ? 'bg-[#10b981] text-black font-bold shadow-lg shadow-[#10b981]/20' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Master Matrix
        </button>
      </div>

      {subView === AnalyticsSubView.Momentum ? (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <header className="mb-4 flex justify-between items-center px-1">
             <div>
               <h3 className="text-zinc-100 text-xs font-bold uppercase tracking-tight">Active Completion Flux</h3>
               <p className="text-[9px] font-mono text-zinc-500 uppercase">Y: Volume (0-12) | X: Time (14 Days)</p>
             </div>
          </header>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={momentumData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="dateLabel" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8, fill: '#71717a', fontFamily: 'Space Mono' }}
                />
                <YAxis 
                  domain={[0, 12]}
                  ticks={[0, 3, 6, 9, 12]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#71717a', fontFamily: 'Space Mono' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="completions" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorGreen)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
           <header className="mb-4 px-1">
               <h3 className="text-zinc-100 text-xs font-bold uppercase tracking-tight">System Performance Heatmap</h3>
               <p className="text-[9px] font-mono text-zinc-500 uppercase">14-Day Behavioral Matrix</p>
           </header>
           
           <div className="flex flex-col gap-1.5 overflow-x-auto pb-2">
             <div className="grid grid-cols-[100px_1fr] gap-2 mb-1">
               <div></div>
               <div className="flex gap-1 justify-between px-1">
                  {last14Days.map((d, i) => (
                    <div key={d} className="w-4 text-[7px] text-zinc-600 font-mono vertical-text transform -rotate-45 origin-left">
                      {formatDateShort(d)}
                    </div>
                  ))}
               </div>
             </div>
             {habits.map(h => (
               <div key={h.id} className="grid grid-cols-[100px_1fr] gap-2 items-center">
                 <div className="text-[9px] text-zinc-400 font-mono uppercase truncate leading-none">
                    {h.name}
                 </div>
                 <div className="flex gap-1 justify-between">
                   {last14Days.map(date => (
                     <button 
                       key={`${h.id}-${date}`}
                       onClick={() => onToggleHabit(h.id, date)}
                       className={`w-4 h-4 rounded-[2px] transition-all duration-300 relative ${
                         logs[date]?.[h.id] 
                           ? (h.type === 'essential' ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]') 
                           : 'bg-zinc-800 hover:bg-zinc-700'
                       }`}
                     >
                       {date === today && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full border border-zinc-900" />}
                     </button>
                   ))}
                 </div>
               </div>
             ))}
           </div>
           
           <div className="flex justify-between mt-4 px-1">
              <span className="text-[8px] font-mono text-zinc-600 uppercase">← {formatDateShort(last14Days[0])}</span>
              <span className="text-[8px] font-mono text-zinc-600 uppercase">{formatDateShort(today)} (TODAY) →</span>
           </div>
        </div>
      )}

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col gap-1">
          <span className="text-[8px] font-mono text-zinc-500 uppercase">Avg Success</span>
          <span className="text-lg font-bold text-[#10b981]">{summary.avgSuccess}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col gap-1">
          <span className="text-[8px] font-mono text-zinc-500 uppercase">Total Vol</span>
          <span className="text-lg font-bold text-[#10b981]">{summary.totalVolume}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col gap-1">
          <span className="text-[8px] font-mono text-zinc-500 uppercase">Peak Day</span>
          <span className="text-sm font-bold text-zinc-200 mt-1">{summary.peakDay}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
