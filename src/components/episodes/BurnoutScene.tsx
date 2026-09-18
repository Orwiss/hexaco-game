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

/* ------------------------------------------------------------------ */
/*  Q0 – MoodSlider scene: Dark campus night illustration             */
/* ------------------------------------------------------------------ */

function CampusNightScene({ activeIndex }: { activeIndex: number | null }) {
  const idx = activeIndex ?? 0;
  const isCalm = idx <= 1;
  const isNeutral = idx === 2;
  const isScary = idx >= 3;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: isScary
          ? 'linear-gradient(180deg, #020617 0%, #0f172a 100%)'
          : isNeutral
            ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(180deg, #0f172a 0%, #1e293b 80%, #334155 100%)',
        border: '1px solid #334155',
        height: 160,
      }}
    >
      {/* Stars */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-slate-300"
          style={{
            width: i % 3 === 0 ? 2 : 1.5,
            height: i % 3 === 0 ? 2 : 1.5,
            left: `${8 + i * 12}%`,
            top: `${8 + ((i * 7) % 25)}%`,
          }}
          animate={{
            opacity: isScary ? [0.1, 0.3, 0.1] : [0.3, 0.9, 0.3],
            scale: isScary ? [0.8, 1, 0.8] : [1, 1.2, 1],
          }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Moon */}
      <motion.div
        className="absolute right-6 top-4 text-2xl"
        animate={{
          opacity: isScary ? 0.3 : 1,
          scale: isScary ? 0.8 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        🌙
      </motion.div>

      {/* Ground / buildings silhouette */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-4 pb-3">
        {/* Building 1 */}
        <motion.div
          className="rounded-t-sm"
          style={{
            width: 36,
            height: 50,
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
          }}
          animate={{ opacity: isScary ? 0.6 : 1 }}
        >
          {/* Windows */}
          <div className="flex flex-wrap justify-center gap-1 px-1 pt-2">
            {[0, 1, 2, 3].map((w) => (
              <motion.div
                key={w}
                className="rounded-sm"
                style={{ width: 6, height: 6 }}
                animate={{
                  backgroundColor: isCalm ? '#fbbf24' : isNeutral ? '#64748b' : '#334155',
                  opacity: isScary ? 0.3 : isCalm ? [0.7, 1, 0.7] : 0.5,
                }}
                transition={{ duration: 2, repeat: Infinity, delay: w * 0.5 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Lab building */}
        <motion.div
          className="rounded-t-sm"
          style={{
            width: 48,
            height: 64,
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
          }}
          animate={{ opacity: isScary ? 0.5 : 1 }}
        >
          <div className="flex flex-wrap justify-center gap-1 px-1.5 pt-2">
            {[0, 1, 2, 3, 4, 5].map((w) => (
              <motion.div
                key={w}
                className="rounded-sm"
                style={{ width: 6, height: 6 }}
                animate={{
                  backgroundColor: isCalm ? '#fbbf24' : isNeutral ? '#475569' : '#1e293b',
                  opacity: isScary ? 0.15 : isCalm ? [0.6, 1, 0.6] : 0.4,
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: w * 0.3 }}
              />
            ))}
          </div>
          <div className="mt-1 text-center text-lg">🔬</div>
        </motion.div>

        {/* Building 3 */}
        <motion.div
          className="rounded-t-sm"
          style={{
            width: 32,
            height: 40,
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
          }}
          animate={{ opacity: isScary ? 0.5 : 1 }}
        >
          <div className="flex flex-wrap justify-center gap-1 px-1 pt-2">
            {[0, 1].map((w) => (
              <motion.div
                key={w}
                className="rounded-sm"
                style={{ width: 6, height: 6 }}
                animate={{
                  backgroundColor: isCalm ? '#fbbf24' : '#334155',
                  opacity: isScary ? 0.1 : isCalm ? [0.5, 0.9, 0.5] : 0.3,
                }}
                transition={{ duration: 3, repeat: Infinity, delay: w * 0.7 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dark overlay for scary mood */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'radial-gradient(circle at 50% 50%, transparent 30%, #020617 100%)' }}
        animate={{ opacity: isScary ? 0.7 : isNeutral ? 0.3 : 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Walking figure */}
      <motion.div
        className="absolute bottom-3 text-lg"
        animate={{
          left: isCalm ? '55%' : isNeutral ? '45%' : '35%',
          opacity: isScary ? 0.6 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        🚶
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q2 – RejectionEmailPicker: email with tappable action icons       */
/* ------------------------------------------------------------------ */

function RejectionEmailPicker({
  choices,
  onSelect,
}: {
  choices: SceneChoice[];
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const accent = '#94A3B8';

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 300);
  }

  // Position icons around the email card
  const iconPositions = [
    { top: '-8px', left: '4%' },
    { top: '-8px', left: '28%' },
    { top: '-8px', right: '28%' },
    { top: '-8px', right: '4%' },
    { bottom: '-8px', left: '50%', transform: 'translateX(-50%)' },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[340px] pb-10 pt-10">
      {/* Email card */}
      <div
        className="relative rounded-xl px-5 py-5"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Email header */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs"
            style={{ backgroundColor: '#334155' }}
          >
            📧
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">학술지 편집부</p>
            <p className="text-sm text-slate-500">journal@academic.org</p>
          </div>
        </div>

        {/* Subject line */}
        <div
          className="mb-2 rounded-lg px-3 py-2"
          style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
        >
          <p className="text-sm font-bold text-red-400">❌ 논문 리젝 통보</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            검토 결과, 귀하의 논문은 게재가 불가합니다...
          </p>
        </div>

        {/* Reject stamp */}
        <div className="flex justify-end">
          <span
            className="rounded-md px-2 py-0.5 text-sm font-bold tracking-wider"
            style={{
              color: '#ef4444',
              border: '1.5px solid #ef4444',
              opacity: 0.7,
              transform: 'rotate(-6deg)',
            }}
          >
            REJECTED
          </span>
        </div>
      </div>

      {/* Action icons floating over/around the email */}
      {choices.map((c, i) => {
        const isSelected = selected === c.value;
        const pos = iconPositions[i] ?? {};
        return (
          <motion.button
            key={c.value}
            type="button"
            onClick={() => handleTap(c.value)}
            className="absolute flex flex-col items-center gap-1"
            style={{
              ...pos,
              ...(i < 4 ? { bottom: '-36px' } : { bottom: '-40px' }),
              zIndex: 10,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: isSelected ? 1.2 : 1,
            }}
            transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.92 }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: isSelected ? `${accent}30` : '#1e293b',
                border: isSelected ? `2.5px solid ${accent}` : '2px solid #334155',
                boxShadow: isSelected
                  ? `0 0 16px ${accent}50, 0 0 4px ${accent}30`
                  : '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-2xl">{c.emoji}</span>
            </div>
            <span
              className="whitespace-nowrap text-sm font-medium"
              style={{ color: isSelected ? accent : '#94a3b8' }}
            >
              {c.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q3 – MoodSlider scene: Graduation ceremony illustration           */
/* ------------------------------------------------------------------ */

function GraduationScene({ activeIndex }: { activeIndex: number | null }) {
  const idx = activeIndex ?? 0;
  const isMild = idx === 2;
  const isEmotional = idx >= 3;

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl"
      style={{
        background: isEmotional
          ? 'linear-gradient(180deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid #334155',
        height: 150,
      }}
    >
      {/* Warm glow for emotional states */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 60%, #fbbf2420 0%, transparent 70%)',
        }}
        animate={{ opacity: isMild ? 0.5 : isEmotional ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Sparkles for emotional states */}
      {isEmotional &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute text-xs"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + ((i * 11) % 30)}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -8, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          >
            ✨
          </motion.div>
        ))}

      {/* Graduation cap */}
      <motion.div
        animate={{
          scale: isEmotional ? 1.3 : isMild ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="text-4xl">🎓</span>
      </motion.div>

      {/* Label */}
      <motion.p
        className="mt-2 text-sm font-medium"
        animate={{
          color: isEmotional ? '#fbbf24' : isMild ? '#94a3b8' : '#64748b',
        }}
        transition={{ duration: 0.4 }}
      >
        {isEmotional ? '축하해... 정말 잘했어' : isMild ? '축하한다, 동기야' : '졸업식'}
      </motion.p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Question definitions                                              */
/* ------------------------------------------------------------------ */

const Q0_SLIDER_POINTS: SliderPoint[] = [
  { value: 1, emoji: '😎', label: '괜찮은데' },
  { value: 2, emoji: '🚶', label: '별 생각 없이' },
  { value: 3, emoji: '😰', label: '좀 불안' },
  { value: 4, emoji: '😨', label: '무서워' },
  { value: 5, emoji: '😱', label: '너무 무서워' },
];

const Q1_CHOICES: SceneChoice[] = [
  { label: '잠도 못 잘 것 같아...', value: 5, emoji: '😵' },
  { label: '꽤 불안하다', value: 4, emoji: '😰' },
  { label: '약간 걱정되긴 해', value: 3, emoji: '🤔' },
  { label: '어떻게든 되겠지', value: 2, emoji: '🙂' },
  { label: '에이 뭐 별거겠어', value: 1, emoji: '😎' },
];

const Q2_CHOICES: SceneChoice[] = [
  { emoji: '📞', label: '전화', value: 1 },
  { emoji: '📱', label: 'SNS', value: 2 },
  { emoji: '😶', label: '혼자', value: 3 },
  { emoji: '💻', label: '수정', value: 4 },
  { emoji: '🗑️', label: '다음저널', value: 5 },
];

const Q3_SLIDER_POINTS: SliderPoint[] = [
  { value: 1, emoji: '😐', label: '별 감흥 없음' },
  { value: 2, emoji: '🙂', label: '담담' },
  { value: 3, emoji: '😊', label: '축하' },
  { value: 4, emoji: '🥹', label: '뭉클' },
  { value: 5, emoji: '😢', label: '눈물날 것 같다' },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function BurnoutScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const sceneKey = `burnout-${episodeNumber}-${questionIndex}`;

  return (
    <EpisodeSceneShell
      sceneKey={sceneKey}
      direction={direction}
      episodeNumber={episodeNumber}
      questionIndex={questionIndex}
      themeColor={themeColor}
      dark
    >
      {questionIndex === 0 && (
        <>
          <ScenePrompt
            title="혼자 야간 실험을 해야 한다"
            description="어두운 캠퍼스를 걸어간다. 얼마나 무섭나요?"
            themeColor={themeColor}
            dark
          />
          <MoodSlider
            points={Q0_SLIDER_POINTS}
            onSelect={onResponse}
            themeColor={themeColor}
            dark
            renderScene={(activeIndex) => <CampusNightScene activeIndex={activeIndex} />}
          />
        </>
      )}

      {questionIndex === 1 && (
        <>
          <ScenePrompt
            title="내일 중간발표인데 PPT가 안 끝남"
            description="지금 기분이 어때?"
            themeColor={themeColor}
            dark
          />
          <ChoiceList choices={Q1_CHOICES} themeColor={themeColor} onSelect={onResponse} dark />
        </>
      )}

      {questionIndex === 2 && (
        <>
          <ScenePrompt
            title="논문 리젝 이메일을 받았다"
            description="어떻게 하겠어?"
            themeColor={themeColor}
            dark
          />
          <RejectionEmailPicker choices={Q2_CHOICES} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 3 && (
        <>
          <ScenePrompt
            title="같이 입학한 동기가 먼저 졸업한다"
            description="어떤 감정이 드나요?"
            themeColor={themeColor}
            dark
          />
          <MoodSlider
            points={Q3_SLIDER_POINTS}
            onSelect={onResponse}
            themeColor={themeColor}
            dark
            renderScene={(activeIndex) => <GraduationScene activeIndex={activeIndex} />}
          />
        </>
      )}
    </EpisodeSceneShell>
  );
}
