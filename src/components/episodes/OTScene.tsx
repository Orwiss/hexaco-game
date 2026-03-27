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

// Q0: Classroom seat positions
function SeatMap({ themeColor, onSelect }: { themeColor: string; onSelect: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  const seats = [
    { label: '맨 앞\n가운데', value: 5, row: 0, col: 2 },
    { label: '앞줄 끝', value: 4, row: 0, col: 0 },
    { label: '중간', value: 3, row: 1, col: 2 },
    { label: '뒷줄 끝', value: 2, row: 2, col: 0 },
    { label: '맨 뒤\n구석', value: 1, row: 2, col: 4 },
  ];

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 300);
  }

  // Grid: 3 rows × 5 cols
  const grid: (typeof seats[0] | null)[][] = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];
  seats.forEach(s => { grid[s.row][s.col] = s; });

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Board */}
      <div
        className="w-full h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white mb-1"
        style={{ backgroundColor: themeColor }}
      >
        📋 칠판
      </div>
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-2 justify-center">
          {row.map((seat, cIdx) => {
            if (!seat) {
              return (
                <div
                  key={cIdx}
                  className="w-14 h-14 rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center text-neutral-300 text-lg"
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
                className="w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center text-center leading-tight"
                style={{
                  borderColor: isSelected ? themeColor : '#e5e7eb',
                  backgroundColor: isSelected ? themeColor + '20' : 'white',
                }}
                whileTap={{ scale: 0.93 }}
                animate={isSelected ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                <span className="text-lg">🪑</span>
                <span
                  className="text-[9px] font-medium whitespace-pre-line leading-tight"
                  style={{ color: isSelected ? themeColor : '#6b7280' }}
                >
                  {seat.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      ))}
      <p className="text-[11px] text-neutral-400 text-center mt-1">자리를 탭해서 선택하세요</p>
    </div>
  );
}

// Q1–Q3: Choice cards
interface ChoiceCard {
  label: string;
  value: number;
  emoji?: string;
}

function ChoiceCards({
  choices,
  themeColor,
  onSelect,
  style = 'default',
}: {
  choices: ChoiceCard[];
  themeColor: string;
  onSelect: (v: number) => void;
  style?: 'speech' | 'chat' | 'default';
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
        const isSpeech = style === 'speech';
        const isChat = style === 'chat';

        return (
          <motion.button
            key={c.value}
            type="button"
            onClick={() => handleTap(c.value)}
            className={[
              'w-full min-h-[48px] px-4 py-3 text-left text-sm leading-snug border-2 transition-colors',
              isSpeech ? 'rounded-2xl rounded-tl-sm' : isChat ? 'rounded-2xl rounded-br-sm' : 'rounded-xl',
            ].join(' ')}
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

// Scene illustrations
function ClassroomIllustration({ themeColor }: { themeColor: string }) {
  return (
    <div
      className="w-full h-full rounded-3xl flex flex-col items-center justify-center gap-3"
      style={{ backgroundColor: themeColor + '12' }}
    >
      <div className="flex gap-4 text-4xl">
        <span>🎓</span><span>📚</span><span>✏️</span>
      </div>
      <p className="text-sm font-bold" style={{ color: themeColor }}>첫 수업 날</p>
      <p className="text-xs text-neutral-400">강의실에 들어섰다...</p>
    </div>
  );
}

function IntroIllustration({ themeColor }: { themeColor: string }) {
  return (
    <div
      className="w-full h-full rounded-3xl flex flex-col items-center justify-center gap-3"
      style={{ backgroundColor: themeColor + '12' }}
    >
      <div className="flex gap-2 text-3xl">
        <span>🙋</span><span>💬</span><span>👋</span>
      </div>
      <p className="text-sm font-bold" style={{ color: themeColor }}>자기소개 시간!</p>
      <p className="text-xs text-neutral-400">교수님: &ldquo;한 명씩 소개해볼까요?&rdquo;</p>
    </div>
  );
}

function AfterPartyIllustration({ themeColor }: { themeColor: string }) {
  return (
    <div
      className="w-full h-full rounded-3xl flex flex-col items-center justify-center gap-3"
      style={{ backgroundColor: themeColor + '12' }}
    >
      <div className="flex gap-2 text-3xl">
        <span>🍺</span><span>🎉</span><span>🌃</span>
      </div>
      <p className="text-sm font-bold" style={{ color: themeColor }}>뒤풀이 갈래?</p>
      <p className="text-xs text-neutral-400">동기들이 삼삼오오 모이고 있다</p>
    </div>
  );
}

function ChatIllustration({ themeColor }: { themeColor: string }) {
  return (
    <div
      className="w-full h-full rounded-3xl flex flex-col items-center justify-center gap-3 px-6"
      style={{ backgroundColor: themeColor + '12' }}
    >
      <div className="flex items-center gap-2 w-full">
        <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-xl flex-shrink-0">
          😊
        </div>
        <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-neutral-100 flex-1">
          <p className="text-xs text-neutral-700">&ldquo;안녕하세요! 저도 이 수업 처음이에요~&rdquo;</p>
        </div>
      </div>
      <p className="text-xs text-neutral-400">옆자리 동기가 말을 건다</p>
    </div>
  );
}

const Q_DATA = [
  {
    title: '어디에 앉을까?',
    type: 'seatmap' as const,
  },
  {
    title: '자기소개 시간!',
    type: 'choices' as const,
    style: 'speech' as const,
    choices: [
      { label: '안녕하세요! 제 취미는요... (TMI 시작)', value: 5, emoji: '🗣️' },
      { label: '반갑습니다! 잘 부탁드려요 😊', value: 4, emoji: '😊' },
      { label: '안녕하세요, OO입니다', value: 3, emoji: '🙂' },
      { label: '...안녕하세요', value: 2, emoji: '😶' },
      { label: '(패스하고 싶다...)', value: 1, emoji: '😬' },
    ],
  },
  {
    title: '뒤풀이 갈래?',
    type: 'choices' as const,
    style: 'default' as const,
    choices: [
      { label: '내가 장소 알아볼게!', value: 5, emoji: '📍' },
      { label: '당연히 가야지!', value: 4, emoji: '🙌' },
      { label: '음... 잠깐만 있다 갈게', value: 3, emoji: '🤔' },
      { label: '오늘은 좀 피곤한데...', value: 2, emoji: '😴' },
      { label: '나 먼저 갈게, 수고!', value: 1, emoji: '👋' },
    ],
  },
  {
    title: '옆자리 동기가 말을 건다',
    type: 'choices' as const,
    style: 'chat' as const,
    choices: [
      { label: '오 반가워요! 전공이 뭐예요?', value: 5, emoji: '😄' },
      { label: '안녕하세요~ 네네 ㅎㅎ', value: 4, emoji: '😊' },
      { label: '아 네, 안녕하세요', value: 3, emoji: '🙂' },
      { label: '(짧게 고개만 끄덕)', value: 2, emoji: '😐' },
      { label: '(이어폰 빼야 하나...)', value: 1, emoji: '🎧' },
    ],
  },
];

const ILLUSTRATIONS = [
  ClassroomIllustration,
  IntroIllustration,
  AfterPartyIllustration,
  ChatIllustration,
];

export default function OTScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];
  const Illustration = ILLUSTRATIONS[questionIndex];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`ot-${episodeNumber}-${questionIndex}`}
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

        {/* Scene illustration */}
        <div className="w-full h-36">
          <Illustration themeColor={themeColor} />
        </div>

        {/* Question title */}
        <p className="text-base font-bold text-neutral-800 text-center">{q.title}</p>

        {/* Choices */}
        {q.type === 'seatmap' ? (
          <SeatMap themeColor={themeColor} onSelect={onResponse} />
        ) : (
          <ChoiceCards
            choices={q.choices}
            themeColor={themeColor}
            onSelect={onResponse}
            style={q.style}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
