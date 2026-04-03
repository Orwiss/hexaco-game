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
// Q0 – DeskItems (organization, reverse=false)
// Arranged in a 2-1-2 grid pattern
// ---------------------------------------------------------------------------
interface DeskItem {
  emoji: string;
  label: string;
  value: number;
}

const DESK_ITEMS: DeskItem[] = [
  { emoji: '📊', label: '우선순위 표', value: 5 },
  { emoji: '📋', label: '할 일 목록', value: 4 },
  { emoji: '📝', label: '일단 메모', value: 3 },
  { emoji: '🔀', label: '되는 대로', value: 2 },
  { emoji: '📺', label: '유튜브 한 편', value: 1 },
];

function DeskItems({
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

  const topRow = DESK_ITEMS.slice(0, 2);
  const centerRow = DESK_ITEMS.slice(2, 3);
  const bottomRow = DESK_ITEMS.slice(3, 5);

  function renderItem(item: DeskItem) {
    const isSelected = selected === item.value;
    return (
      <motion.button
        key={item.value}
        type="button"
        onClick={() => handleTap(item.value)}
        className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-2xl border-2"
        style={{
          borderColor: isSelected ? themeColor : '#e2e8f0',
          backgroundColor: isSelected ? `${themeColor}18` : 'rgba(255,255,255,0.96)',
          boxShadow: isSelected
            ? `0 0 0 2px ${themeColor}40`
            : '0 2px 8px rgba(15,23,42,0.06)',
        }}
        whileTap={{ scale: 0.93 }}
        animate={isSelected ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        <span className="text-2xl">{item.emoji}</span>
        <span
          className="text-xs font-medium"
          style={{ color: isSelected ? themeColor : '#475569' }}
        >
          {item.label}
        </span>
      </motion.button>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Desk surface */}
      <div
        className="w-full rounded-2xl px-4 py-5"
        style={{
          background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Top row: 2 items */}
          <div className="flex justify-center gap-3">
            {topRow.map(renderItem)}
          </div>
          {/* Center row: 1 item */}
          <div className="flex justify-center">
            {centerRow.map(renderItem)}
          </div>
          {/* Bottom row: 2 items */}
          <div className="flex justify-center gap-3">
            {bottomRow.map(renderItem)}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-neutral-400">
        책상 위 물건을 탭해서 선택하세요
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Q3 – SubmitReview (prudence, reverse=true)
// Careful review → LOW value so reverseScore yields HIGH
// ---------------------------------------------------------------------------
interface ReviewOption {
  emoji: string;
  label: string;
  value: number;
}

const REVIEW_OPTIONS: ReviewOption[] = [
  { emoji: '🔍🔍🔍', label: '세 번째 검토 중...', value: 1 },
  { emoji: '🔍🔍', label: '한 번 더 읽어보자', value: 2 },
  { emoji: '🔍', label: '맞춤법만 확인', value: 3 },
  { emoji: '✅', label: '됐다, 제출!', value: 4 },
  { emoji: '😱', label: '아 까먹었다! (급히 제출)', value: 5 },
];

function SubmitReview({
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

  // Fake progress percentage based on review thoroughness
  const progressPercent = selected !== null ? (selected <= 2 ? 100 : selected === 3 ? 85 : 60) : 75;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Mock submit screen */}
      <div
        className="w-full rounded-2xl px-4 pb-4 pt-3"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        }}
      >
        {/* Title bar */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: themeColor }}
          />
          <span className="text-xs font-bold" style={{ color: themeColor }}>
            과제 제출
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: themeColor }}
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Review options */}
        <div className="flex flex-col gap-2">
          {REVIEW_OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => handleTap(opt.value)}
                className="flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left"
                style={{
                  borderColor: isSelected ? themeColor : '#e2e8f0',
                  backgroundColor: isSelected ? `${themeColor}15` : 'white',
                }}
                whileTap={{ scale: 0.97 }}
                animate={isSelected ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.18 }}
              >
                {/* Check badge */}
                <motion.div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs"
                  style={{
                    backgroundColor: isSelected ? themeColor : '#f1f5f9',
                    color: isSelected ? 'white' : '#94a3b8',
                  }}
                  animate={isSelected ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {isSelected ? '✓' : '○'}
                </motion.div>

                <span className="text-sm">{opt.emoji}</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: isSelected ? themeColor : '#475569' }}
                >
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </div>
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
  type: 'desk' | 'choices' | 'submit';
  variant?: 'default' | 'speech' | 'message';
  choices?: SceneChoice[];
}

const Q_DATA: QItem[] = [
  {
    // Q0 – organization (reverse=false) → desk items
    title: '과제 3개가 왔다!',
    description: '책상 위 물건을 골라 첫 행동을 시작하세요',
    type: 'desk',
  },
  {
    // Q1 – perfectionism (reverse=true) → default choices
    // Thorough behaviour → LOW value so reverseScore yields HIGH
    title: '논문 읽기',
    description: '모르는 용어를 발견했다. 어떻게 할까?',
    type: 'choices',
    variant: 'default',
    choices: [
      { label: '바로 검색하고 노트에 정리', value: 1, emoji: '📝' },
      { label: '형광펜으로 표시해두고 나중에', value: 2, emoji: '🖊️' },
      { label: '문맥으로 대충 파악', value: 3, emoji: '👀' },
      { label: '넘어감', value: 4, emoji: '➡️' },
      { label: '논문 읽기 그만둠', value: 5, emoji: '📕' },
    ],
  },
  {
    // Q2 – diligence (reverse=false) → default choices
    title: '마감 내일인데 친구가 놀자고 한다',
    type: 'choices',
    variant: 'default',
    choices: [
      { label: '미안, 과제 끝내야 해!', value: 5, emoji: '🚫' },
      { label: '과제 먼저 하고 늦게 합류할게', value: 4, emoji: '⏱️' },
      { label: '음... 한 시간만...?', value: 3, emoji: '🤔' },
      { label: '조금만 놀다 올게!', value: 2, emoji: '🎮' },
      { label: '과제는 내일 아침에 하지 뭐!', value: 1, emoji: '🎉' },
    ],
  },
  {
    // Q3 – prudence (reverse=true) → submit review
    // Careful review → LOW value so reverseScore yields HIGH
    title: '과제 제출 버튼 앞에서',
    description: '최종 제출 전, 몇 번 확인할까?',
    type: 'submit',
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function DeskScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];

  return (
    <EpisodeSceneShell
      sceneKey={`desk-${episodeNumber}-${questionIndex}`}
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

      {q.type === 'desk' && (
        <DeskItems themeColor={themeColor} onSelect={onResponse} />
      )}

      {q.type === 'submit' && (
        <SubmitReview themeColor={themeColor} onSelect={onResponse} />
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
