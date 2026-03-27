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
    text: '발표 준비 중 데이터 해석이 애매한 부분을 발견했다',
    choices: [
      { label: '한계점으로 명시하고 정직하게 발표', score: 5 },
      { label: '주석으로 달아두고 넘어가자', score: 4 },
      { label: '그냥 발표에선 빼자', score: 3 },
      { label: '유리한 쪽으로 해석하자', score: 2 },
      { label: '그 데이터는 없던 걸로...', score: 1 },
    ],
  },
  {
    text: '유명 교수님이 내 포스터에 관심을 보인다',
    choices: [
      { label: '부족한 점도 솔직히 말씀드림', score: 5 },
      { label: '있는 그대로 설명', score: 4 },
      { label: '좋은 부분을 강조해서 설명', score: 3 },
      { label: '약간 과장해서 설명', score: 2 },
      { label: '이 분야 최고인 것처럼 설명', score: 1 },
    ],
  },
  {
    text: '옆 부스 연구자가 해외 학회 경비, 연구비를 자랑한다',
    choices: [
      { label: '좋으시겠다~ (진심으로)', score: 5 },
      { label: '(별 관심 없이) 아 네~', score: 4 },
      { label: '얼마 받으세요...?', score: 3 },
      { label: '(은근 부러움)', score: 2 },
      { label: '저도 사실은... (자랑 시작)', score: 1 },
    ],
  },
  {
    text: '질문자가 "이 분야 전문가시네요"라고 추켜세운다',
    choices: [
      { label: '아직 많이 부족합니다 ㅎㅎ', score: 5 },
      { label: '감사합니다, 아직 공부 중이에요', score: 4 },
      { label: '감사합니다!', score: 3 },
      { label: '네, 좀 했죠 ㅎ', score: 2 },
      { label: '논문 목록 보시면 아실 거예요', score: 1 },
    ],
  },
];

const SCENE_ILLUSTRATIONS = [
  { emoji: '📊', label: '데이터 분석 중', subEmoji: '🔍' },
  { emoji: '👨‍🏫', label: '교수님 방문', subEmoji: '👀' },
  { emoji: '💰', label: '연구비 자랑', subEmoji: '✈️' },
  { emoji: '🎤', label: '질의응답 시간', subEmoji: '⭐' },
];

export default function ConferenceScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const question = QUESTIONS[questionIndex];
  const scene = SCENE_ILLUSTRATIONS[questionIndex];

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
        key={`conf-${episodeNumber}-${questionIndex}`}
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

        {/* Poster Board Scene */}
        <div
          className="relative rounded-2xl p-4 mb-4 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${themeColor}15, ${themeColor}08)`, border: `1.5px solid ${themeColor}30` }}
        >
          {/* Pin board texture */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, ${themeColor} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Poster visual */}
          <div className="relative flex items-center gap-3">
            <div
              className="w-16 h-20 rounded-lg flex flex-col items-center justify-center gap-1 shadow-sm"
              style={{ backgroundColor: themeColor + '25', border: `2px solid ${themeColor}40` }}
            >
              {/* Mini chart lines */}
              <div className="flex items-end gap-0.5 h-8">
                {[40, 70, 55, 85, 65].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-t-sm"
                    style={{ height: `${h}%`, backgroundColor: themeColor + (i === 3 ? 'cc' : '60') }}
                  />
                ))}
              </div>
              <span className="text-[10px]" style={{ color: themeColor }}>POSTER</span>
            </div>
            <div className="flex-1">
              <div className="text-2xl mb-1">{scene.emoji}</div>
              <p className="text-xs font-medium" style={{ color: themeColor }}>{scene.label}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-base">{scene.subEmoji}</span>
                <div className="flex gap-0.5">
                  {['👤', '👤', '👤'].map((p, i) => (
                    <motion.span
                      key={i}
                      className="text-sm"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {p}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
            {/* Speech bubble */}
            <motion.div
              className="absolute -top-1 right-2 bg-white rounded-xl px-2 py-1 shadow-sm"
              style={{ border: `1px solid ${themeColor}30` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 20 }}
            >
              <p className="text-xs text-neutral-600 max-w-[110px] leading-tight">
                {questionIndex === 0 && '음... 이 데이터는?'}
                {questionIndex === 1 && '흥미롭군요!'}
                {questionIndex === 2 && '전 올해 파리 학회에...'}
                {questionIndex === 3 && '전문가시네요!'}
              </p>
              <div
                className="absolute -bottom-1.5 left-3 w-2.5 h-2.5 bg-white rotate-45"
                style={{ border: `1px solid ${themeColor}30`, borderTop: 'none', borderLeft: 'none' }}
              />
            </motion.div>
          </div>
        </div>

        {/* Question */}
        <div
          className="rounded-xl p-3 mb-4"
          style={{ backgroundColor: themeColor + '10', border: `1px solid ${themeColor}25` }}
        >
          <p className="text-sm leading-relaxed text-neutral-800 text-center font-medium">
            {question.text}
          </p>
        </div>

        {/* Choice Cards — post-it pin style */}
        <div className="flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            const isSelected = selectedScore === choice.score;
            return (
              <motion.button
                key={choice.score}
                type="button"
                onClick={() => handleChoice(choice.score)}
                className="relative w-full text-left rounded-xl px-4 py-3 border-2 transition-colors"
                style={{
                  minHeight: 44,
                  borderColor: isSelected ? themeColor : themeColor + '30',
                  backgroundColor: isSelected ? themeColor + '18' : 'white',
                }}
                initial={{ opacity: 0, x: -16 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: isSelected ? 1.03 : 1,
                }}
                transition={{
                  opacity: { delay: i * 0.06 },
                  x: { delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 },
                  scale: { duration: 0.15 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Pin icon */}
                <span
                  className="absolute -top-1.5 left-4 text-xs"
                  style={{ filter: isSelected ? 'none' : 'grayscale(1) opacity(0.4)' }}
                >
                  📌
                </span>
                <span
                  className="text-sm leading-snug block pl-2"
                  style={{ color: isSelected ? themeColor : '#374151' }}
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
