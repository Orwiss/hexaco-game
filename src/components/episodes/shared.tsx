'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useCallback, type ReactNode } from 'react';
import { playClick } from '@/lib/sound';

export interface EpisodeSceneProps {
  episodeNumber: number;
  questionIndex: number;
  themeColor: string;
  sceneContext: string;
  onResponse: (value: number) => void;
  direction: number;
}

export interface SceneChoice {
  label: string;
  value: number;
  emoji?: string;
  helper?: string;
}

export function EpisodeSceneShell({
  sceneKey,
  direction,
  episodeNumber,
  questionIndex,
  themeColor,
  dark = false,
  children,
}: {
  sceneKey: string;
  direction: number;
  episodeNumber: number;
  questionIndex: number;
  themeColor: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={sceneKey}
        custom={direction}
        initial={{ x: direction > 0 ? 280 : -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction > 0 ? -280 : 280, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className={`flex flex-1 flex-col px-5 pb-24 pt-4 ${dark ? 'bg-slate-950' : ''}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <span
            className="rounded-xl px-3 py-1.5 text-base font-bold"
            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
          >
            EP.{episodeNumber}
          </span>
          <span className={`text-base ${dark ? 'text-slate-400' : 'text-neutral-400'}`}>
            Q{questionIndex + 1}/4
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col justify-center gap-5">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ScenePrompt({
  title,
  description,
  themeColor,
  dark = false,
}: {
  title: string;
  description?: string;
  themeColor: string;
  dark?: boolean;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{
        background: dark
          ? 'linear-gradient(180deg, rgba(30,41,59,0.96), rgba(15,23,42,0.96))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96))',
        border: dark ? '1px solid rgba(148,163,184,0.16)' : '1px solid rgba(226,232,240,0.9)',
        boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
      }}
    >
      <p className={`text-2xl font-bold leading-snug ${dark ? 'text-slate-50' : 'text-neutral-900'}`}>
        {title}
      </p>
      {description && (
        <p className={`mt-2 text-lg leading-snug ${dark ? 'text-slate-300' : 'text-neutral-500'}`}>
          {description}
        </p>
      )}
      <div className="mt-3 h-1 w-12 rounded-full" style={{ backgroundColor: `${themeColor}50` }} />
    </div>
  );
}

export function ChoiceList({
  choices,
  themeColor,
  onSelect,
  variant = 'default',
  dark = false,
}: {
  choices: SceneChoice[];
  themeColor: string;
  onSelect: (value: number) => void;
  variant?: 'default' | 'speech' | 'message';
  dark?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 320);
  }

  return (
    <div className="flex flex-col gap-3">
      {choices.map((choice) => {
        const isSelected = selected === choice.value;
        const radius =
          variant === 'speech'
            ? 'rounded-2xl rounded-tl-md'
            : variant === 'message'
              ? 'rounded-2xl rounded-br-md'
              : 'rounded-2xl';

        return (
          <motion.button
            key={choice.value}
            type="button"
            onClick={() => handleTap(choice.value)}
            className={`w-full border-2 px-4 py-4 text-left transition-colors ${radius}`}
            style={{
              borderColor: isSelected ? themeColor : dark ? '#334155' : '#e5e7eb',
              backgroundColor: isSelected
                ? `${themeColor}18`
                : dark
                  ? 'rgba(15,23,42,0.88)'
                  : 'rgba(255,255,255,0.96)',
              color: isSelected ? themeColor : dark ? '#e2e8f0' : '#374151',
            }}
            whileTap={{ scale: 0.985 }}
            animate={isSelected ? { scale: [1, 1.02, 1] } : {}}
            transition={{ type: 'tween', duration: 0.18 }}
          >
            <div className="flex items-start gap-3">
              {choice.emoji && <span className="pt-0.5 text-2xl">{choice.emoji}</span>}
              <div className="min-w-0">
                <p className="text-lg font-medium leading-snug">{choice.label}</p>
                {choice.helper && (
                  <p className={`mt-1 text-base ${dark ? 'text-slate-400' : 'text-neutral-500'}`}>
                    {choice.helper}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MoodSlider – 5-snap horizontal track with reactive scene          */
/* ------------------------------------------------------------------ */

export interface SliderPoint {
  value: number;
  emoji: string;
  label: string;
}

export function MoodSlider({
  points,
  onSelect,
  themeColor,
  dark = false,
  renderScene,
}: {
  points: SliderPoint[];
  onSelect: (value: number) => void;
  themeColor: string;
  dark?: boolean;
  renderScene?: (activeIndex: number | null) => ReactNode;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const confirmedRef = useRef(false);
  const draggingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const indexFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (points.length - 1));
    },
    [points.length],
  );

  const confirm = useCallback(
    (idx: number) => {
      if (confirmedRef.current) return;
      confirmedRef.current = true;
      playClick();
      setTimeout(() => onSelect(points[idx].value), 500);
    },
    [onSelect, points],
  );

  const scheduleConfirm = useCallback(
    (idx: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => confirm(idx), 500);
    },
    [confirm],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (confirmedRef.current) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      draggingRef.current = true;
      const idx = indexFromPointer(e.clientX);
      setActiveIdx(idx);
    },
    [indexFromPointer],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current || confirmedRef.current) return;
      const idx = indexFromPointer(e.clientX);
      setActiveIdx(idx);
    },
    [indexFromPointer],
  );

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current || confirmedRef.current) return;
    draggingRef.current = false;
    if (activeIdx !== null) scheduleConfirm(activeIdx);
  }, [activeIdx, scheduleConfirm]);

  const handleTap = useCallback(
    (idx: number) => {
      if (confirmedRef.current) return;
      setActiveIdx(idx);
      playClick();
      scheduleConfirm(idx);
    },
    [scheduleConfirm],
  );

  const pct = activeIdx !== null ? (activeIdx / (points.length - 1)) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Reactive scene illustration */}
      {renderScene && (
        <div className="mx-auto w-full max-w-[320px]">{renderScene(activeIdx)}</div>
      )}

      {/* Track */}
      <div className="px-2">
        <div
          ref={trackRef}
          className="relative h-12 cursor-pointer touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* Rail */}
          <div
            className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: dark ? '#334155' : '#e5e7eb' }}
          />
          {/* Active fill */}
          {activeIdx !== null && (
            <motion.div
              className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: themeColor, width: `${pct}%` }}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          {/* Snap dots */}
          {points.map((_, i) => {
            const dotPct = (i / (points.length - 1)) * 100;
            const isActive = activeIdx === i;
            return (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${dotPct}%` }}
                animate={{
                  scale: isActive ? 1.4 : 1,
                  backgroundColor: isActive
                    ? themeColor
                    : activeIdx !== null && i <= activeIdx
                      ? themeColor
                      : dark
                        ? '#475569'
                        : '#d1d5db',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: 'inherit' }} />
              </motion.div>
            );
          })}

          {/* Thumb */}
          {activeIdx !== null && (
            <motion.div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div
                className="h-9 w-9 rounded-full border-[3px] shadow-md"
                style={{
                  backgroundColor: dark ? '#1e293b' : 'white',
                  borderColor: themeColor,
                  boxShadow: `0 0 10px ${themeColor}40`,
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Emoji + label row */}
        <div className="mt-1 flex justify-between">
          {points.map((pt, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleTap(i)}
                className="flex flex-col items-center gap-0.5"
              >
                <motion.span
                  className="text-3xl"
                  animate={{ scale: isActive ? 1.3 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  {pt.emoji}
                </motion.span>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isActive ? themeColor : dark ? '#94a3b8' : '#9ca3af',
                  }}
                >
                  {pt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
