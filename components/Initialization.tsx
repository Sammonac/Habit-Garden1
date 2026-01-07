
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import { Habit } from '../types';

interface Props {
  initialHabits: Habit[];
  onComplete: (habits: Habit[]) => void;
}

const Initialization: React.FC<Props> = ({ initialHabits, onComplete }) => {
  const [habits, setHabits] = useState(initialHabits);

  const updateHabitName = (id: string, name: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name } : h));
  };

  const essentials = habits.filter(h => h.type === 'essential');
  const badHabits = habits.filter(h => h.type === 'bad');

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex flex-col p-6 max-w-md mx-auto">
      <div className="mt-12 mb-8 text-center">
        <div className="inline-block p-4 bg-[#10b981]/10 rounded-full mb-4 border border-[#10b981]/20">
          <Zap className="w-8 h-8 text-[#10b981]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">INITIALIZE SYSTEM</h1>
        <p className="text-zinc-500 mt-2 font-mono text-xs uppercase tracking-widest">Protocol: Garden Creation</p>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto pb-32">
        <section>
          <h2 className="text-xs font-mono text-[#10b981] mb-4 uppercase tracking-wider">The 9 Essentials</h2>
          <div className="grid grid-cols-1 gap-2">
            {essentials.map(h => (
              <input
                key={h.id}
                type="text"
                value={h.name}
                onChange={(e) => updateHabitName(h.id, e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#10b981] transition-colors"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-mono text-rose-500 mb-4 uppercase tracking-wider">The 3 Bad Habits</h2>
          <div className="grid grid-cols-1 gap-2">
            {badHabits.map(h => (
              <input
                key={h.id}
                type="text"
                value={h.name}
                onChange={(e) => updateHabitName(h.id, e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0b] to-transparent max-w-md mx-auto">
        <button
          onClick={() => onComplete(habits)}
          className="w-full bg-[#10b981] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0da673] transition-all transform active:scale-95"
        >
          BEGIN MISSION <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Initialization;
