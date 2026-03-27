'use client';

import { EPISODES } from '@/lib/questions';

interface ProgressBarProps {
  currentEpisode: number;
  currentQuestionIndex: number;
}

export default function ProgressBar({ currentEpisode, currentQuestionIndex }: ProgressBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-sm border-t border-neutral-100 px-6 py-3 z-50">
      <div className="flex gap-1.5">
        {EPISODES.map((ep) => {
          const isCurrent = ep.number === currentEpisode;
          const isCompleted = ep.number < currentEpisode;
          const progress = isCurrent ? (currentQuestionIndex + 1) / 4 : isCompleted ? 1 : 0;

          return (
            <div
              key={ep.number}
              className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden"
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: ep.themeColor,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-neutral-400">EP.{currentEpisode}</span>
        <span className="text-[10px] text-neutral-400">{currentQuestionIndex + 1}/4</span>
      </div>
    </div>
  );
}
