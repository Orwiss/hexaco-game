'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { setDemographics, reset } = useGameStore();
  const [showDemographics, setShowDemographics] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [gradYear, setGradYear] = useState('');

  const handleStart = () => {
    reset();
    setShowDemographics(true);
  };

  const handleSkip = () => {
    router.push('/test/1');
  };

  const handleSubmitDemographics = () => {
    setDemographics({
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      gradYear: gradYear ? parseInt(gradYear) : undefined,
    });
    router.push('/test/1');
  };

  if (showDemographics) {
    return (
      <div className="flex flex-col min-h-dvh p-6 justify-center">
        <h2 className="text-xl font-bold mb-2 text-center">간단한 정보</h2>
        <p className="text-sm text-neutral-400 text-center mb-8">
          연구 목적으로 수집되며, 모두 선택사항입니다
        </p>

        <div className="space-y-5 mb-8">
          <div>
            <label className="text-sm text-neutral-500 mb-1 block">나이</label>
            <input
              type="number"
              placeholder="예: 27"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-base focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-500 mb-2 block">성별</label>
            <div className="flex gap-2">
              {['남성', '여성', '기타', '응답 안 함'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-3 rounded-xl text-sm border-2 transition-colors ${
                    gender === g
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-500 mb-1 block">대학원 몇 년차</label>
            <input
              type="number"
              placeholder="예: 2"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-base focus:outline-none focus:border-neutral-400"
            />
          </div>
        </div>

        <button
          onClick={handleSubmitDemographics}
          className="w-full py-4 bg-neutral-900 text-white rounded-2xl text-lg active:scale-95 transition-transform mb-3"
        >
          시작하기
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-3 text-neutral-400 text-sm active:scale-95 transition-transform"
        >
          건너뛰기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-6 text-center">
      <div className="text-6xl mb-6">🎓</div>
      <h1 className="text-3xl font-bold mb-3">대학원생 생존기</h1>
      <p className="text-lg text-neutral-500 mb-1">HEXACO 성격 테스트</p>
      <p className="text-sm text-neutral-400 mb-8">약 5분 소요 · 24문항</p>

      <p className="text-sm text-neutral-400 max-w-[280px] mb-8 leading-relaxed">
        입학부터 졸업까지, 대학원 생활 속 6개의 에피소드를 경험하며
        나의 성격 유형을 알아보세요.
      </p>

      <button
        onClick={handleStart}
        className="px-10 py-4 bg-neutral-900 text-white rounded-2xl text-lg
                   active:scale-95 transition-transform"
      >
        시작하기
      </button>
    </div>
  );
}
