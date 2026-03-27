export type FactorKey = 'H' | 'E' | 'X' | 'A' | 'C' | 'O';

export type FacetKey =
  | 'sincerity' | 'fairness' | 'greedAvoidance' | 'modesty'
  | 'fearfulness' | 'anxiety' | 'dependence' | 'sentimentality'
  | 'socialSelfEsteem' | 'socialBoldness' | 'sociability' | 'liveliness'
  | 'forgivingness' | 'gentleness' | 'flexibility' | 'patience'
  | 'organization' | 'diligence' | 'perfectionism' | 'prudence'
  | 'aestheticAppreciation' | 'inquisitiveness' | 'creativity' | 'unconventionality';

export interface Question {
  id: string;
  factor: FactorKey;
  facet: FacetKey;
  text: string;
  reverse: boolean;
  episode: number;
}

export type BHIResponse = Record<string, number>;

export type FactorScores = Record<FactorKey, number>;

export interface TypeResult {
  id: string;
  name: string;
  emoji: string;
  description: string;
  detailDescription: string;
  tip: string;
  score: number;
}

export interface ClassificationResult {
  primary: TypeResult;
  secondary: TypeResult | null;
  isBalanced: boolean;
  isTied: boolean;
  factorScores: FactorScores;
  normalizedScores: Record<FactorKey, number>;
  profileSD: number;
}

export interface Episode {
  number: number;
  title: string;
  factor: FactorKey;
  description: string;
  transitionText: string;
  themeColor: string;
  sceneContext: string[];
}

export interface Demographics {
  age?: number;
  gender?: string;
  gradYear?: number;
}
