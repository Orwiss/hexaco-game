# BHI 적용 가이드 — 본 프로젝트에서의 측정 구조

## BHI란?

**Brief HEXACO Inventory** (de Vries, 2013). HEXACO 성격 모델의 초간이 측정 도구.
- 24문항 (6요인 × 4문항)
- 각 하위요인을 딱 1문항으로 측정
- 리커트 5점 척도 (1=전혀 동의 안 함 ~ 5=매우 동의)

---

## 본 프로젝트의 변형

원래 BHI는 "나는 ~하다" 형식의 자기보고 설문이지만, 본 프로젝트에서는 **시나리오 기반 선택형 게임**으로 변환함.

| 구분 | BHI 원래 | 본 프로젝트 |
|------|---------|-----------|
| 문항 형식 | "나는 ~하다" 자기보고 | 상황 속 5개 행동 선택 |
| 척도 | 리커트 5점 직접 응답 | 선택지가 내부적으로 1~5 매핑 |
| 문항 노출 | 문항 텍스트 그대로 표시 | 사용자에게 비노출 |
| 학술 분류 | 표준화된 심리검사 | "BHI 영감 기반 게임형 성격 측정" |

---

## 24문항 원문 + 한국어 번역 + 시나리오 매핑

### EP1: 외향성 (X)

| ID | 하위요인 | BHI 원문 | 한국어 번역 | R | 시나리오 |
|----|---------|---------|-----------|---|---------|
| x1 | 사회적 자존감 | I feel reasonably satisfied with myself overall. | 전반적으로 나 자신에 대해 꽤 만족하는 편이다. | | 옆자리 동기가 말을 건다 → 대화 적극성 |
| x2 | 사회적 대담성 | I rarely express my opinions in group meetings. | 나는 모임에서 내 의견을 거의 말하지 않는다. | **R** | 어디에 앉을까? → 좌석 위치 선택 |
| x3 | 사교성 | I prefer jobs that involve active social interaction to those that involve working alone. | 나는 혼자 일하는 것보다 사람들과 활발히 교류하는 일을 선호한다. | | 자기소개 시간! → 소개 스타일 |
| x4 | 활력 | On most days, I feel cheerful and optimistic. | 대체로 나는 쾌활하고 낙관적인 편이다. | | 뒤풀이 갈래? → 참여 의지 |

### EP2: 성실성 (C)

| ID | 하위요인 | BHI 원문 | 한국어 번역 | R | 시나리오 |
|----|---------|---------|-----------|---|---------|
| c1 | 조직성 | I plan ahead and organize things, to avoid scrambling at the last minute. | 나는 마지막에 허둥대지 않도록 미리 계획하고 정리한다. | | 과제 3개 → 대응 전략 |
| c2 | 근면성 | I often push myself very hard when trying to achieve a goal. | 나는 목표를 달성하려고 할 때 자주 자신을 몰아붙인다. | | 마감 vs 친구 → 우선순위 |
| c3 | 완벽주의 | When working on something, I don't pay much attention to small details. | 일할 때 세세한 부분에 별로 신경 쓰지 않는다. | **R** | 모르는 용어 → 대처 방식 |
| c4 | 신중함 | I make decisions based on the feeling of the moment rather than on careful thought. | 나는 신중한 생각보다 그 순간의 느낌에 따라 결정을 내린다. | **R** | 제출 전 → 검토 수준 |

### EP3: 우호성 (A)

| ID | 하위요인 | BHI 원문 | 한국어 번역 | R | 시나리오 |
|----|---------|---------|-----------|---|---------|
| a1 | 용서 | My attitude toward people who have treated me badly is "forgive and forget." | 나에게 잘못한 사람에 대한 나의 태도는 "용서하고 잊자"이다. | | 선배가 내 아이디어 도용 → 반응 |
| a2 | 온화함 | I tend to be lenient in judging other people. | 나는 다른 사람을 판단할 때 관대한 편이다. | | 후배 코딩 실수 → 반응 |
| a3 | 유연성 | Even when people make a lot of mistakes, I rarely say anything negative. | 다른 사람이 실수를 많이 해도, 나는 부정적인 말을 거의 하지 않는다. | | 동기와 분석 방법 충돌 → 대응 |
| a4 | 인내 | People sometimes tell me that I am too critical of others. | 사람들이 가끔 내가 다른 사람에게 너무 비판적이라고 말한다. | **R** | 선배 업무 부탁 → 수용도 |

### EP4: 정직-겸손 (H)

| ID | 하위요인 | BHI 원문 | 한국어 번역 | R | 시나리오 |
|----|---------|---------|-----------|---|---------|
| h1 | 진실성 | I wouldn't pretend to like someone just to get that person to do favors for me. | 나는 누군가에게 부탁할 일이 있다고 해서 그 사람을 좋아하는 척하지는 않을 것이다. | | 유명 교수님 관심 → 설명 방식 |
| h2 | 공정성 | If I knew that I could never get caught, I would be willing to steal a million dollars. | 절대 들키지 않는다면, 나는 10억 원을 기꺼이 훔칠 의향이 있다. | **R** | 애매한 데이터 → 처리 방식 |
| h3 | 탐욕 회피 | Having a lot of money is not especially important to me. | 돈이 많은 것은 나에게 특별히 중요하지 않다. | | 연구비 자랑에 대한 반응 |
| h4 | 겸손 | I think that I am entitled to more respect than the average person is. | 나는 보통 사람보다 더 많은 존중을 받을 자격이 있다고 생각한다. | **R** | "전문가시네요" 추켜세움 → 반응 |

