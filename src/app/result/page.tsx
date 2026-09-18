'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { calculateAllFactorScores, classifyType } from '@/lib/scoring';
import { QUESTIONS } from '@/lib/questions';
import { FactorKey, ClassificationResult, BalanceLevel } from '@/lib/types';
import { saveResponse } from '@/lib/supabase';
import { playResultReveal } from '@/lib/sound';
import RadarChart from '@/components/ui/RadarChart';
import ShareButtons from '@/components/ui/ShareButtons';

const FACTOR_LABELS: Record<FactorKey, string> = {
  H: '정직-겸손', E: '정서성', X: '외향성',
  A: '우호성', C: '성실성', O: '개방성',
};

const FACTOR_ORDER: FactorKey[] = ['H', 'C', 'X', 'A', 'E', 'O'];

function getLevelLabel(normalized: number): string {
  if (normalized >= 66.7) return '상대적으로 높음';
  if (normalized >= 33.3) return '중간';
  return '상대적으로 낮음';
}

const BALANCE_BADGE: Record<BalanceLevel, { label: string; emoji: string; color: string } | null> = {
  high: { label: '균형 성향이 매우 높습니다', emoji: '⚖️', color: '#8B5CF6' },
  moderate: { label: '균형 잡힌 편입니다', emoji: '⚖️', color: '#6B7280' },
  low: null,
};

function getLevelColor(normalized: number): string {
  if (normalized >= 66.7) return '#8B5CF6';
  if (normalized >= 33.3) return '#6B7280';
  return '#D1D5DB';
}

export default function ResultPage() {
  const router = useRouter();
  const { responses, demographics, completionTimeSec, questionTimes, reset } = useGameStore();
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const answered = QUESTIONS.filter(q => responses[q.id] != null).length;
    if (answered < 24) {
      router.replace('/test/1');
      return;
    }

    const factorScores = calculateAllFactorScores(responses);
    const classification = classifyType(factorScores);
    setResult(classification);
    playResultReveal();

    // Save to Supabase (once)
    if (!saved) {
      setSaved(true);
      saveResponse({
        responses,
        factorScores,
        result: classification,
        demographics,
        completionTimeSec,
        questionTimes,
        soundEnabled: false,
      });
    }
  }, [responses, router, saved, demographics, completionTimeSec, questionTimes]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-neutral-400">결과를 계산하고 있습니다...</div>
      </div>
    );
  }

  const handleRetry = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-dvh pb-12">
      {/* Header */}
      <div className="text-center pt-10 pb-6 px-6">
        <p className="text-base text-neutral-400 mb-2">당신의 대학원생 유형은</p>
        <div className="text-7xl mb-3">{result.primary.emoji}</div>
        <h1 className="text-3xl font-bold mb-1">{result.primary.name}</h1>
        <p className="text-lg text-neutral-500">{result.primary.description}</p>
      </div>

      {/* Balance badge */}
      {BALANCE_BADGE[result.balanceLevel] && (
        <div className="mx-6 mb-4 p-3 rounded-xl text-center"
          style={{ backgroundColor: BALANCE_BADGE[result.balanceLevel]!.color + '12' }}>
          <p className="text-base" style={{ color: BALANCE_BADGE[result.balanceLevel]!.color }}>
            {BALANCE_BADGE[result.balanceLevel]!.emoji}{' '}
            {BALANCE_BADGE[result.balanceLevel]!.label}
          </p>
        </div>
      )}

      {/* Tied type notice */}
      {result.isTied && result.secondary && !result.isBalanced && (
        <div className="mx-6 mb-4 p-3 bg-purple-50 rounded-xl text-center">
          <p className="text-base text-purple-700">
            {result.secondary.emoji} <strong>{result.secondary.name}</strong> 성향도 강합니다
          </p>
        </div>
      )}

      {/* Radar Chart */}
      <div className="px-6 mb-6">
        <RadarChart scores={result.normalizedScores} />
      </div>

      {/* Factor bars */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold mb-4">요인별 점수</h2>
        <div className="space-y-3">
          {FACTOR_ORDER.map((f) => {
            const score = result.normalizedScores[f];
            const level = getLevelLabel(score);
            const color = getLevelColor(score);
            return (
              <div key={f}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-medium">{FACTOR_LABELS[f]}</span>
                  <span className="text-sm" style={{ color }}>
                    {level} ({Math.round(score)}%)
                  </span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${score}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail description */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold mb-3">
          {result.primary.emoji} 상세 설명
        </h2>
        <p className="text-base text-neutral-600 leading-relaxed mb-4">
          {result.primary.detailDescription}
        </p>
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-base text-amber-800">
            💡 <strong>대학원 생활 팁</strong>: {result.primary.tip}
          </p>
        </div>
      </div>

      {/* Secondary type */}
      {result.secondary && !result.isBalanced && (
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold mb-3">비슷한 유형</h2>
          <div className="border border-neutral-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-3xl">{result.secondary.emoji}</span>
            <div>
              <p className="font-bold text-base">{result.secondary.name}</p>
              <p className="text-sm text-neutral-500">{result.secondary.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-6 mb-6">
        <div className="bg-neutral-50 rounded-xl p-4">
          <p className="text-sm text-neutral-400 leading-relaxed">
            ⚠️ 이 결과는 BHI(Brief HEXACO Inventory, de Vries, 2013) 간이 척도(요인당 4문항) 기반이며,
            전문 심리검사를 대체하지 않습니다. 간이 척도의 특성상 정밀도에 한계가 있으며,
            결과는 확정적 유형이 아닌 경향성으로 해석해 주세요.
          </p>
        </div>
      </div>

      {/* Share & Action buttons */}
      <div className="px-6 space-y-3" id="share-area">
        <ShareButtons shareAreaId="share-area" typeName={result.primary.name} />
        <button
          onClick={handleRetry}
          className="w-full py-4 bg-neutral-900 text-white rounded-2xl text-lg active:scale-95 transition-transform"
        >
          다시 하기
        </button>
      </div>
    </div>
  );
}
