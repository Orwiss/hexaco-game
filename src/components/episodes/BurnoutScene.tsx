'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick } from '@/lib/sound';
import {
  EpisodeSceneShell,
  ScenePrompt,
  ChoiceList,
  type EpisodeSceneProps,
  type SceneChoice,
} from './shared';

/* ------------------------------------------------------------------ */
/*  Q0 – PathPicker: dark campus map with tappable path options       */
/* ------------------------------------------------------------------ */

function PathPicker({
  choices,
  onSelect,
}: {
  choices: SceneChoice[];
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const accent = '#94A3B8';

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 320);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Campus silhouette */}
      <div
        className="relative flex items-end justify-center gap-1 rounded-2xl px-4 pb-3 pt-6"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid #334155',
        }}
      >
        {/* Stars */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-slate-400"
            style={{ left: `${15 + i * 18}%`, top: `${12 + (i % 3) * 8}%` }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        <span className="text-2xl">🏫</span>
        <span className="text-xl opacity-60">🌙</span>
        <span className="text-2xl">🔬</span>
      </div>

      {/* Path option buttons — 2‑col + 1 staggered grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {choices.map((c, i) => {
          const isSelected = selected === c.value;
          const isLastOdd = i === choices.length - 1 && choices.length % 2 === 1;
          return (
            <motion.button
              key={c.value}
              type="button"
              onClick={() => handleTap(c.value)}
              className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-center ${
                isLastOdd ? 'col-span-2 mx-auto w-1/2' : ''
              }`}
              style={{
                backgroundColor: isSelected ? `${accent}25` : '#1e293b',
                border: isSelected ? `2px solid ${accent}` : '2px solid #334155',
                boxShadow: isSelected ? `0 0 12px ${accent}30` : 'none',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="text-xl">{c.emoji}</span>
              <span
                className="text-xs font-medium leading-snug"
                style={{ color: isSelected ? accent : '#cbd5e1' }}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q2 – ActionPicker: circular icon buttons in a horizontal row      */
/* ------------------------------------------------------------------ */

function ActionPicker({
  choices,
  onSelect,
}: {
  choices: SceneChoice[];
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const accent = '#94A3B8';

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 320);
  }

  return (
    <div className="flex items-start justify-center gap-3">
      {choices.map((c, i) => {
        const isSelected = selected === c.value;
        return (
          <motion.button
            key={c.value}
            type="button"
            onClick={() => handleTap(c.value)}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.92 }}
          >
            {/* Circular icon */}
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: isSelected ? `${accent}25` : '#1e293b',
                border: isSelected ? `2.5px solid ${accent}` : '2px solid #334155',
                boxShadow: isSelected ? `0 0 16px ${accent}40, 0 0 4px ${accent}20` : 'none',
              }}
            >
              <span className="text-2xl">{c.emoji}</span>
            </div>
            {/* Label */}
            <span
              className="max-w-[60px] text-center text-[10px] font-medium leading-tight"
              style={{ color: isSelected ? accent : '#94a3b8' }}
            >
              {c.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Question definitions                                              */
/* ------------------------------------------------------------------ */

const Q0_CHOICES: SceneChoice[] = [
  { emoji: '😨', label: '무서워... 택시 타자', value: 5 },
  { emoji: '😰', label: '불안하지만 가야지', value: 4 },
  { emoji: '🚶', label: '별 생각 없이 걸어감', value: 3 },
  { emoji: '😎', label: '괜찮은데?', value: 2 },
  { emoji: '🌙', label: '조용해서 오히려 좋아', value: 1 },
];

const Q1_CHOICES: SceneChoice[] = [
  { label: '잠도 못 잘 것 같아...', value: 5, emoji: '😵' },
  { label: '꽤 불안하다', value: 4, emoji: '😰' },
  { label: '약간 걱정되긴 해', value: 3, emoji: '🤔' },
  { label: '어떻게든 되겠지', value: 2, emoji: '🙂' },
  { label: '에이 뭐 별거겠어', value: 1, emoji: '😎' },
];

const Q2_CHOICES: SceneChoice[] = [
  { emoji: '📞', label: '바로 친구한테 전화', value: 1 },
  { emoji: '📱', label: 'SNS에 힘들다고 올림', value: 2 },
  { emoji: '😶', label: '혼자 삭이는 중...', value: 3 },
  { emoji: '💻', label: '바로 수정 시작', value: 4 },
  { emoji: '🗑️', label: '별 감흥 없음, 다음 저널로', value: 5 },
];

const Q3_CHOICES: SceneChoice[] = [
  { label: '눈물이 날 것 같다', value: 5, emoji: '😢' },
  { label: '뭉클하다...', value: 4, emoji: '🥹' },
  { label: '축하! (근데 좀 쓸쓸)', value: 3, emoji: '😊' },
  { label: '담담하게 축하', value: 2, emoji: '🙂' },
  { label: '별 감흥 없음', value: 1, emoji: '😐' },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function BurnoutScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const sceneKey = `burnout-${episodeNumber}-${questionIndex}`;

  return (
    <EpisodeSceneShell
      sceneKey={sceneKey}
      direction={direction}
      episodeNumber={episodeNumber}
      questionIndex={questionIndex}
      themeColor={themeColor}
      dark
    >
      {questionIndex === 0 && (
        <>
          <ScenePrompt
            title="혼자 야간 실험을 해야 한다"
            description="어두운 캠퍼스를 걸어간다"
            themeColor={themeColor}
            dark
          />
          <PathPicker choices={Q0_CHOICES} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 1 && (
        <>
          <ScenePrompt
            title="내일 중간발표인데 PPT가 안 끝남"
            themeColor={themeColor}
            dark
          />
          <ChoiceList choices={Q1_CHOICES} themeColor={themeColor} onSelect={onResponse} dark />
        </>
      )}

      {questionIndex === 2 && (
        <>
          <ScenePrompt
            title="논문 리젝 이메일을 받았다"
            description="어떻게 하겠어?"
            themeColor={themeColor}
            dark
          />
          <ActionPicker choices={Q2_CHOICES} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 3 && (
        <>
          <ScenePrompt
            title="같이 입학한 동기가 먼저 졸업한다"
            themeColor={themeColor}
            dark
          />
          <ChoiceList choices={Q3_CHOICES} themeColor={themeColor} onSelect={onResponse} dark />
        </>
      )}
    </EpisodeSceneShell>
  );
}
