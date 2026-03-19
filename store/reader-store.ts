'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ChapterProgress {
  chapterId: string;
  progress: number;
  lastSectionId?: string;
  updatedAt: string;
}

interface ReaderState {
  theme: 'dark' | 'light' | 'system';
  chapterProgress: Record<string, ChapterProgress>;
  lastChapterId?: string;
  setTheme: (theme: ReaderState['theme']) => void;
  setProgress: (chapterId: string, progress: number, lastSectionId?: string) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      theme: 'system',
      chapterProgress: {},
      lastChapterId: undefined,
      setTheme: (theme) => set({ theme }),
      setProgress: (chapterId, progress, lastSectionId) =>
        set((state) => ({
          lastChapterId: chapterId,
          chapterProgress: {
            ...state.chapterProgress,
            [chapterId]: {
              chapterId,
              progress,
              lastSectionId,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
    }),
    {
      name: 'soldf-reader-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
