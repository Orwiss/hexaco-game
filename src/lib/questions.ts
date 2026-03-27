import { Question, Episode } from './types';

export const QUESTIONS: Question[] = [
  // Episode 1: Extraversion (X)
  {
    id: 'x1', factor: 'X', facet: 'socialSelfEsteem', episode: 1,
    text: '전반적으로 나 자신에 대해 꽤 만족하는 편이다.',
    reverse: false,
  },
  {
    id: 'x2', factor: 'X', facet: 'socialBoldness', episode: 1,
    text: '나는 모임에서 내 의견을 거의 말하지 않는다.',
    reverse: true,
  },
  {
    id: 'x3', factor: 'X', facet: 'sociability', episode: 1,
    text: '나는 혼자 일하는 것보다 사람들과 활발히 교류하는 일을 선호한다.',
    reverse: false,
  },
  {
    id: 'x4', factor: 'X', facet: 'liveliness', episode: 1,
    text: '대체로 나는 쾌활하고 낙관적인 편이다.',
    reverse: false,
  },

  // Episode 2: Conscientiousness (C)
  {
    id: 'c1', factor: 'C', facet: 'organization', episode: 2,
    text: '나는 마지막에 허둥대지 않도록 미리 계획하고 정리한다.',
    reverse: false,
  },
  {
    id: 'c2', factor: 'C', facet: 'diligence', episode: 2,
    text: '나는 목표를 달성하려고 할 때 자주 자신을 몰아붙인다.',
    reverse: false,
  },
  {
    id: 'c3', factor: 'C', facet: 'perfectionism', episode: 2,
    text: '일할 때 세세한 부분에 별로 신경 쓰지 않는다.',
    reverse: true,
  },
  {
    id: 'c4', factor: 'C', facet: 'prudence', episode: 2,
    text: '나는 신중한 생각보다 그 순간의 느낌에 따라 결정을 내린다.',
    reverse: true,
  },

  // Episode 3: Agreeableness (A)
  {
    id: 'a1', factor: 'A', facet: 'forgivingness', episode: 3,
    text: '나에게 잘못한 사람에 대한 나의 태도는 "용서하고 잊자"이다.',
    reverse: false,
  },
  {
    id: 'a2', factor: 'A', facet: 'gentleness', episode: 3,
    text: '나는 다른 사람을 판단할 때 관대한 편이다.',
    reverse: false,
  },
  {
    id: 'a3', factor: 'A', facet: 'flexibility', episode: 3,
    text: '다른 사람이 실수를 많이 해도, 나는 부정적인 말을 거의 하지 않는다.',
    reverse: false,
  },
  {
    id: 'a4', factor: 'A', facet: 'patience', episode: 3,
    text: '사람들이 가끔 내가 다른 사람에게 너무 비판적이라고 말한다.',
    reverse: true,
  },

  // Episode 4: Honesty-Humility (H)
  {
    id: 'h1', factor: 'H', facet: 'sincerity', episode: 4,
    text: '나는 누군가에게 부탁할 일이 있다고 해서 그 사람을 좋아하는 척하지는 않을 것이다.',
    reverse: false,
  },
  {
    id: 'h2', factor: 'H', facet: 'fairness', episode: 4,
    text: '절대 들키지 않는다면, 나는 10억 원을 기꺼이 훔칠 의향이 있다.',
    reverse: true,
  },
  {
    id: 'h3', factor: 'H', facet: 'greedAvoidance', episode: 4,
    text: '돈이 많은 것은 나에게 특별히 중요하지 않다.',
    reverse: false,
  },
  {
    id: 'h4', factor: 'H', facet: 'modesty', episode: 4,
    text: '나는 보통 사람보다 더 많은 존중을 받을 자격이 있다고 생각한다.',
    reverse: true,
  },

  // Episode 5: Emotionality (E)
  {
    id: 'e1', factor: 'E', facet: 'fearfulness', episode: 5,
    text: '악천후에 여행해야 한다면 두려움을 느낄 것이다.',
    reverse: false,
  },
  {
    id: 'e2', factor: 'E', facet: 'anxiety', episode: 5,
    text: '나는 가끔 사소한 일도 걱정을 멈출 수가 없다.',
    reverse: false,
  },
  {
    id: 'e3', factor: 'E', facet: 'dependence', episode: 5,
    text: '나는 다른 사람의 정서적 지지 없이도 어려운 상황을 다룰 수 있다.',
    reverse: true,
  },
  {
    id: 'e4', factor: 'E', facet: 'sentimentality', episode: 5,
    text: '가까운 사람이 오랫동안 떠나게 되면 강한 감정을 느낀다.',
    reverse: false,
  },

  // Episode 6: Openness to Experience (O)
  {
    id: 'o1', factor: 'O', facet: 'aestheticAppreciation', episode: 6,
    text: '미술관을 방문하면 꽤 지루할 것 같다.',
    reverse: true,
  },
  {
    id: 'o2', factor: 'O', facet: 'inquisitiveness', episode: 6,
    text: '나는 다른 나라의 역사와 정치에 대해 배우는 것에 관심이 있다.',
    reverse: false,
  },
  {
    id: 'o3', factor: 'O', facet: 'creativity', episode: 6,
    text: '소설, 노래, 그림 같은 예술 작품을 만드는 것을 즐길 것이다.',
    reverse: false,
  },
  {
    id: 'o4', factor: 'O', facet: 'unconventionality', episode: 6,
    text: '사람들이 가끔 나를 "이상하다" 또는 "별나다"고 부른 적이 있다.',
    reverse: false,
  },
];

