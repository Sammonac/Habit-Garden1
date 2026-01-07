
import { Habit } from './types';

export const INITIAL_ESSENTIALS: Habit[] = [
  { id: 'e1', name: 'Gratitude', type: 'essential' },
  { id: 'e2', name: 'Meditation', type: 'essential' },
  { id: 'e3', name: 'Training', type: 'essential' },
  { id: 'e4', name: 'Breakfast', type: 'essential' },
  { id: 'e5', name: 'Pomodoro', type: 'essential' },
  { id: 'e6', name: 'Dinner', type: 'essential' },
  { id: 'e7', name: 'Planning', type: 'essential' },
  { id: 'e8', name: 'Mindful Movement', type: 'essential' },
  { id: 'e9', name: 'Journal', type: 'essential' },
];

export const INITIAL_BAD_HABITS: Habit[] = [
  { id: 'b1', name: 'Bad Food', type: 'bad' },
  { id: 'b2', name: 'Drinking', type: 'bad' },
  { id: 'b3', name: 'Screentime', type: 'bad' },
];

export const COLORS = {
  primary: '#10b981', // Neon Green
  bg: '#0a0a0b',
  card: '#18181b',
  text: '#f8fafc',
  muted: '#71717a'
};

export const MOCK_TODAY = "2026-01-07";
