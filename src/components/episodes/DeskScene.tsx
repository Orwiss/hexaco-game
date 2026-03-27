'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick } from '@/lib/sound';

interface EpisodeSceneProps {
  episodeNumber: number;
  questionIndex: number;
  themeColor: string;
  sceneContext: string;
  onResponse: (value: number) => void;
  direction: number;
}

interface ChoiceCard {
  label: string;
  value: number;
  emoji?: string;
}

function ChoiceCards({
  choices,
  themeColor,
  onSelect,
}: {
  choices: ChoiceCard[];
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
    <div className="flex flex-col gap-2 w-full">
      {choices.map(c => {
        const isSelected = selected === c.value;
        return (
          <motion.button
            key={c.value}
            type="button"
            onClick={() => handleTap(c.value)}
            className="w-full min-h-[48px] px-4 py-3 text-left text-sm leading-snug border-2 rounded-xl transition-colors"
            style={{
              borderColor: isSelected ? themeColor : '#e5e7eb',
              backgroundColor: isSelected ? themeColor + '15' : 'white',
              color: isSelected ? themeColor : '#374151',
            }}
            whileTap={{ scale: 0.97 }}
            animate={isSelected ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            <span className="font-medium">
              {c.emoji && <span className="mr-1">{c.emoji}</span>}
              {c.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Desk illustrations that change based on answer mood
function DeskIllustration({
  themeColor,
  questionIndex,
}: {
  themeColor: string;
  questionIndex: number;
}) {
  const configs = [
    {
      title: '과제 3개 도착',
      items: ['📋 과제1', '📋 과제2', '📋 과제3'],
      emoji: '📬',
      subtitle: '어떻게 할까?',
    },
    {
      title: '논문 읽는 중',
      items: ['📄 논문', '🖊️ 형광펜', '📓 노트'],
      emoji: '🔍',
      subtitle: '모르는 용어 발견!',
    },
    {
      title: '마감 D-1',
      items: ['💻 과제', '📅 캘린더', '📱 친구 연락'],
      emoji: '⏰',
      subtitle: '친구가 놀자고 한다',
    },
    {
      title: '제출 직전',
      items: ['📝 최종본', '✅ 체크리스트', '🖱️ 제출 버튼'],
      emoji: '😰',
      subtitle: '과제 제출 버튼 앞에서',
    },
  ];

  const cfg = configs[questionIndex];

  return (
    <div
      className="w-full h-full rounded-3xl flex flex-col items-center justify-center gap-2 px-4"
      style={{ backgroundColor: themeColor + '12' }}
    >
      <span className="text-4xl">{cfg.emoji}</span>
      <p className="text-sm font-bold" style={{ color: themeColor }}>{cfg.title}</p>
      <div className="flex gap-2 flex-wrap justify-center">
        {cfg.items.map((item, i) => (
          <span
            key={i}
            className="text-xs bg-white rounded-lg px-2 py-1 border border-neutral-200 text-neutral-600"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="text-xs text-neutral-400">{cfg.subtitle}</p>
    </div>
  );
}

const Q_DATA = [
  {
    title: '과제 3개가 왔다. 어떻게 할까?',
    choices: [
      { label: '우선순위 표 만들고 시작', value: 5, emoji: '📊' },
      { label: '쉬운 것부터 차근차근', value: 4, emoji: '📋' },
      { label: '일단 뭐부터 할지 고민...', value: 3, emoji: '🤔' },
      { label: '되는 대로 하나씩', value: 2, emoji: '🔀' },
      { label: '일단 유튜브 한 편만...', value: 1, emoji: '📺' },
    ],
  },
  {
    title: '논문 읽다가 모르는 용어 발견',
    choices: [
      { label: '바로 검색하고 노트에 정리', value: 5, emoji: '📝' },
      { label: '형광펜으로 표시해두고 나중에', value: 4, emoji: '🖊️' },
      { label: '문맥으로 대충 파악', value: 3, emoji: '👀' },
      { label: '넘어감', value: 2, emoji: '➡️' },
      { label: '논문 읽기 그만둠', value: 1, emoji: '📕' },
    ],
  },
  {
    title: '마감 내일인데 친구가 놀자고 한다',
    choices: [
      { label: '미안, 과제 끝내야 해!', value: 5, emoji: '🚫' },
      { label: '과제 먼저 하고 늦게 합류할게', value: 4, emoji: '⏱️' },
      { label: '음... 한 시간만...?', value: 3, emoji: '🤔' },
      { label: '조금만 놀다 올게!', value: 2, emoji: '🎮' },
      { label: '과제는 내일 아침에 하지 뭐!', value: 1, emoji: '🎉' },
    ],
  },
  {
    title: '과제 제출 버튼 앞에서',
    choices: [
      { label: '세 번째 검토 중...', value: 5, emoji: '🔍' },
      { label: '마지막으로 한 번 더 읽어보자', value: 4, emoji: '📖' },
      { label: '맞춤법 정도만 확인', value: 3, emoji: '✏️' },
      { label: '됐다, 제출!', value: 2, emoji: '✅' },
      { label: '아 까먹고 있었다 (급히 제출)', value: 1, emoji: '😱' },
    ],
  },
];

export default function DeskScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`desk-${episodeNumber}-${questionIndex}`}
        custom={direction}
        initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col flex-1 px-5 gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: themeColor + '20', color: themeColor }}
          >
            EP.{episodeNumber}
          </span>
          <span className="text-xs text-neutral-400">Q{questionIndex + 1}/4</span>
        </div>

        {/* Desk illustration */}
        <div className="w-full h-36">
          <DeskIllustration themeColor={themeColor} questionIndex={questionIndex} />
        </div>

        {/* Question title */}
        <p className="text-base font-bold text-neutral-800 text-center">{q.title}</p>

        {/* Choices */}
        <ChoiceCards choices={q.choices} themeColor={themeColor} onSelect={onResponse} />
      </motion.div>
    </AnimatePresence>
  );
}
