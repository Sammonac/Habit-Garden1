
import React from 'react';
import { motion } from 'framer-motion';
import { Habit, DailyLog } from '../types';
import { getTodayString, calculateStreak, getEvolutionStage } from '../utils';

interface Props {
  habits: Habit[];
  logs: DailyLog;
}

const NurseryView: React.FC<Props> = ({ habits, logs }) => {
  const today = getTodayString();
  const essentials = habits.filter(h => h.type === 'essential');
  const badHabits = habits.filter(h => h.type === 'bad');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-12"
    >
      <section>
        <header className="mb-6">
          <h2 className="text-xs font-mono text-[#10b981] uppercase tracking-widest">Flora Bio-Sync</h2>
          <p className="text-zinc-500 text-[10px] uppercase">Essential Habits 3x3 Grid</p>
        </header>
        <div className="grid grid-cols-3 gap-4">
          {essentials.map(h => (
            <PlantTile 
              key={h.id} 
              habit={h} 
              streak={calculateStreak(h.id, logs, today)}
              isMissed={!logs[today]?.[h.id]}
            />
          ))}
        </div>
      </section>

      <section>
        <header className="mb-6">
          <h2 className="text-xs font-mono text-rose-500 uppercase tracking-widest text-center">Guardian Sector</h2>
          <p className="text-zinc-500 text-[10px] uppercase text-center">Bad Habits Defense Layer</p>
        </header>
        <div className="grid grid-cols-3 gap-4">
          {badHabits.map(h => (
            <GuardianTile 
              key={h.id} 
              habit={h} 
              streak={calculateStreak(h.id, logs, today)}
              isMissed={!logs[today]?.[h.id]}
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
};

const PlantTile: React.FC<{ habit: Habit; streak: number; isMissed: boolean }> = ({ habit, streak, isMissed }) => {
  const stage = getEvolutionStage(streak);
  
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-2 flex flex-col items-center justify-between h-32 transition-all ${isMissed ? 'opacity-50 grayscale' : ''}`}>
      <div className="w-full flex justify-end">
        <span className="text-[8px] font-mono text-zinc-600 bg-zinc-800 px-1 rounded">LVL {stage}</span>
      </div>
      <div className={`relative flex-1 flex items-center justify-center ${isMissed ? 'animate-pulse' : ''}`}>
        {stage === 1 && <SeedlingSVG isMissed={isMissed} />}
        {stage === 2 && <SproutSVG isMissed={isMissed} />}
        {stage === 3 && <FlowerSVG isMissed={isMissed} />}
      </div>
      <p className="text-[9px] font-bold uppercase text-zinc-400 text-center truncate w-full">{habit.name}</p>
    </div>
  );
};

const GuardianTile: React.FC<{ habit: Habit; streak: number; isMissed: boolean }> = ({ habit, streak, isMissed }) => {
  const stage = getEvolutionStage(streak);

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-3 h-44 relative overflow-hidden transition-all ${isMissed ? 'grayscale opacity-70' : 'border-[#10b981]/30'}`}>
       <div className="absolute top-2 right-3 text-[8px] font-mono text-zinc-500">STAGE {stage}</div>
       <div className="flex-1 flex items-center justify-center">
         {stage === 1 && <EggSVG isMissed={isMissed} />}
         {stage === 2 && <HatchlingSVG isMissed={isMissed} />}
         {stage === 3 && <GuardianSVG isMissed={isMissed} />}
       </div>
       <div className="text-center">
         <p className="text-[10px] font-bold text-zinc-200 uppercase">{habit.name}</p>
         <div className="h-1 w-12 bg-zinc-800 rounded-full mt-2 mx-auto overflow-hidden">
            <div 
              className={`h-full bg-rose-500 transition-all duration-1000`} 
              style={{ width: `${(streak % 3) * 33.3}%` }} 
            />
         </div>
       </div>
    </div>
  );
};

// SVG Assets
const SeedlingSVG = ({ isMissed }: { isMissed: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22V14" stroke={isMissed ? "#52525b" : "#10b981"} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="3" fill={isMissed ? "#3f3f46" : "#065f46"} />
  </svg>
);

const SproutSVG = ({ isMissed }: { isMissed: boolean }) => (
  <motion.svg 
    initial={{ scale: 0.8 }} 
    animate={{ scale: 1 }}
    width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 22V10" stroke={isMissed ? "#52525b" : "#10b981"} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 14C12 14 16 14 18 10C20 6 16 4 12 10" stroke={isMissed ? "#52525b" : "#10b981"} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 16C12 16 8 16 6 12C4 8 8 6 12 12" stroke={isMissed ? "#52525b" : "#10b981"} strokeWidth="2" strokeLinecap="round"/>
  </motion.svg>
);

const FlowerSVG = ({ isMissed }: { isMissed: boolean }) => (
  <motion.svg 
    initial={{ scale: 0.8, rotate: -5 }} 
    animate={{ scale: 1, rotate: 0 }}
    width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 22V12" stroke={isMissed ? "#52525b" : "#059669"} strokeWidth="2" />
    <circle cx="12" cy="10" r="4" fill={isMissed ? "#3f3f46" : "#fbbf24"} />
    {[0, 60, 120, 180, 240, 300].map(deg => (
       <circle key={deg} cx={12 + 6 * Math.cos(deg * Math.PI / 180)} cy={10 + 6 * Math.sin(deg * Math.PI / 180)} r="3" fill={isMissed ? "#52525b" : "#10b981"} />
    ))}
  </motion.svg>
);

const EggSVG = ({ isMissed }: { isMissed: boolean }) => (
  <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4C10 4 4 16 4 30C4 40 12 44 20 44C28 44 36 40 36 30C36 16 30 4 20 4Z" fill={isMissed ? "#27272a" : "#18181b"} stroke={isMissed ? "#52525b" : "#3f3f46"} strokeWidth="2"/>
    <path d="M12 24C12 24 15 20 20 20C25 20 28 24 28 24" stroke={isMissed ? "#52525b" : "#10b981"} strokeWidth="2" strokeLinecap="round"/>
    {isMissed && <path d="M16 32H24" stroke="#52525b" strokeWidth="2" strokeLinecap="round"/>}
  </svg>
);

const HatchlingSVG = ({ isMissed }: { isMissed: boolean }) => (
  <motion.svg 
    animate={isMissed ? {} : { y: [0, -4, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="14" r="8" fill={isMissed ? "#27272a" : "#10b981"} fillOpacity="0.2" stroke={isMissed ? "#52525b" : "#10b981"} strokeWidth="2"/>
    <circle cx="9" cy="12" r="1.5" fill={isMissed ? "#52525b" : "#f8fafc"} />
    <circle cx="15" cy="12" r="1.5" fill={isMissed ? "#52525b" : "#f8fafc"} />
    <path d="M10 16C10 16 11 18 12 18C13 18 14 16 14 16" stroke={isMissed ? "#52525b" : "#f8fafc"} strokeWidth="1.5" strokeLinecap="round"/>
    {isMissed && <text x="18" y="10" fontSize="6" fill="#52525b" className="font-mono">zZ</text>}
  </motion.svg>
);

const GuardianSVG = ({ isMissed }: { isMissed: boolean }) => (
  <motion.svg 
    animate={isMissed ? {} : { scale: [1, 1.05, 1] }}
    transition={{ repeat: Infinity, duration: 3 }}
    width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 12L12 4L20 12L12 20L4 12Z" fill={isMissed ? "#18181b" : "#10b981"} fillOpacity="0.1" stroke={isMissed ? "#52525b" : "#10b981"} strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill={isMissed ? "#27272a" : "#10b981"} />
    <circle cx="10.5" cy="11.5" r="1" fill="white" />
    <circle cx="13.5" cy="11.5" r="1" fill="white" />
    {!isMissed && <path d="M8 8L6 6M16 8L18 6M8 16L6 18M16 16L18 18" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>}
    {isMissed && (
      <>
        <line x1="9" y1="14" x2="11" y2="14" stroke="#52525b" strokeWidth="1"/>
        <line x1="13" y1="14" x2="15" y2="14" stroke="#52525b" strokeWidth="1"/>
      </>
    )}
  </motion.svg>
);

export default NurseryView;