export const EPISODES: Episode[] = [
  {
    number: 1,
    title: 'OT 환영회',
    factor: 'X',
    description: '학기 초 OT. 강의실에 처음 보는 동기들이 모여 있다. 교수님의 간단한 인사 후 자기소개 타임이 시작되고, 이후 근처 식당에서 뒤풀이가 이어진다.',
    transitionText: '그렇게 정신없는 첫날이 지나고… 본격적인 대학원 생활이 시작됐다.',
    themeColor: '#F59E0B',
    sceneContext: [
      '교수님이 간단히 인사를 마치고 자기소개 타임이 시작되었다.',
      '동기들 사이에서 자연스럽게 대화가 오간다.',
      '뒤풀이 식당에서 시끌벅적한 분위기가 이어진다.',
      '새로운 사람들과의 첫 만남이 마무리되고 있다.',
    ],
  },
  {
    number: 2,
    title: '첫 수업과 과제',
    factor: 'C',
    description: '교수님이 첫 주에 과제 3개를 내줬다. 책상 위에 논문 더미, 열린 노트북, 포스트잇, 커피잔이 쌓여 있다. 데드라인이 하나씩 다가온다.',
    transitionText: '과제를 겨우 끝내고 나니… 이번엔 연구실 생활이 기다리고 있었다.',
    themeColor: '#3B82F6',
    sceneContext: [
      '책상 위에 쌓인 논문 더미를 바라보며 한숨을 내쉰다.',
      '마감이 코앞인데 아직 시작도 못 했다.',
      '꼼꼼히 확인하며 과제를 마무리하고 있다.',
      '다음 주 계획을 세우며 이번 주를 돌아본다.',
    ],
  },
  {
    number: 3,
    title: '연구실 생활',
    factor: 'A',
    description: '공동 프로젝트가 시작됐다. 선배가 바빠서 데이터 정리를 부탁하고, 동기와 분석 방법에 대한 의견이 갈린다. 후배가 코딩을 모르겠다며 도움을 요청한다.',
    transitionText: '연구실에서 부대끼며 반년이 흘렀다. 어느새 첫 학회 시즌이 다가왔다.',
    themeColor: '#10B981',
    sceneContext: [
      '선배가 바쁜 일정 때문에 데이터 정리를 부탁했다.',
      '동기와 분석 방법에 대해 의견이 갈리고 있다.',
      '후배가 코딩을 모르겠다며 조심스럽게 도움을 요청했다.',
      '연구실 안에서 다양한 관계가 교차하는 하루가 지나간다.',
    ],
  },
  {
    number: 4,
    title: '첫 학회 발표',
    factor: 'H',
    description: '논문을 학회에 제출했다. 발표 준비 중 데이터 해석이 애매한 부분을 발견한다. 포스터 세션에서 날카로운 질문을 받고, 쉬는 시간에 한 연구자가 공동연구를 제안한다.',
    transitionText: '학회에서 돌아오니 한 학기가 또 끝나 있었다. 그리고… 지침이 찾아왔다.',
    themeColor: '#8B5CF6',
    sceneContext: [
      '다른 연구자가 명함을 건네며 공동연구를 제안한다.',
      '옆에서 누군가 자신의 연구비 규모를 이야기하고 있다.',
      '포스터 세션에서 예상치 못한 질문을 받았다.',
      '화려한 포스터들 사이에서 내 발표를 돌아본다.',
    ],
  },
  {
    number: 5,
    title: '지침의 시간',
    factor: 'E',
    description: '논문 리뷰어가 격려와 함께 수정 요청을 보내왔다. 실험은 아직 안 풀리지만, 새벽 연구실에서 동기가 커피를 건네며 "우리 다 그래"라고 말한다. 괜찮아질 거라는 건 알지만, 오늘은 좀 지친다.',
    transitionText: '그 터널의 끝이 보이기 시작했다. 졸업 심사 날짜가 잡혔다.',
    themeColor: '#1E293B',
    sceneContext: [
      '리뷰어의 피드백을 읽으며 복잡한 기분이 든다.',
      '새벽 연구실에서 동기가 건넨 커피가 따뜻하다.',
      '힘든 시기지만 주변의 지지가 느껴진다.',
      '잠시 멈추고 자신을 돌아보는 시간을 갖는다.',
    ],
  },
  {
    number: 6,
    title: '졸업 심사',
    factor: 'O',
    description: '졸업 논문 심사를 앞두고 있다. 지금까지의 연구를 돌아보며, 새로운 분야에 대한 호기심이 생긴다. 심사 후 앞으로의 진로 — 학계, 산업계, 전혀 다른 길 — 의 갈림길에 선다.',
    transitionText: '',
    themeColor: '#EC4899',
    sceneContext: [
      '졸업 심사를 앞두고 지금까지의 여정을 떠올린다.',
      '새로운 분야에 대한 호기심이 피어오른다.',
      '앞으로의 길에 대해 다양한 가능성을 상상해 본다.',
      '어떤 길을 택하든, 이 시간이 의미 있었음을 느낀다.',
    ],
  },
];

export function getEpisodeQuestions(episodeNumber: number): Question[] {
  return QUESTIONS.filter(q => q.episode === episodeNumber);
}
