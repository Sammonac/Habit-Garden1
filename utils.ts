
import { DailyLog } from './types';

export const getTodayString = () => {
  // Static context as requested: January 7, 2026
  return "2026-01-07"; 
};

export const getDatesLastNDays = (endDay: string, n: number) => {
  const dates = [];
  const end = new Date(endDay);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export const getDatesLast30Days = (endDay: string) => {
  return getDatesLastNDays(endDay, 30);
};

export const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
};

export const calculateStreak = (habitId: string, logs: DailyLog, today: string) => {
  let streak = 0;
  let current = new Date(today);
  
  // Start from today or yesterday depending on if today is done
  const todayDone = logs[today]?.[habitId];
  if (!todayDone) {
      current.setDate(current.getDate() - 1);
  }

  while (true) {
    const dateStr = current.toISOString().split('T')[0];
    if (logs[dateStr]?.[habitId]) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  
  return todayDone ? streak : streak; 
};

export const getEvolutionStage = (streak: number) => {
  if (streak >= 6) return 3; // Full Bloom
  if (streak >= 3) return 2; // Sprout
  return 1; // Seedling
};
