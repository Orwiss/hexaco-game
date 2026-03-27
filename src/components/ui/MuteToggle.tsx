'use client';

import { useState, useEffect } from 'react';
import { getMuted, toggleMute } from '@/lib/sound';

export default function MuteToggle() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(getMuted());
  }, []);

  const handleToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 text-lg active:scale-90 transition-transform"
      aria-label={muted ? '소리 켜기' : '소리 끄기'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
