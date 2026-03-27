import { BHIResponse, FactorKey, FactorScores, ClassificationResult, TypeResult } from './types';
import { QUESTIONS } from './questions';

// --- Reverse scoring ---
export function reverseScore(score: number): number {
  return 6 - score;
}

// --- Factor score calculation ---
export function calculateFactorScore(
  responses: BHIResponse,
  factor: FactorKey,
): number {
  const items = QUESTIONS.filter(q => q.factor === factor);
  const scores = items.map(item =>
    item.reverse ? reverseScore(responses[item.id]) : responses[item.id]
  );
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function calculateAllFactorScores(responses: BHIResponse): FactorScores {
  const factors: FactorKey[] = ['H', 'E', 'X', 'A', 'C', 'O'];
  const scores = {} as FactorScores;
  for (const f of factors) {
    scores[f] = calculateFactorScore(responses, f);
  }
  return scores;
}

// --- Normalization (1-5 → 0-100%) ---
export function normalize(mean: number): number {
  return ((mean - 1) / 4) * 100;
}

// --- Profile SD (within-person standard deviation) ---
export function getProfileSD(scores: FactorScores): number {
  const values = Object.values(scores);
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((sum, s) => sum + (s - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
}

// Scale-derived threshold: scaleRange / (2 * sqrt(numFactors))
const BALANCED_THRESHOLD = 4 / (2 * Math.sqrt(6)); // ≈ 0.8165

// --- Type weight vectors ---
// [H, C, X, A, E, O]
const TYPE_WEIGHTS: Record<string, number[]> = {
  T1: [+2, +2, -2,  0,  0,  0],  // 은둔형 연구자
  T2: [-2,  0, +2, +2,  0,  0],  // 사교형 네트워커
  T3: [+2, +2, +1,  0, -2, -1],  // 전략적 생존자
  T4: [ 0, -2, +2,  0,  0, +2],  // 열정형 탐험가
  T5: [+2,  0,  0, +2, +2,  0],  // 든든한 조력자
  T6: [+2,  0,  0, -2,  0, +2],  // 독립형 혁신가
  T7: [ 0,  0, -2,  0, +2, +2],  // 감성형 관찰자
  T8: [ 0, +2, +2, -2,  0,  0],  // 실행형 리더
};

const TYPE_INFO: Record<string, Omit<TypeResult, 'score'>> = {
  T1: {
    id: 'T1', name: '은둔형 연구자', emoji: '🔬',
    description: '묵묵히 연구에 몰입하는 타입',
    detailDescription: '자기 기준이 확고하고 성실하게 일하지만, 사교적 자리는 피하는 편입니다. 조용한 환경에서 깊이 있는 연구를 할 때 가장 빛나는 타입.',
    tip: '가끔은 연구실 밖으로 나가 동료들과 교류해 보세요. 뜻밖의 영감을 얻을 수 있습니다.',
  },
  T2: {
    id: 'T2', name: '사교형 네트워커', emoji: '🎤',
    description: '학회마다 인맥을 넓히는 타입',
    detailDescription: '에너지가 넘치고 사람들과 잘 어울리며, 기회를 놓치지 않습니다. 다양한 사람들과의 협업에서 시너지를 만들어내는 타입.',
    tip: '넓은 네트워크도 좋지만, 가끔은 혼자만의 시간에 깊이 있는 사고를 해보세요.',
  },
  T3: {
    id: 'T3', name: '전략적 생존자', emoji: '📋',
    description: '계획적으로 졸업 로드맵을 짜는 타입',
    detailDescription: '감정에 흔들리지 않고 차근차근 목표를 향해 나아갑니다. 효율적인 시간 관리와 실용적 선택으로 대학원 생활을 헤쳐나가는 타입.',
    tip: '계획도 중요하지만, 예상 밖의 연구 주제에도 마음을 열어보세요.',
  },
  T4: {
    id: 'T4', name: '열정형 탐험가', emoji: '🔥',
    description: '관심사가 넓고 에너지가 넘치는 타입',
    detailDescription: '새로운 걸 시작하는 건 잘하는데 마무리가 약한 편. 하지만 그 호기심과 열정이 결국 독창적인 연구로 이어집니다.',
    tip: '시작한 일의 마무리에 조금 더 신경 쓰면, 당신의 창의성이 완성도 있는 결과물로 빛날 거예요.',
  },
  T5: {
    id: 'T5', name: '든든한 조력자', emoji: '🛡️',
    description: '랩의 정서적 기둥',
    detailDescription: '후배를 잘 챙기고, 갈등을 중재하며, 공정함을 중시합니다. 연구실의 분위기를 따뜻하게 만드는 핵심 인물.',
    tip: '다른 사람을 챙기느라 자신을 소홀히 하지 마세요. 당신의 에너지도 소중합니다.',
  },
  T6: {
    id: 'T6', name: '독립형 혁신가', emoji: '💡',
    description: '자기만의 연구 방향을 고수하는 타입',
    detailDescription: '창의적이고 정직하지만, 타협은 잘 안 합니다. 남들이 가지 않은 길에서 새로운 발견을 하는 타입.',
    tip: '자신의 비전을 유지하되, 동료의 피드백에서도 가치를 찾아보세요.',
  },
  T7: {
    id: 'T7', name: '감성형 관찰자', emoji: '🌊',
    description: '깊이 느끼고 깊이 생각하는 타입',
    detailDescription: '예민하지만 관찰력이 뛰어나고, 글 쓰는 능력이 좋습니다. 다른 사람이 놓치는 미묘한 패턴을 포착하는 타입.',
    tip: '감수성이 강점이지만, 때로는 감정과 거리를 두는 연습도 필요해요.',
  },
  T8: {
    id: 'T8', name: '실행형 리더', emoji: '⚡',
    description: '프로젝트를 끌고 나가는 추진력',
    detailDescription: '목표 지향적이고 결단력이 있지만, 가끔 동료와 부딪힙니다. 팀을 이끌어 성과를 만들어내는 타입.',
    tip: '속도도 중요하지만, 팀원의 속도에 맞춰주는 여유도 리더십입니다.',
  },
  T9: {
    id: 'T9', name: '균형잡힌 연구자', emoji: '⚖️',
    description: '어느 한쪽으로 치우치지 않는 올라운더',
    detailDescription: '상황에 따라 유연하게 대처하며, 다양한 역할을 무난히 소화합니다. 특정 성향이 극단적이지 않아 어떤 환경에서든 적응하는 타입.',
    tip: '균형이 강점이지만, 자신만의 색깔을 더 선명하게 드러내 보는 것도 좋아요.',
  },
};

// --- Weighted matching score ---
function calculateTypeScore(scores: FactorScores, weights: number[]): number {
  const factorOrder: FactorKey[] = ['H', 'C', 'X', 'A', 'E', 'O'];
  const norms = factorOrder.map(f => scores[f] - 3.0);
  const raw = weights.reduce((sum, w, i) => sum + w * norms[i], 0);
  const absSum = weights.reduce((sum, w) => sum + Math.abs(w), 0);
  return raw / absSum;
}

// --- Main classification ---
export function classifyType(factorScores: FactorScores): ClassificationResult {
  const profileSD = getProfileSD(factorScores);

  // Normalized scores (0-100%)
  const factors: FactorKey[] = ['H', 'E', 'X', 'A', 'C', 'O'];
  const normalizedScores = {} as Record<FactorKey, number>;
  for (const f of factors) {
    normalizedScores[f] = normalize(factorScores[f]);
  }

  // Check if balanced
  if (profileSD < BALANCED_THRESHOLD) {
    const balanced = { ...TYPE_INFO.T9, score: 0 };
    return {
      primary: balanced,
      secondary: null,
      isBalanced: true,
      isTied: false,
      factorScores,
      normalizedScores,
      profileSD,
    };
  }

  // Calculate all type scores
  const typeScores: { id: string; score: number }[] = Object.entries(TYPE_WEIGHTS).map(
    ([id, weights]) => ({ id, score: calculateTypeScore(factorScores, weights) })
  );

  // Sort descending
  typeScores.sort((a, b) => b.score - a.score);

  const first = typeScores[0];
  const second = typeScores[1];
  const isTied = (first.score - second.score) < 0.1;

  const primary: TypeResult = { ...TYPE_INFO[first.id], score: first.score };
  const secondary: TypeResult = { ...TYPE_INFO[second.id], score: second.score };

  return {
    primary,
    secondary,
    isBalanced: false,
    isTied,
    factorScores,
    normalizedScores,
    profileSD,
  };
}
