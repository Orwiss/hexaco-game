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
// PosterBoard – decorative conference poster illustration
// ---------------------------------------------------------------------------
function PosterBoard({ themeColor }: { themeColor: string }) {
  return (
    <div
      className="mx-auto flex w-full max-w-[280px] flex-col items-center rounded-2xl border-2 px-4 py-3"
      style={{ borderColor: themeColor + '30', backgroundColor: themeColor + '08' }}
    >
      {/* Title bar */}
      <div
        className="mb-2 h-2.5 w-3/4 rounded-full"
        style={{ backgroundColor: themeColor + '40' }}
      />
      <div
        className="mb-3 h-1.5 w-1/2 rounded-full"
        style={{ backgroundColor: themeColor + '25' }}
      />
      {/* Mini bar chart lines */}
      <div className="mb-2 flex items-end gap-1.5">
        {[40, 65, 50, 80, 35].map((h, i) => (
          <div
            key={i}
            className="w-4 rounded-t"
            style={{
              height: `${h * 0.3}px`,
              backgroundColor: themeColor + (i === 3 ? '70' : '30'),
            }}
          />
        ))}
      </div>
      {/* Speech bubble + people */}
      <div className="mt-1 flex items-center gap-2">
        <span className="text-base">🧑‍🔬</span>
        <div
          className="rounded-lg px-2 py-0.5 text-sm font-medium"
          style={{ backgroundColor: themeColor + '20', color: themeColor }}
        >
          💬 발표 중...
        </div>
        <span className="text-base">👩‍🏫</span>
        <span className="text-base">🧑‍💼</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Q0 – DataAction (fairness h2, reverse=true)
// Honest handling → LOW value so reverseScore(x)=6-x yields HIGH
// Bar chart + integrated toolbar actions (unified data-app panel)
// ---------------------------------------------------------------------------
const DATA_ACTIONS = [
  { emoji: '📋', label: '한계명시', value: 1 },
  { emoji: '📝', label: '주석달기', value: 2 },
  { emoji: '🗑️', label: '발표에서빼기', value: 3 },
  { emoji: '📈', label: '유리해석', value: 4 },
  { emoji: '🚫', label: '없던걸로', value: 5 },
] as const;

function DataAction({
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

  // Bar data – index 2 is the ambiguous one (pulses amber)
  const bars = [
    { height: 52, label: 'D1' },
    { height: 68, label: 'D2' },
    { height: 38, label: '⚠️' },
    { height: 60, label: 'D4' },
    { height: 46, label: 'D5' },
  ];

  return (
    <div
      className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: '#e5e7eb' }}
    >
      {/* Chart header */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2"
        style={{ borderColor: '#f1f5f9' }}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: themeColor }}
        />
        <span className="text-base font-semibold text-neutral-500">
          연구 데이터 분석
        </span>
      </div>

      {/* Bar chart area */}
      <div className="flex items-end justify-center gap-4 px-5 pb-2 pt-5">
        {bars.map((bar, i) => {
          const isAmbiguous = i === 2;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div
                className="w-9 rounded-t-md"
                style={{
                  height: `${bar.height}px`,
                  backgroundColor: isAmbiguous ? '#f59e0b' : themeColor + '50',
                }}
                animate={
                  isAmbiguous
                    ? { opacity: [1, 0.4, 1], backgroundColor: ['#f59e0b', '#fbbf24', '#f59e0b'] }
                    : {}
                }
                transition={
                  isAmbiguous
                    ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
                    : {}
                }
              />
              <span
                className="text-sm font-medium"
                style={{
                  color: isAmbiguous ? '#d97706' : '#9ca3af',
                }}
              >
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Toolbar divider */}
      <div className="mx-4 border-t" style={{ borderColor: '#f1f5f9' }} />

      {/* Action toolbar – integrated into chart panel */}
      <div className="flex items-center justify-around px-2 py-2.5">
        {DATA_ACTIONS.map((action) => {
          const isSelected = selected === action.value;
          return (
            <motion.button
              key={action.value}
              type="button"
              onClick={() => handleTap(action.value)}
              className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors"
              style={{
                backgroundColor: isSelected ? themeColor + '18' : 'transparent',
              }}
              whileTap={{ scale: 0.9 }}
              animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <motion.span
                className="text-lg"
                animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                {action.emoji}
              </motion.span>
              <span
                className="text-sm font-medium leading-tight"
                style={{ color: isSelected ? themeColor : '#6b7280' }}
              >
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question data
// ---------------------------------------------------------------------------
interface QItem {
  title: string;
  description?: string;
  type: 'datachart' | 'choices';
  variant?: 'default' | 'speech' | 'message';
  choices?: SceneChoice[];
}

const Q_DATA: QItem[] = [
  {
    // Q0 – fairness h2 (reverse=true)
    // Honest → LOW value so reverseScore yields HIGH
    title: '데이터 해석이 애매한 부분을 발견했다',
    description: '이 데이터를 발표에 어떻게 반영할까?',
    type: 'datachart',
  },
  {
    // Q1 – sincerity h1 (reverse=false)
    // Sincere → HIGH value directly
    title: '유명 교수님이 내 포스터에 관심을 보인다',
    type: 'choices',
    variant: 'speech',
    choices: [
      { label: '부족한 점도 솔직히 말씀드림', value: 5, emoji: '🙏' },
      { label: '있는 그대로 설명', value: 4, emoji: '📊' },
      { label: '좋은 부분을 강조해서 설명', value: 3, emoji: '✨' },
      { label: '약간 과장해서 설명', value: 2, emoji: '📢' },
      { label: '이 분야 최고인 것처럼 설명', value: 1, emoji: '🏆' },
    ],
  },
  {
    // Q2 – greedAvoidance h3 (reverse=false)
    // Greed-avoidant → HIGH value directly
    title: '옆 부스 연구자가 연구비, 학회 경비를 자랑한다',
    type: 'choices',
    variant: 'default',
    choices: [
      { label: '좋으시겠다~ (진심으로)', value: 5, emoji: '😊' },
      { label: '(별 관심 없이) 아 네~', value: 4, emoji: '🙂' },
      { label: '얼마 받으세요...?', value: 3, emoji: '🤔' },
      { label: '(은근 부러움)', value: 2, emoji: '😒' },
      { label: '저도 사실은... (자랑 시작)', value: 1, emoji: '🗣️' },
    ],
  },
  {
    // Q3 – modesty h4 (reverse=true)
    // Humble → LOW value so reverseScore yields HIGH
    title: "질문자가 '이 분야 전문가시네요'라고 추켜세운다",
    type: 'choices',
    variant: 'speech',
    choices: [
      { label: '아직 많이 부족합니다 ㅎㅎ', value: 1, emoji: '🙏' },
      { label: '감사합니다, 아직 공부 중이에요', value: 2, emoji: '😊' },
      { label: '감사합니다!', value: 3, emoji: '🙂' },
      { label: '네, 좀 했죠 ㅎ', value: 4, emoji: '😏' },
      { label: '논문 목록 보시면 아실 거예요', value: 5, emoji: '💪' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ConferenceScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];

  return (
    <EpisodeSceneShell
      sceneKey={`conf-${episodeNumber}-${questionIndex}`}
      direction={direction}
      episodeNumber={episodeNumber}
      questionIndex={questionIndex}
      themeColor={themeColor}
    >
      {/* Poster board illustration */}
      <PosterBoard themeColor={themeColor} />

      <ScenePrompt
        title={q.title}
        description={q.description}
        themeColor={themeColor}
      />

      {q.type === 'datachart' && (
        <DataAction themeColor={themeColor} onSelect={onResponse} />
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
