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
/*  Q0 – SpotPicker: weekend location cards (2‑col + 1 staggered)    */
/* ------------------------------------------------------------------ */

const SPOT_TINTS = ['#EC489930', '#F59E0B30', '#3B82F630', '#10B98130', '#8B5CF630'];

function SpotPicker({
  choices,
  themeColor,
  onSelect,
}: {
  choices: SceneChoice[];
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 320);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {choices.map((c, i) => {
        const isSelected = selected === c.value;
        const isLastOdd = i === choices.length - 1 && choices.length % 2 === 1;
        return (
          <motion.button
            key={c.value}
            type="button"
            onClick={() => handleTap(c.value)}
            className={`flex flex-col items-center gap-2 rounded-2xl px-3 py-4 ${
              isLastOdd ? 'col-span-2 mx-auto w-1/2' : ''
            }`}
            style={{
              backgroundColor: isSelected ? `${themeColor}20` : SPOT_TINTS[i] || '#f8fafc',
              border: isSelected ? `2.5px solid ${themeColor}` : '2px solid transparent',
              boxShadow: isSelected
                ? `0 6px 20px ${themeColor}30`
                : '0 2px 8px rgba(0,0,0,0.06)',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 24 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="text-3xl">{c.emoji}</span>
            <span
              className="text-xs font-semibold leading-snug"
              style={{ color: isSelected ? themeColor : '#374151' }}
            >
              {c.label}
            </span>
            {/* Sparkle on selected */}
            {isSelected && (
              <motion.span
                className="absolute -right-1 -top-1 text-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: 1, rotate: [0, 15, 0] }}
                transition={{ duration: 0.4 }}
              >
                ✨
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q1 – InterestPicker: ticket/flyer style cards                     */
/* ------------------------------------------------------------------ */

function InterestPicker({
  choices,
  themeColor,
  onSelect,
}: {
  choices: SceneChoice[];
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 320);
  }

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {choices.map((c, i) => {
        const isSelected = selected === c.value;
        return (
          <motion.button
            key={c.value}
            type="button"
            onClick={() => handleTap(c.value)}
            className="flex w-[72px] flex-col items-center gap-1.5 rounded-xl px-2 py-3"
            style={{
              backgroundColor: isSelected ? themeColor : '#fff',
              border: isSelected ? `2px solid ${themeColor}` : `2px solid ${themeColor}30`,
              color: isSelected ? '#fff' : '#374151',
              boxShadow: isSelected ? `0 4px 14px ${themeColor}35` : 'none',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.93 }}
          >
            <span className="text-xl">{c.emoji}</span>
            <span className="text-[10px] font-semibold leading-tight">{c.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q2 – DoorPicker: 5 doors with perspective + open animation        */
/* ------------------------------------------------------------------ */

interface DoorChoice extends SceneChoice {
  color: string;
}

const DOOR_CHOICES: DoorChoice[] = [
  { emoji: '🎨', label: '예술+연구 새 길', value: 5, color: '#EC4899' },
  { emoji: '🚀', label: '스타트업 창업', value: 4, color: '#F59E0B' },
  { emoji: '🏢', label: '대기업 R&D', value: 3, color: '#3B82F6' },
  { emoji: '🏛️', label: '안정적 공기업', value: 2, color: '#10B981' },
  { emoji: '👨‍👩‍👧', label: '부모님 추천', value: 1, color: '#8B5CF6' },
];

function DoorPicker({
  choices,
  themeColor,
  onSelect,
}: {
  choices: DoorChoice[];
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 420);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Doors row */}
      <div className="flex items-end justify-center gap-2" style={{ perspective: '600px' }}>
        {choices.map((c, i) => {
          const isSelected = selected === c.value;
          return (
            <motion.button
              key={c.value}
              type="button"
              onClick={() => handleTap(c.value)}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex w-14 flex-col items-center justify-center gap-1 rounded-t-xl"
                style={{
                  height: 80,
                  background: `linear-gradient(180deg, ${c.color}50, ${c.color}25)`,
                  border: `2px solid ${c.color}80`,
                  borderBottom: 'none',
                  boxShadow: isSelected ? `0 4px 20px ${c.color}40` : `0 2px 8px ${c.color}15`,
                  transformOrigin: 'left center',
                }}
                animate={
                  isSelected
                    ? { rotateY: -35, scale: 1.05 }
                    : { rotateY: 0, scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <span className="text-2xl">{c.emoji}</span>
                {/* Door handle */}
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
              </motion.div>
              <span
                className="mt-1 max-w-[60px] text-center text-[9px] font-bold leading-tight"
                style={{ color: isSelected ? c.color : '#6b7280' }}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Gradient floor line */}
      <div
        className="h-1.5 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${themeColor}15, #F59E0B40, #3B82F630, #10B98130, ${themeColor}15)`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Question definitions                                              */
/* ------------------------------------------------------------------ */

const Q0_CHOICES: SceneChoice[] = [
  { emoji: '🎨', label: '미술관 전시', value: 1 },
  { emoji: '☕', label: '새로운 카페 탐방', value: 2 },
  { emoji: '📺', label: '넷플릭스 정주행', value: 3 },
  { emoji: '🏠', label: '단골 카페', value: 4 },
  { emoji: '🛋️', label: '집에서 뒹굴뒹굴', value: 5 },
];

const Q1_CHOICES: SceneChoice[] = [
  { emoji: '🤩', label: '꼭 가야지!', value: 5 },
  { emoji: '😊', label: '재밌겠다', value: 4 },
  { emoji: '🤔', label: '시간 되면', value: 3 },
  { emoji: '😕', label: '내 분야가 아닌데', value: 2 },
  { emoji: '🚫', label: '패스~', value: 1 },
];

const Q3_CHOICES: SceneChoice[] = [
  { label: '최고의 칭찬! 감사합니다', value: 5, emoji: '✨' },
  { label: '은근 뿌듯 ㅎㅎ', value: 4, emoji: '😏' },
  { label: '그냥 웃고 넘김', value: 3, emoji: '🙂' },
  { label: '약간 신경 쓰이긴 해...', value: 2, emoji: '😅' },
  { label: '기분 나쁜데...', value: 1, emoji: '😤' },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function GraduationScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const sceneKey = `graduation-${episodeNumber}-${questionIndex}`;

  return (
    <EpisodeSceneShell
      sceneKey={sceneKey}
      direction={direction}
      episodeNumber={episodeNumber}
      questionIndex={questionIndex}
      themeColor={themeColor}
    >
      {questionIndex === 0 && (
        <>
          <ScenePrompt
            title="주말에 뭐 할까?"
            description="졸업 심사 끝나면 뭐 하고 싶어?"
            themeColor={themeColor}
          />
          <SpotPicker choices={Q0_CHOICES} themeColor={themeColor} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 1 && (
        <>
          <ScenePrompt
            title="전혀 다른 분야 세미나 초대가 왔다"
            themeColor={themeColor}
          />
          <InterestPicker choices={Q1_CHOICES} themeColor={themeColor} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 2 && (
        <>
          <ScenePrompt
            title="졸업 후 뭘 하고 싶어?"
            themeColor={themeColor}
          />
          <DoorPicker choices={DOOR_CHOICES} themeColor={themeColor} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 3 && (
        <>
          <ScenePrompt
            title={'"좀 특이하다"는 말을 들으면?'}
            themeColor={themeColor}
          />
          <ChoiceList choices={Q3_CHOICES} themeColor={themeColor} onSelect={onResponse} />
        </>
      )}
    </EpisodeSceneShell>
  );
}
