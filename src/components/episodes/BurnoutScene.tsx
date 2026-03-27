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
    text: '혼자 야간 실험을 해야 한다',
    choices: [
      { label: '솔직히... 무섭다', score: 5 },
      { label: '불안하지만 가야지', score: 4 },
      { label: '별 생각 없이 감', score: 3 },
      { label: '괜찮은데?', score: 2 },
      { label: '오히려 조용해서 좋아', score: 1 },
    ],
  },
  {
    text: '내일 중간발표인데 PPT가 안 끝남',
    choices: [
      { label: '잠도 못 잘 것 같아...', score: 5 },
      { label: '꽤 불안하다', score: 4 },
      { label: '약간 걱정되긴 해', score: 3 },
      { label: '어떻게든 되겠지', score: 2 },
      { label: '에이 뭐 별거겠어', score: 1 },
    ],
  },
  {
    text: '논문 리젝 이메일을 받았다',
    choices: [
      { label: '바로 친구한테 전화...', score: 5 },
      { label: 'SNS에 힘들다고 올림', score: 4 },
      { label: '혼자 삭이는 중...', score: 3 },
      { label: '바로 수정 시작', score: 2 },
      { label: '별 감흥 없음, 다음 저널로', score: 1 },
    ],
  },
  {
    text: '같이 입학한 동기가 먼저 졸업한다',
    choices: [
      { label: '눈물이 날 것 같다', score: 5 },
      { label: '뭉클하다...', score: 4 },
      { label: '축하! (근데 좀 쓸쓸)', score: 3 },
      { label: '담담하게 축하', score: 2 },
      { label: '별 감흥 없음', score: 1 },
    ],
  },
];

const SCENE_EMOJIS = ['🔬', '💻', '📧', '🎓'];
const SCENE_LABELS = ['야간 실험실', '발표 전날 밤', '리젝 메일 도착', '동기 졸업 소식'];
const NOTIFICATION_ICONS = ['⚠️', '⏰', '📩', '🔔'];

export default function BurnoutScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const question = QUESTIONS[questionIndex];

  // Brightness shifts: high score (emotional) = darker, low score (calm) = slightly brighter
  const bgOpacity = selectedScore !== null
    ? selectedScore >= 4 ? 0.97 : selectedScore <= 2 ? 0.80 : 0.90
    : 0.90;

  const handleChoice = (score: number) => {
    if (selectedScore !== null) return;
    playClick();
    setSelectedScore(score);
    setTimeout(() => {
      setSelectedScore(null);
      onResponse(score);
    }, 350);
  };

  const accentColor = '#94A3B8';

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`burn-${episodeNumber}-${questionIndex}`}
        custom={direction}
        initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: bgOpacity }}
        exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col flex-1 px-4 bg-slate-900 min-h-0"
        style={{ color: '#e2e8f0' }}
      >
        {/* Vignette overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
            zIndex: 0,
          }}
        />

        {/* Content above vignette */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pt-1">
            <span
              className="text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: accentColor + '25', color: accentColor }}
            >
              EP.{episodeNumber}
            </span>
            <span className="text-xs" style={{ color: '#64748b' }}>Q{questionIndex + 1}/4</span>
          </div>

          {/* Dark lab scene */}
          <div
            className="relative rounded-2xl p-4 mb-4 overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
              border: '1px solid #334155',
            }}
          >
            {/* Monitor glow effect */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(ellipse at 50% 60%, ${accentColor}18 0%, transparent 70%)`,
              }}
            />

            <div className="relative flex items-center gap-3">
              {/* Monitor */}
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-10 rounded-md flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    border: '2px solid #334155',
                    boxShadow: `0 0 12px ${accentColor}30`,
                  }}
                >
                  <span className="text-xl">{SCENE_EMOJIS[questionIndex]}</span>
                </div>
                <div
                  className="w-4 h-1.5 mt-0.5 rounded-b-sm"
                  style={{ backgroundColor: '#334155' }}
                />
                <div
                  className="w-8 h-0.5 rounded"
                  style={{ backgroundColor: '#334155' }}
                />
              </div>

              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: accentColor }}>{SCENE_LABELS[questionIndex]}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🧑‍💻</span>
                  {/* Blinking notification */}
                  <motion.span
                    className="text-sm"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    {NOTIFICATION_ICONS[questionIndex]}
                  </motion.span>
                  <div
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#ef444420', color: '#f87171', border: '1px solid #ef444430' }}
                  >
                    {questionIndex === 0 && '23:47'}
                    {questionIndex === 1 && 'D-1'}
                    {questionIndex === 2 && 'REJECTED'}
                    {questionIndex === 3 && '🎉 졸업'}
                  </div>
                </div>
              </div>

              {/* Star field dots */}
              <div className="absolute right-2 top-1 flex flex-col gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-0.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Question */}
          <div
            className="rounded-xl p-3 mb-4"
            style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          >
            <p className="text-sm leading-relaxed text-center font-medium" style={{ color: '#e2e8f0' }}>
              {question.text}
            </p>
          </div>

          {/* Choice Cards */}
          <div className="flex flex-col gap-2">
            {question.choices.map((choice, i) => {
              const isSelected = selectedScore === choice.score;
              const isEmotional = choice.score >= 4;
              return (
                <motion.button
                  key={choice.score}
                  type="button"
                  onClick={() => handleChoice(choice.score)}
                  className="w-full text-left rounded-xl px-4 py-3 border transition-colors"
                  style={{
                    minHeight: 44,
                    borderColor: isSelected
                      ? accentColor
                      : '#334155',
                    backgroundColor: isSelected
                      ? accentColor + '20'
                      : '#1e293b',
                    boxShadow: isSelected
                      ? `0 0 10px ${accentColor}30`
                      : isEmotional
                      ? `0 0 6px #ef444412`
                      : 'none',
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
                  <span
                    className="text-sm leading-snug block"
                    style={{ color: isSelected ? accentColor : '#cbd5e1' }}
                  >
                    {choice.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
