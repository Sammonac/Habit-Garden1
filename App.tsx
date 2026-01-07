
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Sprout, 
  CheckCircle2, 
  Flame, 
  Zap,
  BarChart3
} from 'lucide-react';
import { AppState, View, Habit, DailyLog } from './types';
import { INITIAL_ESSENTIALS, INITIAL_BAD_HABITS, MOCK_TODAY } from './constants';
import { getTodayString } from './utils';
import Initialization from './components/Initialization';
import TrackView from './components/TrackView';
import AnalyticsView from './components/AnalyticsView';
import NurseryView from './components/NurseryView';

const STORAGE_KEY = 'habit_garden_state_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      habits: [...INITIAL_ESSENTIALS, ...INITIAL_BAD_HABITS],
      logs: {},
      initialized: false,
      startDate: MOCK_TODAY
    };
  });

  const [activeView, setActiveView] = useState<View>(View.Track);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleInitialize = (habits: Habit[]) => {
    setState(prev => ({ ...prev, habits, initialized: true }));
  };

  const toggleHabit = (habitId: string, date?: string) => {
    const targetDate = date || getTodayString();
    setState(prev => {
      const currentDayLogs = prev.logs[targetDate] || {};
      const newLogs = {
        ...prev.logs,
        [targetDate]: {
          ...currentDayLogs,
          [habitId]: !currentDayLogs[habitId]
        }
      };
      return { ...prev, logs: newLogs };
    });
  };

  if (!state.initialized) {
    return <Initialization onComplete={handleInitialize} initialHabits={state.habits} />;
  }

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[#0a0a0b] relative border-x border-zinc-800/30">
      <header className="p-6 border-b border-zinc-800/50 flex justify-between items-center sticky top-0 bg-[#0a0a0b]/80 backdrop-blur-md z-30">
        <div>
          <h1 className="text-[10px] font-mono tracking-[0.2em] text-[#10b981] uppercase animate-pulse">System Online</h1>
          <p className="text-xl font-bold tracking-tight">Garden Command</p>
        </div>
        <div className="bg-zinc-900 rounded-full px-4 py-1 text-[10px] font-mono text-zinc-400 border border-zinc-800">
          JAN 07, 2026
        </div>
      </header>

      <main className="p-4">
        <AnimatePresence mode="wait">
          {activeView === View.Track && (
            <TrackView 
              key="track" 
              habits={state.habits} 
              logs={state.logs} 
              onToggle={(id) => toggleHabit(id)} 
            />
          )}
          {activeView === View.Analytics && (
            <AnalyticsView 
              key="analytics" 
              habits={state.habits} 
              logs={state.logs}
              onToggleHabit={toggleHabit}
            />
          )}
          {activeView === View.Nursery && (
            <NurseryView 
              key="nursery" 
              habits={state.habits} 
              logs={state.logs} 
            />
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 p-3 flex justify-around items-center z-40">
        <NavButton 
          active={activeView === View.Track} 
          onClick={() => setActiveView(View.Track)} 
          icon={<LayoutGrid className="w-5 h-5" />} 
          label="Track" 
        />
        <NavButton 
          active={activeView === View.Analytics} 
          onClick={() => setActiveView(View.Analytics)} 
          icon={<BarChart3 className="w-5 h-5" />} 
          label="Analytics" 
        />
        <NavButton 
          active={activeView === View.Nursery} 
          onClick={() => setActiveView(View.Nursery)} 
          icon={<Sprout className="w-5 h-5" />} 
          label="Nursery" 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ 
  active, onClick, icon, label 
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#10b981]' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-[#10b981]/10' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
