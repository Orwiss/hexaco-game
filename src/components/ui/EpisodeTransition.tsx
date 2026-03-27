'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EpisodeTransitionProps {
  text: string;
  show: boolean;
  onComplete: () => void;
}

export default function EpisodeTransition({ text, show, onComplete }: EpisodeTransitionProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!show) {
      setDisplayedText('');
      return;
    }

    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [show, text, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/80 text-lg leading-relaxed text-center">
            {displayedText}
            <motion.span
              className="inline-block w-0.5 h-5 bg-white/60 ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
