import type { Metadata } from "next";
import "./globals.css";
import MuteToggle from "@/components/ui/MuteToggle";

export const metadata: Metadata = {
  title: "HEXACO 대학원생 생존기",
  description: "BHI 24문항 기반 인터랙티브 성격 테스트",
};

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-neutral-950">
      {/* Blur background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Mobile frame */}
      <div className="relative w-full max-w-[430px] min-h-dvh bg-white overflow-hidden">
        <MuteToggle />
        {children}
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
