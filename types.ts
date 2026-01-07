
export type HabitType = 'essential' | 'bad';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
}

export interface DailyLog {
  [date: string]: {
    [habitId: string]: boolean;
  };
}

export interface AppState {
  habits: Habit[];
  logs: DailyLog;
  initialized: boolean;
  startDate: string;
}

export enum View {
  Track = 'track',
  Analytics = 'analytics',
  Nursery = 'nursery'
}

export enum AnalyticsSubView {
  Momentum = 'momentum',
  Matrix = 'matrix'
}
