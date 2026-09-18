'use client';

import { useState, useRef, useCallback } from 'react';
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
// Q0 – Drag Seat Map (socialBoldness, reverse=true)
// ---------------------------------------------------------------------------

interface DropZone {
  label: string;
  value: number;
  row: number;
  col: number;
}

const DROP_ZONES: DropZone[] = [
  { label: '맨 앞\n가운데', value: 1, row: 0, col: 2 },
  { label: '앞줄 끝', value: 2, row: 0, col: 0 },
  { label: '중간', value: 3, row: 1, col: 2 },
  { label: '뒷줄 끝', value: 4, row: 2, col: 0 },
  { label: '맨 뒤\n구석', value: 5, row: 2, col: 4 },
];

const GRID_ROWS = 3;
const GRID_COLS = 5;
const SNAP_THRESHOLD = 48;

function isDropZone(row: number, col: number): DropZone | undefined {
  return DROP_ZONES.find((z) => z.row === row && z.col === col);
}

function DragSeatMap({
  themeColor,
  onSelect,
}: {
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number } | null>(null);
  const [snappedZone, setSnappedZone] = useState<DropZone | null>(null);
  const [nearestZone, setNearestZone] = useState<DropZone | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compute the center position of a grid cell relative to container
  const getCellCenter = useCallback((row: number, col: number): { x: number; y: number } => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };

    const gridEl = container.querySelector('[data-grid]') as HTMLElement | null;
    if (!gridEl) return { x: 0, y: 0 };

    const cellEl = gridEl.querySelector(`[data-cell="${row}-${col}"]`) as HTMLElement | null;
    if (!cellEl) return { x: 0, y: 0 };

    const containerRect = container.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();

    return {
      x: cellRect.left + cellRect.width / 2 - containerRect.left,
      y: cellRect.top + cellRect.height / 2 - containerRect.top,
    };
  }, []);

  // Get the avatar's resting position (below grid)
  const getAvatarHome = useCallback((): { x: number; y: number } => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const avatarEl = container.querySelector('[data-avatar-home]') as HTMLElement | null;
    if (!avatarEl) return { x: 0, y: 0 };
    const containerRect = container.getBoundingClientRect();
    const avatarRect = avatarEl.getBoundingClientRect();
    return {
      x: avatarRect.left + avatarRect.width / 2 - containerRect.left,
      y: avatarRect.top + avatarRect.height / 2 - containerRect.top,
    };
  }, []);

  // Find nearest drop zone within threshold
  const findNearestDropZone = useCallback(
    (px: number, py: number): DropZone | null => {
      let best: DropZone | null = null;
      let bestDist = Infinity;

      for (const zone of DROP_ZONES) {
        const center = getCellCenter(zone.row, zone.col);
        const dx = px - center.x;
        const dy = py - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist && dist < SNAP_THRESHOLD) {
          bestDist = dist;
          best = zone;
        }
      }
      return best;
    },
    [getCellCenter],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (submitted || snappedZone) return;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

      const container = containerRef.current;
      if (!container) return;

      const home = getAvatarHome();
      startPosRef.current = home;
      pointerOriginRef.current = { x: e.clientX, y: e.clientY };
      setAvatarPos(home);
      setDragging(true);
    },
    [submitted, snappedZone, getAvatarHome],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || submitted) return;

      const dx = e.clientX - pointerOriginRef.current.x;
      const dy = e.clientY - pointerOriginRef.current.y;
      const newPos = {
        x: startPosRef.current.x + dx,
        y: startPosRef.current.y + dy,
      };
      setAvatarPos(newPos);

      const nearest = findNearestDropZone(newPos.x, newPos.y);
      setNearestZone(nearest);
    },
    [dragging, submitted, findNearestDropZone],
  );

  const onPointerUp = useCallback(() => {
    if (!dragging || submitted) return;
    setDragging(false);

    if (!avatarPos) return;

    const nearest = findNearestDropZone(avatarPos.x, avatarPos.y);
    if (nearest) {
      // Snap to the drop zone
      const center = getCellCenter(nearest.row, nearest.col);
      setAvatarPos(center);
      setSnappedZone(nearest);
      setNearestZone(null);
      playClick();

      // Auto-submit after feedback animation
      setTimeout(() => {
        setSubmitted(true);
        onSelect(nearest.value);
      }, 300);
    } else {
      // Return to home
      const home = getAvatarHome();
      setAvatarPos(home);
      setNearestZone(null);
    }
  }, [dragging, submitted, avatarPos, findNearestDropZone, getCellCenter, getAvatarHome, onSelect]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full touch-none select-none flex-col gap-2"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Board */}
      <div
        className="mb-1 flex h-8 w-full items-center justify-center rounded-lg text-sm font-bold text-white"
        style={{ backgroundColor: themeColor }}
      >
        📋 칠판
      </div>

      {/* Seat Grid */}
      <div data-grid className="flex flex-col items-center gap-2">
        {Array.from({ length: GRID_ROWS }, (_, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-2">
            {Array.from({ length: GRID_COLS }, (_, cIdx) => {
              const zone = isDropZone(rIdx, cIdx);
              const isNear = nearestZone?.row === rIdx && nearestZone?.col === cIdx;
              const isSnapped = snappedZone?.row === rIdx && snappedZone?.col === cIdx;

              if (!zone) {
                // Decorative seat
                return (
                  <div
                    key={cIdx}
                    data-cell={`${rIdx}-${cIdx}`}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 text-lg text-neutral-300"
                  >
                    🪑
                  </div>
                );
              }

              // Drop zone seat
              return (
                <motion.div
                  key={cIdx}
                  data-cell={`${rIdx}-${cIdx}`}
                  className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 text-center leading-tight"
                  style={{
                    borderColor: isSnapped
                      ? themeColor
                      : isNear
                        ? `${themeColor}90`
                        : '#e5e7eb',
                    backgroundColor: isSnapped
                      ? `${themeColor}20`
                      : isNear
                        ? `${themeColor}10`
                        : 'white',
                  }}
                  animate={
                    isSnapped
                      ? { scale: [1, 1.1, 1] }
                      : isNear
                        ? { scale: [1, 1.05, 1] }
                        : { scale: 1 }
                  }
                  transition={
                    isNear
                      ? { type: 'tween', duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                      : { type: 'tween', duration: 0.25 }
                  }
                >
                  <span className="text-xl">🪑</span>
                  <span
                    className="whitespace-pre-line text-sm font-medium leading-tight"
                    style={{
                      color: isSnapped || isNear ? themeColor : '#6b7280',
                    }}
                  >
                    {zone.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Avatar home marker (invisible, used for positioning) */}
      <div className="flex justify-center pt-3" data-avatar-home>
        {/* Placeholder for home position measurement */}
        <div className="h-12 w-12" />
      </div>

      {/* Draggable Avatar */}
      {!snappedZone && !submitted && !avatarPos && (
        <motion.div
          className="absolute bottom-0 left-1/2 flex h-12 w-12 -translate-x-1/2 cursor-grab items-center justify-center rounded-full text-2xl shadow-lg active:cursor-grabbing"
          style={{
            backgroundColor: `${themeColor}20`,
            border: `2px solid ${themeColor}`,
          }}
          data-avatar-home
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧑
        </motion.div>
      )}

      {avatarPos && (
        <motion.div
          className="pointer-events-none absolute z-20 flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-xl"
          style={{
            backgroundColor: `${themeColor}30`,
            border: `2px solid ${themeColor}`,
            left: avatarPos.x - 24,
            top: avatarPos.y - 24,
          }}
          animate={
            snappedZone
              ? { scale: [1, 1.2, 1], boxShadow: `0 0 20px ${themeColor}60` }
              : dragging
                ? { scale: 1.1 }
                : { scale: 1 }
          }
          transition={
            snappedZone
              ? { type: 'tween', duration: 0.3 }
              : { type: 'spring', stiffness: 300, damping: 25 }
          }
        >
          🧑
        </motion.div>
      )}

      {/* Instruction */}
      <p className="mt-1 text-center text-base text-neutral-400">
        {snappedZone ? '자리 선택 완료!' : '🧑 아바타를 끌어서 자리에 앉히세요'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Q2 – Party Scene for MoodSlider renderScene
// ---------------------------------------------------------------------------

function PartyScene({ activeIndex }: { activeIndex: number | null }) {
  const brightness =
    activeIndex === null || activeIndex <= 1
      ? 'dim'
      : activeIndex === 2
        ? 'neutral'
        : 'bright';

  return (
    <div
      className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500"
      style={{
        background:
          brightness === 'bright'
            ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FBBF24 100%)'
            : brightness === 'neutral'
              ? 'linear-gradient(135deg, #FEF9C3 0%, #FDE68A 100%)'
              : 'linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%)',
      }}
    >
      {/* Party elements */}
      <div className="flex items-end gap-3 text-3xl">
        <motion.span
          animate={{
            opacity: brightness === 'dim' ? 0.3 : brightness === 'neutral' ? 0.6 : 1,
            scale: brightness === 'bright' ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: brightness === 'bright' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          🎵
        </motion.span>

        <motion.span
          className="text-4xl"
          animate={{
            opacity: brightness === 'dim' ? 0.4 : 1,
            y: brightness === 'bright' ? [0, -8, 0] : 0,
          }}
          transition={{
            duration: 0.6,
            repeat: brightness === 'bright' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          🥳
        </motion.span>

        <motion.span
          animate={{
            opacity: brightness === 'dim' ? 0.3 : brightness === 'neutral' ? 0.6 : 1,
            rotate: brightness === 'bright' ? [0, 15, -15, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: brightness === 'bright' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          🎶
        </motion.span>
      </div>

      {/* Confetti - only on bright */}
      {brightness === 'bright' && (
        <>
          {['🎊', '✨', '🎉', '⭐', '🎈'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-xl"
              style={{
                left: `${15 + i * 17}%`,
                top: `${10 + (i % 3) * 20}%`,
              }}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 0.8],
                scale: [0, 1.2, 1],
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </>
      )}

      {/* Dim overlay text */}
      {brightness === 'dim' && (
        <motion.p
          className="absolute bottom-3 text-xs text-stone-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ...조용한 분위기
        </motion.p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question data
// ---------------------------------------------------------------------------

interface QItem {
  title: string;
  description?: string;
  type: 'seatmap' | 'choices' | 'slider';
  variant?: 'default' | 'speech' | 'message';
  choices?: SceneChoice[];
  sliderPoints?: SliderPoint[];
}

const Q_DATA: QItem[] = [
  {
    // Q0 – socialBoldness (reverse=true) → drag seatmap
    title: '어디에 앉을까?',
    type: 'seatmap',
  },
  {
    // Q1 – sociability (reverse=false) → speech variant
    title: '뒤풀이 갈래?',
    type: 'choices',
    variant: 'speech',
    choices: [
      { label: '내가 장소 알아볼게!', value: 5, emoji: '📍' },
      { label: '당연히 가야지!', value: 4, emoji: '🙌' },
      { label: '음... 잠깐만 있다 갈게', value: 3, emoji: '🤔' },
      { label: '오늘은 좀 피곤한데...', value: 2, emoji: '😴' },
      { label: '나 먼저 갈게, 수고!', value: 1, emoji: '👋' },
    ],
  },
  {
    // Q2 – liveliness (reverse=false) → MoodSlider
    title: '오늘 OT 어땠어?',
    type: 'slider',
    sliderPoints: [
      { value: 1, emoji: '😑', label: '힘들었어' },
      { value: 2, emoji: '😐', label: '별로' },
      { value: 3, emoji: '🙂', label: '그저 그래' },
      { value: 4, emoji: '😊', label: '좋았어' },
      { value: 5, emoji: '🤩', label: '최고!' },
    ],
  },
  {
    // Q3 – socialSelfEsteem (reverse=false) → default variant
    title: '오늘 나, 어땠을까?',
    description: '집에 돌아와서 오늘을 되돌아본다',
    type: 'choices',
    variant: 'default',
    choices: [
      { label: '오늘 꽤 괜찮았어, 나!', value: 5, emoji: '😎' },
      { label: '나름 잘한 것 같아', value: 4, emoji: '😊' },
      { label: '뭐 보통이었지', value: 3, emoji: '🙂' },
      { label: '좀 어색했나...', value: 2, emoji: '😅' },
      { label: '아 오늘 왜 그랬지...', value: 1, emoji: '😣' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function OTScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];

  const renderPartyScene = useCallback(
    (activeIndex: number | null) => <PartyScene activeIndex={activeIndex} />,
    [],
  );

  return (
    <EpisodeSceneShell
      sceneKey={`ot-${episodeNumber}-${questionIndex}`}
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

      {q.type === 'seatmap' && (
        <DragSeatMap themeColor={themeColor} onSelect={onResponse} />
      )}

      {q.type === 'choices' && q.choices && (
        <ChoiceList
          choices={q.choices}
          themeColor={themeColor}
          onSelect={onResponse}
          variant={q.variant}
        />
      )}

      {q.type === 'slider' && q.sliderPoints && (
        <MoodSlider
          points={q.sliderPoints}
          onSelect={onResponse}
          themeColor={themeColor}
          renderScene={renderPartyScene}
        />
      )}
    </EpisodeSceneShell>
  );
}
