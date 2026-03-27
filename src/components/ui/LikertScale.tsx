'use client';

import { motion } from 'framer-motion';
import { playClick } from '@/lib/sound';

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  themeColor: string;
}

const SIZES = [36, 40, 44, 48, 52];
const LABELS = ['전혀\n아니다', '', '보통', '', '매우\n그렇다'];

export default function LikertScale({ value, onChange, themeColor }: LikertScaleProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {[1, 2, 3, 4, 5].map((n, i) => {
        const size = SIZES[i];
        const isSelected = value === n;

        return (
          <div key={n} className="flex flex-col items-center gap-2">
            <motion.button
              type="button"
              onClick={() => { playClick(); onChange(n); }}
              className="rounded-full border-2 flex items-center justify-center transition-colors"
              style={{
                width: size,
                height: size,
                minWidth: 44,
                minHeight: 44,
                borderColor: isSelected ? themeColor : '#d4d4d4',
                backgroundColor: isSelected ? themeColor : 'transparent',
                color: isSelected ? 'white' : '#737373',
              }}
              whileTap={{ scale: 0.9 }}
              animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-bold">{n}</span>
            </motion.button>
            {LABELS[i] && (
              <span className="text-[10px] text-neutral-400 text-center whitespace-pre-line leading-tight">
                {LABELS[i]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
