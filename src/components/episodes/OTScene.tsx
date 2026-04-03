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

// ---------------------------------------------------------------------------
// Q0 – SeatMap (socialBoldness, reverse=true)
// Bold behaviour → LOW value so reverseScore yields HIGH
// ---------------------------------------------------------------------------
const SEATS = [
  { label: '맨 앞\n가운데', value: 1, row: 0, col: 2 },
  { label: '앞줄 끝', value: 2, row: 0, col: 0 },
  { label: '중간', value: 3, row: 1, col: 2 },
  { label: '뒷줄 끝', value: 4, row: 2, col: 0 },
  { label: '맨 뒤\n구석', value: 5, row: 2, col: 4 },
] as const;

function SeatMap({
  themeColor,
  onSelect,
}: {
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 300);
  }

  // Build 3×5 grid
  const grid: (typeof SEATS[number] | null)[][] = Array.from({ length: 3 }, () =>
    Array.from<null>({ length: 5 }).fill(null),
  );
  SEATS.forEach((s) => {
    grid[s.row][s.col] = s;
  });

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Board */}
      <div
        className="mb-1 flex h-7 w-full items-center justify-center rounded-lg text-xs font-bold text-white"
        style={{ backgroundColor: themeColor }}
      >
        📋 칠판
      </div>

      {grid.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center gap-2">
          {row.map((seat, cIdx) => {
            if (!seat) {
              return (
                <div
                  key={cIdx}
                  className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 text-lg text-neutral-300"
                >
                  🪑
                </div>
              );
            }
            const isSelected = selected === seat.value;
            return (
              <motion.button
                key={cIdx}
                type="button"
                onClick={() => handleTap(seat.value)}
                className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 text-center leading-tight"
                style={{
                  borderColor: isSelected ? themeColor : '#e5e7eb',
                  backgroundColor: isSelected ? `${themeColor}20` : 'white',
                }}
                whileTap={{ scale: 0.93 }}
                animate={isSelected ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                <span className="text-lg">🪑</span>
                <span
                  className="whitespace-pre-line text-[9px] font-medium leading-tight"
                  style={{ color: isSelected ? themeColor : '#6b7280' }}
                >
                  {seat.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      ))}

      <p className="mt-1 text-center text-[11px] text-neutral-400">
        자리를 탭해서 선택하세요
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Q2 – EmojiPicker (liveliness, reverse=false)
// ---------------------------------------------------------------------------
const MOOD_OPTIONS = [
  { emoji: '🤩', label: '최고!', value: 5 },
  { emoji: '😊', label: '좋았어', value: 4 },
  { emoji: '🙂', label: '그저 그래', value: 3 },
  { emoji: '😐', label: '별로', value: 2 },
  { emoji: '😑', label: '힘들었어', value: 1 },
] as const;

function EmojiPicker({
  themeColor,
  onSelect,
}: {
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 300);
  }

  return (
    <div className="flex w-full items-center justify-center gap-4">
      {MOOD_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => handleTap(opt.value)}
            className="flex flex-col items-center gap-1 rounded-2xl p-2"
            style={{
              boxShadow: isSelected ? `0 0 0 3px ${themeColor}` : 'none',
              backgroundColor: isSelected ? `${themeColor}15` : 'transparent',
            }}
            animate={{ scale: isSelected ? 1.3 : 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span
              className="text-[10px] font-medium"
              style={{ color: isSelected ? themeColor : '#9ca3af' }}
            >
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question data
// ---------------------------------------------------------------------------
interface QItem {
  title: string;
  description?: string;
  type: 'seatmap' | 'choices' | 'emoji';
  variant?: 'default' | 'speech' | 'message';
  choices?: SceneChoice[];
}

const Q_DATA: QItem[] = [
  {
    // Q0 – socialBoldness (reverse=true) → spatial seatmap
    title: '어디에 앉을까?',
    type: 'seatmap',
  },
  {
    // Q1 – sociability (reverse=false) → speech variant
    title: '뒤풀이 갈래?',
    type: 'choices',
    variant: 'speech',
    choices: [
      { label: '내가 장소 알아볼게!', value: 5, emoji: '📍' },
      { label: '당연히 가야지!', value: 4, emoji: '🙌' },
      { label: '음... 잠깐만 있다 갈게', value: 3, emoji: '🤔' },
      { label: '오늘은 좀 피곤한데...', value: 2, emoji: '😴' },
      { label: '나 먼저 갈게, 수고!', value: 1, emoji: '👋' },
    ],
  },
  {
    // Q2 – liveliness (reverse=false) → emoji picker
    title: '오늘 OT 어땠어?',
    type: 'emoji',
  },
  {
    // Q3 – socialSelfEsteem (reverse=false) → default variant
    title: '오늘 나, 어땠을까?',
    description: '집에 돌아와서 오늘을 되돌아본다',
    type: 'choices',
    variant: 'default',
    choices: [
      { label: '오늘 꽤 괜찮았어, 나!', value: 5, emoji: '😎' },
      { label: '나름 잘한 것 같아', value: 4, emoji: '😊' },
      { label: '뭐 보통이었지', value: 3, emoji: '🙂' },
      { label: '좀 어색했나...', value: 2, emoji: '😅' },
      { label: '아 오늘 왜 그랬지...', value: 1, emoji: '😣' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function OTScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];

  return (
    <EpisodeSceneShell
      sceneKey={`ot-${episodeNumber}-${questionIndex}`}
      direction={direction}
      episodeNumber={episodeNumber}
      questionIndex={questionIndex}
      themeColor={themeColor}
    >
      <ScenePrompt
        title={q.title}
        description={q.description}
        themeColor={themeColor}
      />

      {q.type === 'seatmap' && (
        <SeatMap themeColor={themeColor} onSelect={onResponse} />
      )}

      {q.type === 'emoji' && (
        <EmojiPicker themeColor={themeColor} onSelect={onResponse} />
      )}

      {q.type === 'choices' && q.choices && (
        <ChoiceList
          choices={q.choices}
          themeColor={themeColor}
          onSelect={onResponse}
          variant={q.variant}
        />
      )}
    </EpisodeSceneShell>
  );
}
