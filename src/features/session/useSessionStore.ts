import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex?: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,

  startSession: (exercises: Exercise[], startIndex = 0) => {
    if (!exercises || exercises.length === 0) {
      set({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
      return;
    }
    const validIndex = Math.max(0, Math.min(startIndex, exercises.length - 1));
    set({
      queue: [...exercises],
      currentIndex: validIndex,
      isRunning: true,
      elapsed: 0,
    });
  },

  toggleRun: () => {
    const { queue, isRunning, currentIndex } = get();
    if (queue.length === 0) return;
    set({
      isRunning: !isRunning,
      currentIndex: currentIndex === -1 ? 0 : currentIndex,
    });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;
    if (currentIndex === -1) {
      set({ currentIndex: 0, elapsed: 0 });
      return;
    }
    if (currentIndex + 1 < queue.length) {
      set({
        currentIndex: currentIndex + 1,
        elapsed: 0,
      });
    } else {
      set({ isRunning: false });
    }
  },

  prev: () => {
    const { elapsed, currentIndex, queue } = get();
    if (queue.length === 0) return;
    if (currentIndex === -1) {
      set({ currentIndex: 0, elapsed: 0 });
      return;
    }
    if (elapsed > 3) {
      set({ elapsed: 0 });
    } else if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, elapsed: 0 });
    } else {
      set({ elapsed: 0 });
    }
  },

  addToSession: (exercise: Exercise) => {
    const { queue } = get();
    if (queue.some((e) => e.id === exercise.id)) {
      return;
    }
    set({
      queue: [...queue, exercise],
    });
  },

  tick: () => {
    const { queue, currentIndex, elapsed, isRunning, next } = get();
    if (!isRunning || currentIndex < 0 || currentIndex >= queue.length) {
      return;
    }
    const current = queue[currentIndex];
    if (elapsed + 1 >= current.duration) {
      next();
    } else {
      set({ elapsed: elapsed + 1 });
    }
  },
}));
