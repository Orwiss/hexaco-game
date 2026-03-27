import { createClient } from '@supabase/supabase-js';
import { BHIResponse, FactorScores, ClassificationResult, Demographics } from './types';
import { QUESTIONS } from './questions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

interface SaveParams {
  responses: BHIResponse;
  factorScores: FactorScores;
  result: ClassificationResult;
  demographics: Demographics;
  completionTimeSec: number | null;
  questionTimes: Record<string, number>;
  soundEnabled: boolean;
}

export async function saveResponse(params: SaveParams): Promise<void> {
  if (!supabase) return;

  const {
    responses,
    factorScores,
    result,
    demographics,
    completionTimeSec,
    questionTimes,
    soundEnabled,
  } = params;

  // Calculate avg response time
  const times = Object.values(questionTimes).filter(t => t > 0);
  const avgResponseTimeMs = times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : null;

  // Calculate response variance
  const values = Object.values(responses);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const responseVariance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;

  const row: Record<string, unknown> = {
    // Demographics
    age: demographics.age ?? null,
    gender: demographics.gender ?? null,
    grad_year: demographics.gradYear ?? null,
    // 24 items
    ...Object.fromEntries(QUESTIONS.map(q => [q.id, responses[q.id] ?? null])),
    // Factor scores (raw mean 1-5)
    score_h: factorScores.H,
    score_e: factorScores.E,
    score_x: factorScores.X,
    score_a: factorScores.A,
    score_c: factorScores.C,
    score_o: factorScores.O,
    // Type
    result_type: result.primary.name,
    result_type_score: result.primary.score,
    result_type_2nd: result.secondary?.name ?? null,
    result_type_2nd_score: result.secondary?.score ?? null,
    is_balanced: result.isBalanced,
    // Quality metadata
    completion_time_sec: completionTimeSec,
    avg_response_time_ms: avgResponseTimeMs,
    response_variance: responseVariance,
    dropped_off_at: null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    sound_enabled: soundEnabled,
  };

  try {
    const { error } = await supabase.from('responses').insert(row);
    if (error) throw error;
  } catch {
    // Retry once
    try {
      await supabase.from('responses').insert(row);
    } catch {
      // Silently fail — result is already shown client-side
    }
  }
}
