import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'tailwindcss'
import "@/styles/globals.css"; // 전역 CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "68 빌런과 숫자 세상의 위기",
  description: "숫자 퍼즐 웹 게임",
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/*
        PC 중앙 정렬을 위해 body에 flexbox 속성 적용.
        기존의 min-h-screen, flex, flex-col, items-center, justify-center를
        여기서 전역으로 설정하여 모든 페이지가 중앙 정렬될 수 있도록 합니다.
        (단, 모든 페이지에 중앙 정렬을 원치 않는다면, game/page.tsx에서
         필요한 부분만 flex 속성을 제거해야 할 수 있습니다.)
      */}
      <body className={`${inter.className} min-h-screen flex flex-col items-center justify-center bg-gray-100`}>
        {children}
      </body>
    </html>
  );
}