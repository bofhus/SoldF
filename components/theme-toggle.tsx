'use client';

import { MoonStar, SunMedium } from 'lucide-react';
import { useReaderStore } from '@/store/reader-store';

export function ThemeToggle() {
  const theme = useReaderStore((state) => state.theme);
  const setTheme = useReaderStore((state) => state.setTheme);

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-[color:var(--surface)] p-1">
      {[
        { value: 'dark', label: 'Mörk', icon: MoonStar },
        { value: 'light', label: 'Ljus', icon: SunMedium },
      ].map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value as 'dark' | 'light')}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${theme === value ? 'bg-[color:var(--accent)] text-[#0a1206]' : 'text-[color:var(--muted)]'}`}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
