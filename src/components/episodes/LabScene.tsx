'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick } from '@/lib/sound';

interface EpisodeSceneProps {
  episodeNumber: number;
  questionIndex: number;
  themeColor: string;
  sceneContext: string;
  onResponse: (value: number) => void;
  direction: number;
}

interface ChoiceCard {
  label: string;
  value: number;
  emoji?: string;
}

interface ChatMessage {
  avatar: string;
  name: string;
  message: string;
}

function ChatBubble({ avatar, name, message, themeColor }: ChatMessage & { themeColor: string }) {
  return (
    <div className="flex items-start gap-2 w-full">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 border-2"
        style={{ borderColor: themeColor + '40', backgroundColor: themeColor + '15' }}
      >
        {avatar}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-xs font-bold" style={{ color: themeColor }}>{name}</span>
        <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-neutral-100">
          <p className="text-sm text-neutral-700 leading-snug">&ldquo;{message}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}

function ChoiceCards({
  choices,
  themeColor,
  onSelect,
  sentMessage,
}: {
  choices: ChoiceCard[];
  themeColor: string;
  onSelect: (v: number) => void;
  sentMessage?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(value: number, label: string) {
    if (selected !== null) return;
    playClick();
    setSelected(value);
    setTimeout(() => onSelect(value), 400);
    void label; // used conceptually as "sent message"
  }

  // After selection, show the sent message bubble
  const selectedChoice = choices.find(c => c.value === selected);

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Show sent message when selected */}
      <AnimatePresence>
        {selected !== null && selectedChoice && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-end"
          >
            <div
              className="max-w-[80%] rounded-2xl rounded-br-sm px-3 py-2 text-white text-sm"
              style={{ backgroundColor: themeColor }}
            >
              {selectedChoice.emoji && <span className="mr-1">{selectedChoice.emoji}</span>}
              {selectedChoice.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choice buttons */}
      {selected === null && choices.map(c => (
        <motion.button
          key={c.value}
          type="button"
          onClick={() => handleTap(c.value, c.label)}
          className="w-full min-h-[48px] px-4 py-3 text-left text-sm leading-snug border-2 rounded-2xl rounded-br-sm transition-colors"
          style={{
            borderColor: '#e5e7eb',
            backgroundColor: 'white',
            color: '#374151',
          }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <span className="font-medium">
            {c.emoji && <span className="mr-1">{c.emoji}</span>}
            {c.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

const Q_DATA: {
  chat: ChatMessage;
  title: string;
  choices: ChoiceCard[];
}[] = [
  {
    chat: {
      avatar: '👨‍🔬',
      name: '김 선배',
      message: '나 데이터 정리 좀 부탁해도 될까? 내가 바빠서...',
    },
    title: '어떻게 답할까?',
    choices: [
      { label: '그럴 수 있죠, 제가 할게요', value: 5, emoji: '😊' },
      { label: '네, 알겠습니다', value: 4, emoji: '🙂' },
      { label: '좀 생각해볼게요', value: 3, emoji: '🤔' },
      { label: '저도 바쁜데요...', value: 2, emoji: '😅' },
      { label: '그건 선배 일 아닌가요?', value: 1, emoji: '😐' },
    ],
  },
  {
    chat: {
      avatar: '👩‍💻',
      name: '이 동료',
      message: '나는 이 분석 방법이 맞는 것 같은데? 네 방법은 좀 아닌 것 같아',
    },
    title: '어떻게 반응할까?',
    choices: [
      { label: '네 방법도 좋은데, 같이 해보자', value: 5, emoji: '🤝' },
      { label: '절충안을 찾아보자', value: 4, emoji: '⚖️' },
      { label: '각자 방법으로 해보고 비교하자', value: 3, emoji: '🔄' },
      { label: '내 방법이 더 맞는 것 같은데', value: 2, emoji: '🤨' },
      { label: '논문 근거 가져와봐', value: 1, emoji: '📄' },
    ],
  },
  {
    chat: {
      avatar: '😟',
      name: '박 후배',
      message: '선배... 제가 코드 실수했어요. 결과가 다 틀렸네요...',
    },
    title: '어떻게 말해줄까?',
    choices: [
      { label: '괜찮아, 같이 고치자!', value: 5, emoji: '💪' },
      { label: '다음엔 조심해~ 여기 고쳐봐', value: 4, emoji: '😊' },
      { label: '여기가 문제야, 수정해', value: 3, emoji: '👆' },
      { label: '확인하고 하지 그랬어', value: 2, emoji: '😑' },
      { label: '이걸 틀려...?', value: 1, emoji: '😤' },
    ],
  },
  {
    chat: {
      avatar: '😮',
      name: '나',
      message: '선배가 교수님 앞에서 내 아이디어를 자기 것처럼 발표하고 있다',
    },
    title: '어떻게 할까?',
    choices: [
      { label: '뭐 그럴 수 있지, 넘어가자', value: 5, emoji: '😌' },
      { label: '다음엔 같이 발표하자고 말해야지', value: 4, emoji: '🗓️' },
      { label: '좀 속상하지만... 넘어가자', value: 3, emoji: '😔' },
      { label: '교수님께 슬쩍 말씀드릴까', value: 2, emoji: '🤫' },
      { label: '직접 따져야겠다', value: 1, emoji: '😠' },
    ],
  },
];

function LabIllustration({
  themeColor,
  questionIndex,
}: {
  themeColor: string;
  questionIndex: number;
}) {
  const configs = [
    { emoji: '🔬', title: '연구실', subtitle: '선배에게서 메시지가 왔다' },
    { emoji: '💡', title: '분석 회의', subtitle: '동료와 의견이 갈렸다' },
    { emoji: '💻', title: '코딩 중', subtitle: '후배에게서 메시지가 왔다' },
    { emoji: '😮', title: '발표 현장', subtitle: '믿기 힘든 장면을 목격했다' },
  ];
  const cfg = configs[questionIndex];

  return (
    <div
      className="w-full h-full rounded-3xl flex flex-col items-center justify-center gap-2"
      style={{ backgroundColor: themeColor + '12' }}
    >
      <span className="text-4xl">{cfg.emoji}</span>
      <p className="text-sm font-bold" style={{ color: themeColor }}>{cfg.title}</p>
      <p className="text-xs text-neutral-400">{cfg.subtitle}</p>
    </div>
  );
}

export default function LabScene({
  episodeNumber,
  questionIndex,
  themeColor,
  onResponse,
  direction,
}: EpisodeSceneProps) {
  const q = Q_DATA[questionIndex];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`lab-${episodeNumber}-${questionIndex}`}
        custom={direction}
        initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col flex-1 px-5 gap-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: themeColor + '20', color: themeColor }}
          >
            EP.{episodeNumber}
          </span>
          <span className="text-xs text-neutral-400">Q{questionIndex + 1}/4</span>
        </div>

        {/* Lab illustration */}
        <div className="w-full h-28">
          <LabIllustration themeColor={themeColor} questionIndex={questionIndex} />
        </div>

        {/* Chat bubble from the other person */}
        <ChatBubble
          avatar={q.chat.avatar}
          name={q.chat.name}
          message={q.chat.message}
          themeColor={themeColor}
        />

        {/* Question title */}
        <p className="text-sm font-bold text-neutral-600 text-center">{q.title}</p>

        {/* Response choices */}
        <ChoiceCards choices={q.choices} themeColor={themeColor} onSelect={onResponse} />
      </motion.div>
    </AnimatePresence>
  );
}
