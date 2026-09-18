'use client';

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
        className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 border-2"
        style={{ borderColor: themeColor + '40', backgroundColor: themeColor + '15' }}
      >
        {avatar}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-sm font-bold" style={{ color: themeColor }}>
          {name}
        </span>
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-neutral-100">
          <p className="text-base text-neutral-700 leading-snug">{message}</p>
        </div>
      </div>
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
  choices: SceneChoice[];
}

const Q_DATA: QItem[] = [
  {
    // Q0 – patience a4 (reverse=true)
    // Patient behaviour → LOW value so reverseScore(x)=6-x yields HIGH
    chat: { avatar: '😮', name: '김 선배', message: '이 부분 분석이 좀 이상한데? 다시 해봐' },
    title: '어떻게 반응할까?',
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
    choices: [
      { label: '같이 해보자! 둘 다 해보면 되지', value: 5, emoji: '🤝' },
      { label: '절충안을 찾아보자', value: 4, emoji: '⚖️' },
      { label: '각자 방법으로 해보자', value: 3, emoji: '🔄' },
      { label: '내 방법이 맞다고 생각해', value: 2, emoji: '🤨' },
      { label: '근거 가져와', value: 1, emoji: '📄' },
    ],
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

      <ChoiceList
        choices={q.choices}
        themeColor={themeColor}
        onSelect={onResponse}
        variant="message"
      />
    </EpisodeSceneShell>
  );
}
