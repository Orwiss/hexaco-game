'use client';

import { useCallback, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface ShareButtonsProps {
  shareAreaId: string;
  typeName: string;
}

export default function ShareButtons({ shareAreaId, typeName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleDownloadImage = useCallback(async () => {
    setGenerating(true);
    try {
      // Capture everything above the buttons
      const target = document.getElementById(shareAreaId)?.parentElement;
      if (!target) return;

      const canvas = await html2canvas(target, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 430,
        windowWidth: 430,
      });

      const link = document.createElement('a');
      link.download = `hexaco-${typeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('이미지 생성에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  }, [shareAreaId, typeName]);

  const handleShare = useCallback(async () => {
    const url = window.location.origin;
    const text = `나의 대학원생 유형: ${typeName}! HEXACO 성격 테스트로 알아보세요 🎓`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'HEXACO 대학원생 생존기', text, url });
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: clipboard
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [typeName]);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="space-y-3">
      <button
        onClick={handleDownloadImage}
        disabled={generating}
        className="w-full py-3 border-2 border-neutral-200 rounded-2xl text-neutral-700 active:scale-95 transition-transform disabled:opacity-50"
      >
        {generating ? '생성 중...' : '결과 이미지 저장'}
      </button>
      <button
        onClick={handleShare}
        className="w-full py-3 border-2 border-neutral-200 rounded-2xl text-neutral-700 active:scale-95 transition-transform"
      >
        {copied ? '복사됨!' : '공유하기'}
      </button>
      <button
        onClick={handleCopyLink}
        className="w-full py-3 text-neutral-400 text-sm active:scale-95 transition-transform"
      >
        {copied ? '링크 복사됨!' : '링크 복사'}
      </button>
    </div>
  );
}
