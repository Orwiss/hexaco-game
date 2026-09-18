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

/* ------------------------------------------------------------------ */
/*  Q0 – DragPinMap: drag 📍 pin to a weekend activity on a map       */
/*  (o1 미적 감상, reverse=YES)                                        */
/* ------------------------------------------------------------------ */

interface MapZone {
  x: number; // percentage
  y: number; // percentage
  value: number;
  emoji: string;
  label: string;
  terrain: string; // gradient color for zone background
}

const MAP_ZONES: MapZone[] = [
  { x: 15, y: 22, value: 1, emoji: '🎨', label: '미술관', terrain: '#EC489925' },
  { x: 72, y: 18, value: 2, emoji: '☕', label: '카페탐방', terrain: '#F59E0B25' },
  { x: 50, y: 50, value: 3, emoji: '📺', label: '넷플릭스', terrain: '#3B82F625' },
  { x: 20, y: 75, value: 4, emoji: '🏠', label: '단골카페', terrain: '#10B98125' },
  { x: 78, y: 78, value: 5, emoji: '🛋️', label: '집', terrain: '#8B5CF625' },
];

const PIN_SNAP_THRESHOLD = 40; // px

function DragPinMap({
  themeColor,
  onSelect,
}: {
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinPos, setPinPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [nearZone, setNearZone] = useState<MapZone | null>(null);
  const [snappedZone, setSnappedZone] = useState<MapZone | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const pointerOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pin home: bottom center of the map container
  const getPinHome = useCallback((): { x: number; y: number } => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return { x: rect.width / 2, y: rect.height - 20 };
  }, []);

  // Get zone center in px relative to container
  const getZoneCenter = useCallback((zone: MapZone): { x: number; y: number } => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return { x: (zone.x / 100) * rect.width, y: (zone.y / 100) * rect.height };
  }, []);

  const findNearestZone = useCallback(
    (px: number, py: number): MapZone | null => {
      let best: MapZone | null = null;
      let bestDist = Infinity;
      for (const zone of MAP_ZONES) {
        const center = getZoneCenter(zone);
        const dx = px - center.x;
        const dy = py - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist && dist < PIN_SNAP_THRESHOLD) {
          bestDist = dist;
          best = zone;
        }
      }
      return best;
    },
    [getZoneCenter],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (submitted || snappedZone) return;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

      const home = getPinHome();
      startPosRef.current = home;
      pointerOriginRef.current = { x: e.clientX, y: e.clientY };
      setPinPos(home);
      setDragging(true);
    },
    [submitted, snappedZone, getPinHome],
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
      setPinPos(newPos);
      setNearZone(findNearestZone(newPos.x, newPos.y));
    },
    [dragging, submitted, findNearestZone],
  );

  const onPointerUp = useCallback(() => {
    if (!dragging || submitted) return;
    setDragging(false);

    if (!pinPos) return;

    const nearest = findNearestZone(pinPos.x, pinPos.y);
    if (nearest) {
      const center = getZoneCenter(nearest);
      setPinPos(center);
      setSnappedZone(nearest);
      setNearZone(null);
      playClick();
      setTimeout(() => {
        setSubmitted(true);
        onSelect(nearest.value);
      }, 300);
    } else {
      // Return pin to home
      const home = getPinHome();
      setPinPos(home);
      setNearZone(null);
    }
  }, [dragging, submitted, pinPos, findNearestZone, getZoneCenter, getPinHome, onSelect]);

  return (
    <div
      ref={containerRef}
      className="relative w-full touch-none select-none overflow-hidden rounded-2xl"
      style={{
        height: 280,
        background: 'linear-gradient(160deg, #FDF2F8 0%, #FCE7F3 30%, #F5F3FF 60%, #EFF6FF 100%)',
        border: '1px solid #F9A8D420',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Subtle terrain patches */}
      <div
        className="absolute left-[5%] top-[10%] h-24 w-28 rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle, #FBCFE850, transparent 70%)' }}
      />
      <div
        className="absolute right-[8%] top-[5%] h-20 w-24 rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, #FDE68A40, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[15%] left-[10%] h-20 w-20 rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, #A7F3D040, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[10%] right-[5%] h-24 w-24 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #C4B5FD40, transparent 70%)' }}
      />
      <div
        className="absolute left-[35%] top-[35%] h-28 w-28 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #BFDBFE50, transparent 70%)' }}
      />

      {/* Map zones */}
      {MAP_ZONES.map((zone) => {
        const isNear = nearZone?.value === zone.value;
        const isSnapped = snappedZone?.value === zone.value;

        return (
          <motion.div
            key={zone.value}
            className="absolute flex flex-col items-center gap-0.5"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={
              isNear
                ? { scale: [1, 1.12, 1] }
                : isSnapped
                  ? { scale: 1.1 }
                  : { scale: 1 }
            }
            transition={
              isNear
                ? { type: 'tween', duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                : { type: 'tween', duration: 0.3 }
            }
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-sm"
              style={{
                backgroundColor: isSnapped
                  ? `${themeColor}30`
                  : isNear
                    ? `${themeColor}18`
                    : zone.terrain,
                border: isSnapped
                  ? `2.5px solid ${themeColor}`
                  : isNear
                    ? `2px solid ${themeColor}80`
                    : '2px solid rgba(255,255,255,0.7)',
                boxShadow: isSnapped
                  ? `0 0 16px ${themeColor}40`
                  : isNear
                    ? `0 0 12px ${themeColor}25`
                    : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {zone.emoji}
            </div>
            <span
              className="text-sm font-bold"
              style={{
                color: isSnapped || isNear ? themeColor : '#6b7280',
              }}
            >
              {zone.label}
            </span>
          </motion.div>
        );
      })}

      {/* Draggable Pin – resting state */}
      {!snappedZone && !submitted && !pinPos && (
        <motion.div
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 cursor-grab flex-col items-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-3xl drop-shadow-md">📍</span>
          <span className="mt-0.5 text-sm font-medium text-neutral-400">
            끌어서 놓기
          </span>
        </motion.div>
      )}

      {/* Draggable Pin – active/dragging state */}
      {pinPos && (
        <motion.div
          className="pointer-events-none absolute z-20 flex flex-col items-center"
          style={{
            left: pinPos.x - 16,
            top: pinPos.y - 36,
          }}
          animate={
            snappedZone
              ? { scale: [1, 1.3, 1.1] }
              : dragging
                ? { scale: 1.15 }
                : { scale: 1 }
          }
          transition={
            snappedZone
              ? { type: 'tween', duration: 0.3 }
              : { type: 'spring', stiffness: 300, damping: 25 }
          }
        >
          <span className="text-3xl drop-shadow-lg">📍</span>
        </motion.div>
      )}

      {/* Status text */}
      <p className="absolute bottom-1 left-0 right-0 text-center text-sm text-neutral-400">
        {snappedZone ? `${snappedZone.emoji} ${snappedZone.label} 선택!` : ''}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q1 – Seminar poster scene for MoodSlider (o2 호기심, no reverse)   */
/* ------------------------------------------------------------------ */

const Q1_SLIDER_POINTS: SliderPoint[] = [
  { value: 1, emoji: '🚫', label: '패스' },
  { value: 2, emoji: '😕', label: '내 분야 아닌데' },
  { value: 3, emoji: '🤔', label: '시간 되면' },
  { value: 4, emoji: '😊', label: '재밌겠다' },
  { value: 5, emoji: '🤩', label: '꼭 가야지!' },
];

function SeminarPosterScene({ activeIndex }: { activeIndex: number | null }) {
  const interest =
    activeIndex === null || activeIndex <= 1
      ? 'low'
      : activeIndex === 2
        ? 'neutral'
        : 'high';

  return (
    <div
      className="relative flex h-40 flex-col items-center justify-center overflow-hidden rounded-2xl transition-all duration-500"
      style={{
        background:
          interest === 'high'
            ? 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 40%, #FBCFE8 100%)'
            : interest === 'neutral'
              ? 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)'
              : 'linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%)',
      }}
    >
      {/* Poster */}
      <motion.div
        className="flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4"
        style={{
          borderColor:
            interest === 'high'
              ? '#EC4899'
              : interest === 'neutral'
                ? '#D1D5DB'
                : '#E5E7EB',
          backgroundColor:
            interest === 'high'
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.7)',
        }}
        animate={{
          opacity: interest === 'low' ? 0.45 : 1,
          scale: interest === 'high' ? 1.05 : 1,
          filter: interest === 'low' ? 'grayscale(0.6)' : 'grayscale(0)',
        }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-3xl">📋</span>
        <span
          className="text-sm font-bold"
          style={{
            color: interest === 'high' ? '#EC4899' : '#6B7280',
          }}
        >
          다른 분야 세미나
        </span>
        <span className="text-sm text-neutral-400">초대장</span>
      </motion.div>

      {/* Sparkles when interested */}
      {interest === 'high' && (
        <>
          {['✨', '💡', '🌟', '⭐'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              style={{
                left: `${12 + i * 22}%`,
                top: `${8 + (i % 2) * 65}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.7],
                scale: [0, 1.3, 1],
                rotate: [0, 15, -5],
              }}
              transition={{ type: 'tween', duration: 0.5, delay: i * 0.1 }}
            >
              {emoji}
            </motion.span>
          ))}
        </>
      )}

      {/* Disinterest text */}
      {interest === 'low' && (
        <motion.p
          className="absolute bottom-2 text-sm text-stone-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        >
          ...별 관심 없는 포스터
        </motion.p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q2 – DoorPicker: 5 doors in a corridor (o3 창의성, no reverse)     */
/* ------------------------------------------------------------------ */

interface DoorChoice {
  emoji: string;
  label: string;
  value: number;
  color: string;
}

const DOOR_CHOICES: DoorChoice[] = [
  { emoji: '🎨', label: '예술+연구', value: 5, color: '#EC4899' },
  { emoji: '🚀', label: '스타트업', value: 4, color: '#F59E0B' },
  { emoji: '🏢', label: '대기업R&D', value: 3, color: '#3B82F6' },
  { emoji: '🏛️', label: '공기업', value: 2, color: '#10B981' },
  { emoji: '👨‍👩‍👧', label: '부모님추천', value: 1, color: '#8B5CF6' },
];

function DoorPicker({
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
    <div className="flex flex-col items-center gap-2">
      {/* Doors row with perspective */}
      <div className="flex items-end justify-center gap-2.5" style={{ perspective: '700px' }}>
        {DOOR_CHOICES.map((door, i) => {
          const isSelected = selected === door.value;

          return (
            <motion.button
              key={door.value}
              type="button"
              onClick={() => handleTap(door.value)}
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative flex w-[52px] flex-col items-center justify-center overflow-hidden"
                style={{
                  height: 76,
                  borderRadius: '20px 20px 0 0',
                  background: `linear-gradient(180deg, ${door.color}45, ${door.color}20)`,
                  border: `2px solid ${door.color}70`,
                  borderBottom: 'none',
                  transformOrigin: 'left center',
                  boxShadow: isSelected
                    ? `0 4px 20px ${door.color}40, inset 0 0 20px rgba(255,255,255,0.3)`
                    : `0 2px 8px ${door.color}15`,
                }}
                animate={
                  isSelected
                    ? { rotateY: -35, scale: 1.05 }
                    : { rotateY: 0, scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                {/* Emoji */}
                <span className="text-2xl">{door.emoji}</span>

                {/* Door handle */}
                <div
                  className="absolute right-2 top-1/2 h-2.5 w-2.5 rounded-full shadow-sm"
                  style={{
                    backgroundColor: door.color,
                    boxShadow: `0 1px 3px ${door.color}60`,
                  }}
                />

                {/* Light revealed when door opens */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(90deg, transparent 30%, rgba(255,255,200,0.5) 100%)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <span
                className="mt-1 max-w-[56px] text-center text-sm font-bold leading-tight"
                style={{ color: isSelected ? door.color : '#6b7280' }}
              >
                {door.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Floor/ground line */}
      <div
        className="h-1.5 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${themeColor}10, #F59E0B30, #3B82F625, #10B98125, #8B5CF620)`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Q3 – Text choices (o4 비관습성, no reverse)                        */
/* ------------------------------------------------------------------ */

const Q3_CHOICES: SceneChoice[] = [
  { label: '최고의 칭찬! 감사합니다', value: 5, emoji: '✨' },
  { label: '은근 뿌듯 ㅎㅎ', value: 4, emoji: '😏' },
  { label: '그냥 웃고 넘김', value: 3, emoji: '🙂' },
  { label: '약간 신경 쓰이긴 해...', value: 2, emoji: '😅' },
  { label: '기분 나쁜데...', value: 1, emoji: '😤' },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function GraduationScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const sceneKey = `graduation-${episodeNumber}-${questionIndex}`;

  const renderSeminarScene = useCallback(
    (activeIndex: number | null) => <SeminarPosterScene activeIndex={activeIndex} />,
    [],
  );

  return (
    <EpisodeSceneShell
      sceneKey={sceneKey}
      direction={direction}
      episodeNumber={episodeNumber}
      questionIndex={questionIndex}
      themeColor={themeColor}
    >
      {questionIndex === 0 && (
        <>
          <ScenePrompt
            title="주말에 뭐 할까?"
            description="졸업 심사 끝나면 뭐 하고 싶어?"
            themeColor={themeColor}
          />
          <DragPinMap themeColor={themeColor} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 1 && (
        <>
          <ScenePrompt
            title="전혀 다른 분야 세미나 초대가 왔다"
            themeColor={themeColor}
          />
          <MoodSlider
            points={Q1_SLIDER_POINTS}
            onSelect={onResponse}
            themeColor={themeColor}
            renderScene={renderSeminarScene}
          />
        </>
      )}

      {questionIndex === 2 && (
        <>
          <ScenePrompt
            title="졸업 후 뭘 하고 싶어?"
            description="복도에 5개의 문이 있다. 어떤 문을 열겠어?"
            themeColor={themeColor}
          />
          <DoorPicker themeColor={themeColor} onSelect={onResponse} />
        </>
      )}

      {questionIndex === 3 && (
        <>
          <ScenePrompt
            title={'"좀 특이하다"는 말을 들으면?'}
            themeColor={themeColor}
          />
          <ChoiceList choices={Q3_CHOICES} themeColor={themeColor} onSelect={onResponse} />
        </>
      )}
    </EpisodeSceneShell>
  );
}
