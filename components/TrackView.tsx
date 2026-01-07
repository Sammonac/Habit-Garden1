
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, TrendingUp } from 'lucide-react';
import { Habit, DailyLog } from '../types';
import { getTodayString, calculateStreak, getEvolutionStage } from '../utils';

interface Props {
  habits: Habit[];
  logs: DailyLog;
  onToggle: (id: string) => void;
}

const TrackView: React.FC<Props> = ({ habits, logs, onToggle }) => {
  const today = getTodayString();
  const todayLogs = logs[today] || {};

  const essentials = habits.filter(h => h.type === 'essential');
  const badHabits = habits.filter(h => h.type === 'bad');

  const totalCompleted = habits.filter(h => todayLogs[h.id]).length;
  const progressPercent = Math.round((totalCompleted / habits.length) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
        <div>
          <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-tighter">Daily Progress</h3>
          <p className="text-2xl font-bold font-mono">
            {progressPercent}% <span className="text-[#10b981] text-lg glow-text">READY</span>
          </p>
        </div>
        <div className="w-16 h-16 relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="#27272a"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray={175.9}
              strokeDashoffset={175.9 - (175.9 * progressPercent) / 100}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#10b981]" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
          Primary Directives (9/9)
        </h2>
        <div className="space-y-2">
          {essentials.map(h => (
            <HabitCard 
              key={h.id} 
              habit={h} 
              done={!!todayLogs[h.id]} 
              streak={calculateStreak(h.id, logs, today)}
              onToggle={() => onToggle(h.id)} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 pb-12">
        <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
          <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
          Defense Array (3/3)
        </h2>
        <div className="space-y-2">
          {badHabits.map(h => (
            <HabitCard 
              key={h.id} 
              habit={h} 
              done={!!todayLogs[h.id]} 
              streak={calculateStreak(h.id, logs, today)}
              onToggle={() => onToggle(h.id)} 
              isBad
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const HabitCard: React.FC<{ 
  habit: Habit; 
  done: boolean; 
  streak: number;
  onToggle: () => void; 
  isBad?: boolean 
}> = ({ habit, done, streak, onToggle, isBad }) => {
  const evolutionStage = getEvolutionStage(streak);

  return (
    <button
      onClick={onToggle}
      className={`w-full group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
        done 
          ? (isBad ? 'bg-rose-500/10 border-rose-500/30' : 'bg-[#10b981]/10 border-[#10b981]/30')
          : 'bg-zinc-900 border-zinc-800 active:scale-98'
      }`}
    >
      <div className={`p-1 rounded-full transition-transform duration-300 group-hover:scale-110 ${done ? (isBad ? 'text-rose-500' : 'text-[#10b981]') : 'text-zinc-600'}`}>
        {done ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </div>
      
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className={`font-semibold tracking-tight ${done ? 'text-zinc-100' : 'text-zinc-400'}`}>
            {habit.name}
          </p>
          <div className="flex items-center gap-0.5">
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-zinc-700'}`} />
            <span className={`text-[11px] font-bold font-mono ${streak > 0 ? 'text-orange-400' : 'text-zinc-600'}`}>{streak}</span>
          </div>
        </div>
        <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5 opacity-80">
          Evolution: Stage {evolutionStage}/3
        </p>
      </div>

      {done && (
        <div className={`text-[9px] font-mono font-bold px-2 py-1 rounded uppercase tracking-wider ${
          isBad ? 'bg-rose-500/20 text-rose-500' : 'bg-[#10b981]/20 text-[#10b981]'
        }`}>
          {isBad ? 'VERIFIED' : 'TARGET CLEARED'}
        </div>
      )}
      
      {/* Background glow effect on completion */}
      {done && (
        <div className={`absolute -right-4 -top-4 w-12 h-12 blur-2xl rounded-full ${isBad ? 'bg-rose-500/10' : 'bg-[#10b981]/10'}`} />
      )}
    </button>
  );
};

export default TrackView;
