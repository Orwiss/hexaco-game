'use client';

import { motion, AnimatePresence } from 'framer-motion';
import LikertScale from './LikertScale';

interface QuestionCardProps {
  episodeNumber: number;
  questionIndex: number;
  questionText: string;
  sceneContext: string;
  themeColor: string;
  value: number | null;
  onChange: (value: number) => void;
  direction: number;
}

export default function QuestionCard({
  episodeNumber,
  questionIndex,
  questionText,
  sceneContext,
  themeColor,
  value,
  onChange,
  direction,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`${episodeNumber}-${questionIndex}`}
        custom={direction}
        initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col flex-1 px-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: themeColor + '20', color: themeColor }}
          >
            EP.{episodeNumber}
          </span>
          <span className="text-xs text-neutral-400">
            Q{questionIndex + 1}/4
          </span>
        </div>

        {/* Scene context */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-neutral-500 leading-relaxed">{sceneContext}</p>
        </div>

        {/* Instruction */}
        <p className="text-[11px] text-neutral-400 text-center mb-2">
          평소의 나를 생각하며 답해주세요
        </p>

        {/* Question */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 mb-6">
          <p className="text-base leading-relaxed text-neutral-800 text-center">
            &ldquo;{questionText}&rdquo;
          </p>
        </div>

        {/* Likert Scale */}
        <LikertScale value={value} onChange={onChange} themeColor={themeColor} />
      </motion.div>
    </AnimatePresence>
  );
}
