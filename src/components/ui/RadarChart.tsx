'use client';

import { FactorKey } from '@/lib/types';

interface RadarChartProps {
  scores: Record<FactorKey, number>; // 0-100 normalized
}

const FACTORS: { key: FactorKey; label: string; labelKo: string }[] = [
  { key: 'H', label: 'H', labelKo: '정직-겸손' },
  { key: 'E', label: 'E', labelKo: '정서성' },
  { key: 'X', label: 'X', labelKo: '외향성' },
  { key: 'A', label: 'A', labelKo: '우호성' },
  { key: 'C', label: 'C', labelKo: '성실성' },
  { key: 'O', label: 'O', labelKo: '개방성' },
];

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 110;

function polarToXY(angle: number, r: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CENTER + r * Math.cos(rad), CENTER + r * Math.sin(rad)];
}

export default function RadarChart({ scores }: RadarChartProps) {
  const n = FACTORS.length;
  const angleStep = 360 / n;

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Data polygon points
  const dataPoints = FACTORS.map((f, i) => {
    const value = (scores[f.key] ?? 50) / 100;
    return polarToXY(i * angleStep, RADIUS * value);
  });
  const dataPath = dataPoints.map(([x, y], i) =>
    `${i === 0 ? 'M' : 'L'}${x},${y}`
  ).join(' ') + 'Z';

  return (
    <div className="flex justify-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Grid rings */}
        {rings.map((r) => {
          const ringPoints = Array.from({ length: n }, (_, i) =>
            polarToXY(i * angleStep, RADIUS * r)
          );
          const ringPath = ringPoints.map(([x, y], i) =>
            `${i === 0 ? 'M' : 'L'}${x},${y}`
          ).join(' ') + 'Z';
          return (
            <path
              key={r}
              d={ringPath}
              fill="none"
              stroke="#e5e5e5"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {FACTORS.map((_, i) => {
          const [x, y] = polarToXY(i * angleStep, RADIUS);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="#e5e5e5"
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={dataPath}
          fill="rgba(139, 92, 246, 0.15)"
          stroke="#8B5CF6"
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill="#8B5CF6"
          />
        ))}

        {/* Labels */}
        {FACTORS.map((f, i) => {
          const [x, y] = polarToXY(i * angleStep, RADIUS + 24);
          return (
            <text
              key={f.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] fill-neutral-600"
              fontFamily="GangwonEducationSaeum, sans-serif"
            >
              {f.labelKo}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
