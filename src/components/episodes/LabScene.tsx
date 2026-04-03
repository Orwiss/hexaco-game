'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick } from '@/lib/sound';
import {
  EpisodeSceneShell,
  ScenePrompt,
  ChoiceList,
  type EpisodeSceneProps,
  type SceneChoice,
} from './shared';

// ---------------------------------------------------------------------------
// ChatBubble – messenger-style incoming message
// ---------------------------------------------------------------------------
function ChatBubble({
  avatar,
  name,
  message,
  themeColor,
}: {
  avatar: string;
  name: string;
  message: string;
  themeColor: string;
}) {
  return (
    <div className="flex items-start gap-2 w-full">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2"
        style={{ borderColor: themeColor + '40', backgroundColor: themeColor + '15' }}
      >
        {avatar}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-xs font-bold" style={{ color: themeColor }}>
          {name}
        </span>
        <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-neutral-100">
          <p className="text-sm text-neutral-700 leading-snug">{message}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Q1 – ReactionPicker (flexibility a3, reverse=false)
// Spatial emoji reaction row under chat bubble
// ---------------------------------------------------------------------------
const REACTION_OPTIONS = [
  { emoji: '🤝', label: '같이 해보자', value: 5 },
  { emoji: '⚖️', label: '절충안', value: 4 },
  { emoji: '🔄', label: '각자 해보자', value: 3 },
  { emoji: '🤨', label: '내 방법이 맞아', value: 2 },
  { emoji: '📄', label: '근거 가져와', value: 1 },
] as const;

function ReactionPicker({
  themeColor,
  onSelect,
}: {
  themeColor: string;
  onSelect: (v: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 300);
  }

  return (
    <div className="flex w-full items-center justify-center gap-3">
      {REACTION_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => handleTap(opt.value)}
            className="flex flex-col items-center gap-1 rounded-2xl border-2 p-2"
            style={{
              borderColor: isSelected ? themeColor : '#e5e7eb',
              backgroundColor: isSelected ? `${themeColor}15` : 'transparent',
            }}
            animate={{ scale: isSelected ? 1.2 : 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span
              className="text-[9px] font-medium leading-tight"
              style={{ color: isSelected ? themeColor : '#9ca3af' }}
            >
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question data
// ---------------------------------------------------------------------------
interface ChatInfo {
  avatar: string;
  name: string;
  message: string;
}

interface QItem {
  chat: ChatInfo;
  title: string;
  type: 'message' | 'reaction';
  choices?: SceneChoice[];
}

const Q_DATA: QItem[] = [
  {
    // Q0 – patience a4 (reverse=true)
    // Patient behaviour → LOW value so reverseScore(x)=6-x yields HIGH
    chat: { avatar: '😮', name: '김 선배', message: '이 부분 분석이 좀 이상한데? 다시 해봐' },
    title: '어떻게 반응할까?',
    type: 'message',
    choices: [
      { label: '네, 다시 확인해 볼게요', value: 1, emoji: '😊' },
      { label: '어디가 이상한지 알려주세요', value: 2, emoji: '🙂' },
      { label: '...네', value: 3, emoji: '😐' },
      { label: '제가 보기엔 맞는데요', value: 4, emoji: '🤨' },
      { label: '선배가 직접 해보시죠', value: 5, emoji: '😤' },
    ],
  },
  {
    // Q1 – flexibility a3 (reverse=false)
    // Flexible → HIGH value directly
    chat: {
      avatar: '👩‍💻',
      name: '이 동료',
      message: '나는 이 분석 방법이 맞는 것 같은데? 네 방법은 좀 아닌 것 같아',
    },
    title: '어떻게 반응할까?',
    type: 'reaction',
  },
  {
    // Q2 – gentleness a2 (reverse=false)
    // Gentle → HIGH value directly
    chat: {
      avatar: '😟',
      name: '박 후배',
      message: '선배... 제가 코드 실수했어요. 결과가 다 틀렸네요...',
    },
    title: '어떻게 말해줄까?',
    type: 'message',
    choices: [
      { label: '괜찮아, 같이 고치자!', value: 5, emoji: '💪' },
      { label: '다음엔 조심해~ 여기 고쳐봐', value: 4, emoji: '😊' },
      { label: '여기가 문제야, 수정해', value: 3, emoji: '👆' },
      { label: '확인하고 하지 그랬어', value: 2, emoji: '😑' },
      { label: '이걸 틀려...?', value: 1, emoji: '😤' },
    ],
  },
  {
    // Q3 – forgivingness a1 (reverse=false)
    // Forgiving → HIGH value directly
    chat: {
      avatar: '😮',
      name: '(내 생각)',
      message: '선배가 교수님 앞에서 내 아이디어를 자기 것처럼 발표하고 있다',
    },
    title: '어떻게 할까?',
    type: 'message',
    choices: [
      { label: '뭐 그럴 수 있지, 넘어가자', value: 5, emoji: '😌' },
      { label: '다음엔 같이 발표하자고 말해야지', value: 4, emoji: '🗓️' },
      { label: '좀 속상하지만... 넘어가자', value: 3, emoji: '😔' },
      { label: '교수님께 슬쩍 말씀드릴까', value: 2, emoji: '🤫' },
      { label: '직접 따져야겠다', value: 1, emoji: '😠' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function LabScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];

  return (
    <EpisodeSceneShell
      sceneKey={`lab-${episodeNumber}-${questionIndex}`}
      direction={direction}
      episodeNumber={episodeNumber}
      questionIndex={questionIndex}
      themeColor={themeColor}
    >
      {/* Chat bubble from the other person */}
      <ChatBubble
        avatar={q.chat.avatar}
        name={q.chat.name}
        message={q.chat.message}
        themeColor={themeColor}
      />

      <ScenePrompt title={q.title} themeColor={themeColor} />

      {q.type === 'reaction' && (
        <ReactionPicker themeColor={themeColor} onSelect={onResponse} />
      )}

      {q.type === 'message' && q.choices && (
        <ChoiceList
          choices={q.choices}
          themeColor={themeColor}
          onSelect={onResponse}
          variant="message"
        />
      )}
    </EpisodeSceneShell>
  );
}
