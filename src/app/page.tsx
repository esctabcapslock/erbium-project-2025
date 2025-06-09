// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import {TEAM_NAME} from '@/lib/data'
 
const HomePage: React.FC = () => {
  const { resetGame, startGameTimer } = useGameStore();

  const handleStartGame = () => {
    resetGame();
    // setGameStartedFromTitle(true);
    startGameTimer();
  };

  return (
    <div className="relative w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg text-center z-10 border border-gray-200 animate-fade-in">
      {/* 게임 타이틀 */}
      <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          에르븀 프로젝트 - 2025
      </h1>

      {/* 게임 설명 */}
      <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-700">
        흩어진 숫자와 연산 카드를 조합하여 목표를 만들어보자. <br />
        논리력과 계산력을 활용해 스테이지를 클리어하고 포인트를 획득하여보자.
      </p>

      {/* 게임 시작 버튼 */}
      <Link href="/prologue" passHref>
        <button
          onClick={handleStartGame}
          className="btn-retro-primary text-xl px-10 py-4 font-semibold animate-pulse-once" // btn-primary 대신 btn-retro-primary 적용
        >
          게임 시작
        </button>
      </Link>

      {/* 저작권 정보 */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025.06 {TEAM_NAME}. All rights reserved.</p>
        <p className="mt-1">Powered by Next.js</p>
      </footer>
    </div>
  );
};

export default HomePage;