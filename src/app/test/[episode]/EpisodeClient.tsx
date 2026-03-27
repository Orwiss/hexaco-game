'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { EPISODES, getEpisodeQuestions } from '@/lib/questions';
import QuestionCard from '@/components/ui/QuestionCard';
import ProgressBar from '@/components/ui/ProgressBar';
import EpisodeTransition from '@/components/ui/EpisodeTransition';
import { playEpisodeComplete } from '@/lib/sound';

interface EpisodeClientProps {
  episodeNumber: number;
}

type Phase = 'intro' | 'questions' | 'transition';

export default function EpisodeClient({ episodeNumber }: EpisodeClientProps) {
  const router = useRouter();
  const episode = EPISODES[episodeNumber - 1];
  const questions = getEpisodeQuestions(episodeNumber);

  const {
    responses,
    currentEpisode,
    currentQuestionIndex,
    setResponse,
    nextQuestion,
    prevQuestion,
    startTimer,
    stopTimer,
    startQuestionTimer,
    recordQuestionTime,
  } = useGameStore();

  const [phase, setPhase] = useState<Phase>('intro');
  const [direction, setDirection] = useState(1);

  // Sync store episode with URL
  useEffect(() => {
    if (currentEpisode !== episodeNumber) {
      useGameStore.setState({
        currentEpisode: episodeNumber,
        currentQuestionIndex: 0,
      });
    }
  }, [episodeNumber, currentEpisode]);

  // Start timer on first episode
  useEffect(() => {
    if (episodeNumber === 1 && phase === 'intro') {
      startTimer();
    }
  }, [episodeNumber, phase, startTimer]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentValue = currentQuestion ? (responses[currentQuestion.id] ?? null) : null;

  const handleResponse = useCallback((value: number) => {
    if (!currentQuestion) return;

    recordQuestionTime(currentQuestion.id);
    setResponse(currentQuestion.id, value);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestionIndex < 3) {
        setDirection(1);
        nextQuestion();
        startQuestionTimer();
      } else {
        // Episode complete
        playEpisodeComplete();
        if (episodeNumber < 6) {
          setPhase('transition');
        } else {
          // Last episode done
          stopTimer();
          router.push('/result');
        }
      }
    }, 300);
  }, [currentQuestion, currentQuestionIndex, episodeNumber, nextQuestion, setResponse, recordQuestionTime, startQuestionTimer, stopTimer, router]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      prevQuestion();
    } else if (episodeNumber > 1) {
      router.push(`/test/${episodeNumber - 1}`);
    }
  }, [currentQuestionIndex, episodeNumber, prevQuestion, router]);

  const handleTransitionComplete = useCallback(() => {
    nextQuestion();
    router.push(`/test/${episodeNumber + 1}`);
  }, [episodeNumber, nextQuestion, router]);

  const handleStartQuestions = useCallback(() => {
    setPhase('questions');
    startQuestionTimer();
  }, [startQuestionTimer]);

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="flex flex-col min-h-dvh">
        {/* SVG placeholder background */}
        <div
          className="flex-1 flex items-end justify-center p-6"
          style={{ backgroundColor: episode.themeColor + '10' }}
        >
          <div className="w-full max-w-[300px] aspect-square rounded-3xl flex items-center justify-center"
               style={{ backgroundColor: episode.themeColor + '20' }}>
            <span className="text-6xl opacity-50">
              {episodeNumber === 1 && '🎓'}
              {episodeNumber === 2 && '📚'}
              {episodeNumber === 3 && '🔬'}
              {episodeNumber === 4 && '🎤'}
              {episodeNumber === 5 && '🌙'}
              {episodeNumber === 6 && '🚪'}
            </span>
          </div>
        </div>

        <div className="p-6 pb-24">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: episode.themeColor + '20', color: episode.themeColor }}
            >
              EP.{episodeNumber}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-3">{episode.title}</h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            {episode.description}
          </p>
          <button
            onClick={handleStartQuestions}
            className="w-full py-4 rounded-2xl text-white text-lg active:scale-95 transition-transform"
            style={{ backgroundColor: episode.themeColor }}
          >
            시작하기
          </button>
        </div>

        <ProgressBar currentEpisode={episodeNumber} currentQuestionIndex={-1} />
      </div>
    );
  }

  // Transition screen
  if (phase === 'transition') {
    return (
      <EpisodeTransition
        text={episode.transitionText}
        show={true}
        onComplete={handleTransitionComplete}
      />
    );
  }

  // Question screen
  return (
    <div className="flex flex-col min-h-dvh pt-4 pb-20">
      {/* Back button */}
      {(currentQuestionIndex > 0 || episodeNumber > 1) && (
        <button
          onClick={handlePrev}
          className="self-start ml-4 mb-2 text-sm text-neutral-400 active:text-neutral-600 min-w-[44px] min-h-[44px] flex items-center"
        >
          ← 이전
        </button>
      )}

      <QuestionCard
        episodeNumber={episodeNumber}
        questionIndex={currentQuestionIndex}
        questionText={currentQuestion.text}
        sceneContext={episode.sceneContext[currentQuestionIndex]}
        themeColor={episode.themeColor}
        value={currentValue}
        onChange={handleResponse}
        direction={direction}
      />

      <ProgressBar
        currentEpisode={episodeNumber}
        currentQuestionIndex={currentQuestionIndex}
      />
    </div>
  );
}