### EP5: 정서성 (E)

| ID | 하위요인 | BHI 원문 | 한국어 번역 | R | 시나리오 |
|----|---------|---------|-----------|---|---------|
| e1 | 두려움 | I would feel afraid if I had to travel in bad weather conditions. | 악천후에 여행해야 한다면 두려움을 느낄 것이다. | | 혼자 야간 실험 → 감정 |
| e2 | 불안 | I sometimes can't help worrying about little things. | 나는 가끔 사소한 일도 걱정을 멈출 수가 없다. | | 내일 발표 PPT 미완 → 걱정 수준 |
| e3 | 의존성 | I can handle difficult situations without needing emotional support from anyone else. | 나는 다른 사람의 정서적 지지 없이도 어려운 상황을 다룰 수 있다. | **R** | 리젝 이메일 → 대처 방식 |
| e4 | 감수성 | I feel strong emotions when someone close to me is going away for a long time. | 가까운 사람이 오랫동안 떠나게 되면 강한 감정을 느낀다. | | 동기 졸업 → 감정 반응 |

### EP6: 개방성 (O)

| ID | 하위요인 | BHI 원문 | 한국어 번역 | R | 시나리오 |
|----|---------|---------|-----------|---|---------|
| o1 | 미적 감상 | I would be quite bored by a visit to an art gallery. | 미술관을 방문하면 꽤 지루할 것 같다. | **R** | 주말 계획 → 활동 선택 |
| o2 | 호기심 | I'm interested in learning about the history and politics of other countries. | 나는 다른 나라의 역사와 정치에 대해 배우는 것에 관심이 있다. | | 다른 분야 세미나 → 참여 의지 |
| o3 | 창의성 | I would enjoy creating a work of art, such as a novel, a song, or a painting. | 소설, 노래, 그림 같은 예술 작품을 만드는 것을 즐길 것이다. | | 졸업 후 진로 → 선택 경향 |
| o4 | 비관습성 | People have sometimes called me "weird" or "eccentric." | 사람들이 가끔 나를 "이상하다" 또는 "별나다"고 부른 적이 있다. | | "특이하다"는 말 → 감정 반응 |

---

## 역채점 문항 정리

총 **8개**: h2, h4, e3, x2, a4, c3, c4, o1

본 프로젝트에서는 선택지 자체에 점수가 매핑되어 있으므로 별도 역채점 처리 없이 선택 = 점수. 단, DB 저장 시 BHI 원래 방향과 일치하도록 정규화.

---

## 한국어 번역 수정 사항

| 문항 | 원래 번역 문제 | 수정 후 |
|------|-------------|--------|
| e2 | 삼중 부정 ("걱정하지 않을 수가 없을 때가 있다") | "가끔 사소한 일도 걱정을 멈출 수가 없다" |
| h2 | "100만 달러" — 한국 맥락 부적합 | "10억 원" |
| a4 | "of others" 누락 | "다른 사람에게" 추가 |
| x4 | "대부분의 날" — 번역투 | "대체로" |
| h4 | "존경" — 유교적 뉘앙스 과다 | "존중" |
| o1 | "미술관에" — 조사 오류 | "미술관을" |

---

## 채점 공식

```
1. 요인 점수 = 4문항 평균 (1.0 ~ 5.0)
2. 정규화 = (요인 점수 - 1) / 4 × 100  →  0~100%
3. 프로필 분화도 = stddev(6개 요인 점수)
4. 분화도 < 0.816 → 균형형 (T9)
5. 분화도 ≥ 0.816 → 가중 매칭 점수로 9개 유형 중 배정
```

**가중 매칭**: `score = Σ(weight × (요인점수 - 3.0)) / Σ(|weight|)`

---

## 학술적 한계 및 면책

1. **BHI 원도구 아님**: 시나리오 선택형으로 변환했으므로 "BHI 기반 영감을 받은 게임형 측정"
2. **간이 척도 신뢰도**: 요인당 4문항, α = .48~.60 — 전문 검사 대체 불가
3. **프라이밍 효과**: 에피소드 장면이 응답에 영향 줄 수 있음 (Ep5 완화 조치 적용됨)
4. **번역 미검증**: 번역-역번역 절차 미실시. 논문 제출 전 검증 필요
5. **결과는 경향성**: 확정적 유형이 아닌 성격 경향으로 해석해야 함

---

## 참고 문헌

- de Vries, R. E. (2013). The 24-item Brief HEXACO Inventory (BHI). *Journal of Research in Personality*, 47(6), 871-880.
