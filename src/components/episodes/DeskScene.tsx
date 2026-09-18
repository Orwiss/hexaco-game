'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick } from '@/lib/sound';
import {
  EpisodeSceneShell,
  ScenePrompt,
  ChoiceList,
  MoodSlider,
  type EpisodeSceneProps,
  type SceneChoice,
  type SliderPoint,
} from './shared';

// ---------------------------------------------------------------------------
// Q0 – c1 조직성 (no reverse) → SCENE TAP (desk top-view)
// ---------------------------------------------------------------------------
interface DeskItem {
  emoji: string;
  label: string;
  value: number;
  top: string;
  left: string;
  rotate: number;
}

const DESK_ITEMS: DeskItem[] = [
  { emoji: '📊', label: '우선순위표', value: 5, top: '18%', left: '22%', rotate: -6 },
  { emoji: '📋', label: '할일목록', value: 4, top: '14%', left: '62%', rotate: 4 },
  { emoji: '📝', label: '일단메모', value: 3, top: '48%', left: '42%', rotate: -2 },
  { emoji: '🔀', label: '되는대로', value: 2, top: '70%', left: '18%', rotate: 8 },
  { emoji: '📺', label: '유튜브', value: 1, top: '68%', left: '66%', rotate: -5 },
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

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Desk surface */}
      <div
        className="relative mx-auto w-full rounded-3xl"
        style={{
          aspectRatio: '4 / 3',
          background:
            'linear-gradient(160deg, #dfc89a 0%, #c9a96e 40%, #b8945a 100%)',
          border: '3px solid #a07842',
          boxShadow:
            'inset 0 2px 12px rgba(255,255,255,0.18), 0 6px 24px rgba(15,23,42,0.12)',
        }}
      >
        {/* Wood grain lines */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(95deg, transparent, transparent 18px, rgba(120,80,30,0.3) 18px, rgba(120,80,30,0.3) 19px)',
          }}
        />

        {/* Objects on desk */}
        {DESK_ITEMS.map((item) => {
          const isSelected = selected === item.value;
          return (
            <motion.button
              key={item.value}
              type="button"
              onClick={() => handleTap(item.value)}
              className="absolute flex flex-col items-center gap-0.5"
              style={{
                top: item.top,
                left: item.left,
                transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
              }}
              whileTap={{ scale: 0.92 }}
              animate={
                isSelected
                  ? { scale: [1, 1.1, 1], filter: `drop-shadow(0 0 8px ${themeColor})` }
                  : { scale: 1, filter: 'drop-shadow(0 0 0px transparent)' }
              }
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl border-2 shadow-md"
                style={{
                  backgroundColor: isSelected
                    ? `${themeColor}25`
                    : 'rgba(255,255,255,0.85)',
                  borderColor: isSelected ? themeColor : 'rgba(255,255,255,0.6)',
                  boxShadow: isSelected
                    ? `0 0 12px ${themeColor}50, 0 2px 8px rgba(0,0,0,0.1)`
                    : '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <span className="text-3xl">{item.emoji}</span>
              </div>
              <span
                className="mt-0.5 rounded-md px-2 py-0.5 text-sm font-bold"
                style={{
                  color: isSelected ? themeColor : '#5c4a2a',
                  backgroundColor: isSelected
                    ? `${themeColor}15`
                    : 'rgba(255,255,255,0.7)',
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-base text-neutral-400">
        책상 위 물건을 탭해서 선택하세요
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Q1 – c3 완벽주의 (reverse=YES) → SLIDER (MoodSlider) with document scene
// ---------------------------------------------------------------------------
const THOROUGHNESS_POINTS: SliderPoint[] = [
  { value: 1, emoji: '📝', label: '완벽 정리' },
  { value: 2, emoji: '🖊️', label: '표시해둠' },
  { value: 3, emoji: '👀', label: '문맥 파악' },
  { value: 4, emoji: '➡️', label: '넘어감' },
  { value: 5, emoji: '📕', label: '안 읽음' },
];

function DocumentScene({
  activeIndex,
  themeColor,
}: {
  activeIndex: number | null;
  themeColor: string;
}) {
  // More highlights when activeIndex is lower (more thorough)
  const highlightCount =
    activeIndex === null
      ? 2
      : activeIndex <= 0
        ? 5
        : activeIndex <= 1
          ? 3
          : activeIndex <= 2
            ? 2
            : 0;

  const lines = [
    { w: '85%', highlight: highlightCount >= 1 },
    { w: '70%', highlight: false },
    { w: '92%', highlight: highlightCount >= 3 },
    { w: '60%', highlight: false },
    { w: '78%', highlight: highlightCount >= 2 },
    { w: '88%', highlight: highlightCount >= 5 },
    { w: '55%', highlight: false },
    { w: '82%', highlight: highlightCount >= 4 },
  ];

  return (
    <div
      className="mx-auto w-full max-w-[260px] rounded-xl px-5 py-4"
      style={{
        background: 'linear-gradient(180deg, #fefce8 0%, #fef9c3 100%)',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Document title bar */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: themeColor }} />
        <div className="h-1.5 w-16 rounded-full bg-amber-300/60" />
      </div>

      {/* Text lines */}
      <div className="flex flex-col gap-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            style={{ width: line.w }}
            animate={{
              backgroundColor: line.highlight ? '#fbbf24' : '#d1d5db',
              opacity: line.highlight ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Annotation marks for thorough modes */}
      {highlightCount >= 3 && (
        <div className="mt-2 flex gap-1">
          {Array.from({ length: Math.min(highlightCount, 5) }).map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: themeColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            />
          ))}
          <span className="ml-1 text-xs font-medium" style={{ color: themeColor }}>
            메모
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Q3 – c4 신중함 (reverse=YES) → SCENE TAP (submit screen UI)
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
  { emoji: '😱', label: '아 까먹었다!', value: 5 },
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

  const progressPercent =
    selected !== null
      ? selected <= 2
        ? 100
        : selected === 3
          ? 85
          : 60
      : 75;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Mock submit screen */}
      <div
        className="w-full overflow-hidden rounded-2xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: `linear-gradient(90deg, ${themeColor}12, ${themeColor}06)`,
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            <div className="h-2 w-2 rounded-full bg-green-400" />
          </div>
          <span className="text-sm font-bold" style={{ color: themeColor }}>
            과제 제출
          </span>
        </div>

        <div className="px-4 pb-4 pt-3">
          {/* File preview */}
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <span className="text-sm">📄</span>
            <span className="text-sm font-medium text-slate-600">
              과제_최종본_v3.pdf
            </span>
            <span className="ml-auto text-sm text-slate-400">2.4MB</span>
          </div>

          {/* Progress bar */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-slate-400">업로드 진행률</span>
            <span
              className="text-sm font-bold"
              style={{ color: themeColor }}
            >
              {progressPercent}%
            </span>
          </div>
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: themeColor }}
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {/* Checkbox-style review options */}
          <div className="flex flex-col gap-2">
            {REVIEW_OPTIONS.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => handleTap(opt.value)}
                  className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left"
                  style={{
                    borderColor: isSelected ? themeColor : '#e2e8f0',
                    backgroundColor: isSelected ? `${themeColor}10` : 'white',
                  }}
                  whileTap={{ scale: 0.97 }}
                  animate={isSelected ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ type: 'tween', duration: 0.18 }}
                >
                  {/* Checkbox circle */}
                  <motion.div
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: isSelected ? themeColor : '#cbd5e1',
                      backgroundColor: isSelected ? themeColor : 'transparent',
                    }}
                    animate={
                      isSelected
                        ? { scale: [1, 1.2, 1], borderColor: themeColor, backgroundColor: themeColor }
                        : {}
                    }
                    transition={{ type: 'tween', duration: 0.25 }}
                  >
                    {isSelected && (
                      <motion.span
                        className="text-xs font-bold text-white"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.08, duration: 0.15 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>

                  <span className="text-base">{opt.emoji}</span>
                  <span
                    className="text-base font-medium"
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question data
// ---------------------------------------------------------------------------
interface QItem {
  title: string;
  description?: string;
  type: 'desk' | 'slider' | 'choices' | 'submit';
  choices?: SceneChoice[];
}

const Q_DATA: QItem[] = [
  {
    // Q0 – c1 조직성 (no reverse) → desk tap
    title: '과제 3개가 왔다!',
    description: '책상 위 물건을 골라 첫 행동을 시작하세요',
    type: 'desk',
  },
  {
    // Q1 – c3 완벽주의 (reverse=YES) → slider
    title: '모르는 용어 발견!',
    description: '논문을 읽다가 낯선 단어가 나왔다. 어떻게 할까?',
    type: 'slider',
  },
  {
    // Q2 – c2 근면성 (no reverse) → text choices
    title: '마감 내일인데 친구가 놀자고 한다',
    type: 'choices',
    choices: [
      { label: '미안, 과제 끝내야 해!', value: 5, emoji: '🚫' },
      { label: '과제 먼저 하고 늦게 합류할게', value: 4, emoji: '⏱️' },
      { label: '음... 한 시간만...?', value: 3, emoji: '🤔' },
      { label: '조금만 놀다 올게!', value: 2, emoji: '🎮' },
      { label: '과제는 내일 아침에 하지 뭐!', value: 1, emoji: '🎉' },
    ],
  },
  {
    // Q3 – c4 신중함 (reverse=YES) → submit review tap
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

      {q.type === 'slider' && (
        <MoodSlider
          points={THOROUGHNESS_POINTS}
          onSelect={onResponse}
          themeColor={themeColor}
          renderScene={(activeIndex) => (
            <DocumentScene activeIndex={activeIndex} themeColor={themeColor} />
          )}
        />
      )}

      {q.type === 'choices' && q.choices && (
        <ChoiceList
          choices={q.choices}
          themeColor={themeColor}
          onSelect={onResponse}
        />
      )}

      {q.type === 'submit' && (
        <SubmitReview themeColor={themeColor} onSelect={onResponse} />
      )}
    </EpisodeSceneShell>
  );
}
