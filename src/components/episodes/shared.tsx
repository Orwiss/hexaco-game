'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
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
            className="rounded-xl px-3 py-1.5 text-sm font-bold"
            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
          >
            EP.{episodeNumber}
          </span>
          <span className={`text-sm ${dark ? 'text-slate-400' : 'text-neutral-400'}`}>
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
      <p className={`text-lg font-bold leading-snug ${dark ? 'text-slate-50' : 'text-neutral-900'}`}>
        {title}
      </p>
      {description && (
        <p className={`mt-2 text-sm leading-snug ${dark ? 'text-slate-300' : 'text-neutral-500'}`}>
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
            className={`w-full border-2 px-4 py-3.5 text-left transition-colors ${radius}`}
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
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start gap-3">
              {choice.emoji && <span className="pt-0.5 text-lg">{choice.emoji}</span>}
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{choice.label}</p>
                {choice.helper && (
                  <p className={`mt-1 text-xs ${dark ? 'text-slate-400' : 'text-neutral-500'}`}>
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
