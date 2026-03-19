'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useReaderStore } from '@/store/reader-store';

export function Providers({ children }: PropsWithChildren) {
  const theme = useReaderStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;

    root.dataset.theme = resolvedTheme;
  }, [theme]);

  return children;
}
