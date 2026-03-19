'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReaderStore } from '@/store/reader-store';

export function useReaderProgress(chapterId: string) {
  const progressState = useReaderStore((state) => state.chapterProgress[chapterId]);
  const setProgress = useReaderStore((state) => state.setProgress);
  const [value, setValue] = useState(progressState?.progress ?? 0);

  useEffect(() => {
    setValue(progressState?.progress ?? 0);
  }, [progressState?.progress]);

  return useMemo(
    () => ({
      progress: value,
      lastSectionId: progressState?.lastSectionId,
      updateProgress: (nextValue: number, sectionId?: string) => {
        const clamped = Math.max(0, Math.min(100, Math.round(nextValue)));
        setValue(clamped);
        setProgress(chapterId, clamped, sectionId);
      },
    }),
    [chapterId, progressState?.lastSectionId, setProgress, value],
  );
}
