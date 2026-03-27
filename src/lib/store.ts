'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Demographics } from './types';

interface GameState {
  // Responses
  responses: Record<string, number>;
  // Navigation
  currentEpisode: number;
  currentQuestionIndex: number;
  // Demographics
  demographics: Demographics;
  // Timer
  startTime: number | null;
  completionTimeSec: number | null;
  // Per-question timing
  questionStartTime: number | null;
  questionTimes: Record<string, number>;

  // Actions
  setResponse: (questionId: string, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setDemographics: (d: Demographics) => void;
  startTimer: () => void;
  stopTimer: () => void;
  startQuestionTimer: () => void;
  recordQuestionTime: (questionId: string) => void;
  reset: () => void;
}

const initialState = {
  responses: {} as Record<string, number>,
  currentEpisode: 1,
  currentQuestionIndex: 0,
  demographics: {} as Demographics,
  startTime: null as number | null,
  completionTimeSec: null as number | null,
  questionStartTime: null as number | null,
  questionTimes: {} as Record<string, number>,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setResponse: (questionId, value) =>
        set((state) => ({
          responses: { ...state.responses, [questionId]: value },
        })),

      nextQuestion: () =>
        set((state) => {
          if (state.currentQuestionIndex < 3) {
            return { currentQuestionIndex: state.currentQuestionIndex + 1 };
          }
          // Move to next episode
          if (state.currentEpisode < 6) {
            return {
              currentEpisode: state.currentEpisode + 1,
              currentQuestionIndex: 0,
            };
          }
          // All done — stay at last position
          return state;
        }),

      prevQuestion: () =>
        set((state) => {
          if (state.currentQuestionIndex > 0) {
            return { currentQuestionIndex: state.currentQuestionIndex - 1 };
          }
          // Move to previous episode's last question
          if (state.currentEpisode > 1) {
            return {
              currentEpisode: state.currentEpisode - 1,
              currentQuestionIndex: 3,
            };
          }
          return state;
        }),

      setDemographics: (d) => set({ demographics: d }),

      startTimer: () =>
        set({ startTime: Date.now() }),

      stopTimer: () =>
        set((state) => ({
          completionTimeSec: state.startTime
            ? Math.round((Date.now() - state.startTime) / 1000)
            : null,
        })),

      startQuestionTimer: () =>
        set({ questionStartTime: Date.now() }),

      recordQuestionTime: (questionId) =>
        set((state) => ({
          questionTimes: {
            ...state.questionTimes,
            [questionId]: state.questionStartTime
              ? Date.now() - state.questionStartTime
              : 0,
          },
          questionStartTime: Date.now(),
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'hexaco-game-storage',
    }
  )
);
