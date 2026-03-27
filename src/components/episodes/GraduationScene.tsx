'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { playClick } from '@/lib/sound';

interface EpisodeSceneProps {
  episodeNumber: number;
  questionIndex: number;
  themeColor: string;
  sceneContext: string;
  onResponse: (value: number) => void;
  direction: number;
}

const QUESTIONS = [
  {
    text: '주말에 뭐 할까?',
    choices: [
      { label: '미술관 전시 보러 가기!', score: 5 },
      { label: '새로운 카페 탐방', score: 4 },
      { label: '넷플릭스 정주행', score: 3 },
      { label: '단골 카페에서 커피', score: 2 },
      { label: '집에서 뒹굴뒹굴', score: 1 },
    ],
  },
  {
    text: '전혀 다른 분야 세미나 초대가 왔다',
    choices: [
      { label: '꼭 가야지! 너무 궁금해', score: 5 },
      { label: '재밌겠다, 가볼까', score: 4 },
      { label: '시간 되면 가볼게', score: 3 },
      { label: '내 분야가 아닌데...', score: 2 },
      { label: '패스~', score: 1 },
    ],
  },
  {
    text: '졸업 후 뭘 하고 싶어?',
    choices: [
      { label: '예술과 연구를 결합한 새로운 길', score: 5 },
      { label: '스타트업 창업!', score: 4 },
      { label: '대기업 R&D', score: 3 },
      { label: '안정적인 공기업', score: 2 },
      { label: '부모님이 추천하신 곳', score: 1 },
    ],
  },
  {
    text: '"좀 특이하다"는 말을 들으면?',
    choices: [
      { label: '최고의 칭찬! 감사합니다 ✨', score: 5 },
      { label: '은근 뿌듯 ㅎㅎ', score: 4 },
      { label: '그냥 웃고 넘김', score: 3 },
      { label: '약간 신경 쓰이긴 해...', score: 2 },
      { label: '기분 나쁜데...', score: 1 },
    ],
  },
];

const DOORS = [
  { emoji: '🎨', color: '#EC4899', label: '취미의 문' },
  { emoji: '🔭', color: '#F59E0B', label: '호기심의 문' },
  { emoji: '🚀', color: '#8B5CF6', label: '미래의 문' },
  { emoji: '✨', color: '#06B6D4', label: '개성의 문' },
];

// Sparkle positions for final celebration
const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.round((i / 12) * 100),
  y: Math.round(Math.random() * 60 + 10),
  delay: i * 0.08,
  emoji: ['✨', '🌟', '💫', '⭐'][i % 4],
}));

export default function GraduationScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const question = QUESTIONS[questionIndex];
  const door = DOORS[questionIndex];
  const isLastQuestion = questionIndex === 3;

  const handleChoice = (score: number) => {
    if (selectedScore !== null) return;
    playClick();
    setSelectedScore(score);
    setTimeout(() => {
      setSelectedScore(null);
      onResponse(score);
    }, 350);
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`grad-${episodeNumber}-${questionIndex}`}
        custom={direction}
        initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col flex-1 px-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: themeColor + '20', color: themeColor }}
          >
            EP.{episodeNumber}
          </span>
          <span className="text-xs text-neutral-400">Q{questionIndex + 1}/4</span>
        </div>

        {/* Corridor with doors */}
        <div
          className="relative rounded-2xl p-4 mb-4 overflow-hidden"
          style={{
            background: `linear-gradient(160deg, #fdf2f8 0%, #fef3c7 50%, #fdf2f8 100%)`,
            border: `1.5px solid ${themeColor}30`,
          }}
        >
          {/* Sparkle effect on last question */}
          {isLastQuestion && (
            <div className="absolute inset-0 pointer-events-none">
              {SPARKLES.map((s) => (
                <motion.span
                  key={s.id}
                  className="absolute text-xs"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [-4, -12] }}
                  transition={{ duration: 1.2, delay: s.delay, repeat: Infinity, repeatDelay: 1.5 }}
                >
                  {s.emoji}
                </motion.span>
              ))}
            </div>
          )}

          {/* Corridor perspective */}
          <div className="relative flex items-end justify-center gap-2 h-20">
            {/* Previous doors (smaller, in background) */}
            {DOORS.slice(0, questionIndex).map((d, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center justify-end"
                style={{ transform: `scale(${0.55 + i * 0.1})`, opacity: 0.5 + i * 0.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 + i * 0.1 }}
              >
                <div
                  className="w-8 h-12 rounded-t-lg flex items-center justify-center"
                  style={{ backgroundColor: d.color + '30', border: `2px solid ${d.color}50` }}
                >
                  <span className="text-base">{d.emoji}</span>
                </div>
              </motion.div>
            ))}

            {/* Current door — open with animation */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
              style={{ perspective: 400 }}
            >
              <div
                className="w-14 h-20 rounded-t-xl flex flex-col items-center justify-center gap-1 shadow-md"
                style={{
                  background: `linear-gradient(160deg, ${door.color}40, ${door.color}20)`,
                  border: `2.5px solid ${door.color}80`,
                  boxShadow: `0 4px 16px ${door.color}30`,
                }}
              >
                <span className="text-2xl">{door.emoji}</span>
                <span className="text-[9px] font-bold" style={{ color: door.color }}>{door.label}</span>
              </div>
              {/* Door handle */}
              <div
                className="w-1.5 h-1.5 rounded-full mt-0.5"
                style={{ backgroundColor: door.color }}
              />
            </motion.div>
          </div>

          {/* Gradient floor */}
          <div
            className="h-1.5 rounded-full mt-2"
            style={{
              background: `linear-gradient(90deg, ${themeColor}20, #F59E0B40, ${themeColor}20)`,
            }}
          />
        </div>

        {/* Question */}
        <div
          className="rounded-xl p-3 mb-4"
          style={{
            background: `linear-gradient(135deg, ${themeColor}12, #F59E0B0c)`,
            border: `1px solid ${themeColor}25`,
          }}
        >
          <p className="text-sm leading-relaxed text-neutral-800 text-center font-medium">
            {question.text}
          </p>
        </div>

        {/* Choice Cards — emerging from door */}
        <div className="flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            const isSelected = selectedScore === choice.score;
            // Gradient shifts from pink to amber based on score
            const cardAccent = choice.score >= 4 ? themeColor : '#F59E0B';
            return (
              <motion.button
                key={choice.score}
                type="button"
                onClick={() => handleChoice(choice.score)}
                className="w-full text-left rounded-xl px-4 py-3 border-2 transition-colors bg-white"
                style={{
                  minHeight: 44,
                  borderColor: isSelected ? cardAccent : cardAccent + '35',
                  backgroundColor: isSelected ? cardAccent + '15' : 'white',
                }}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isSelected ? 1.03 : 1,
                }}
                transition={{
                  opacity: { delay: 0.15 + i * 0.07 },
                  y: { delay: 0.15 + i * 0.07, type: 'spring', stiffness: 300, damping: 25 },
                  scale: { duration: 0.15 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <span
                  className="text-sm leading-snug block"
                  style={{ color: isSelected ? cardAccent : '#374151' }}
                >
                  {choice.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
