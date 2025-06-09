// src/app/ending/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { TEAM_NAME } from '@/lib/data';

const EndingPage: React.FC = () => {
  const { totalTimePlayed, points, resetGame } = useGameStore();
  const [displayTotalTime, setDisplayTotalTime] = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    // 총 시간 계산 (밀리초를 분/초로)
    // const minutes = Math.floor(totalTimePlayed / 60000);
    // const seconds = ((totalTimePlayed % 60000) / 1000).toFixed(1);
    setDisplayTotalTime(totalTimePlayed);
    setDisplayPoints(points);

    // 엔딩 페이지 진입 시 게임 상태 초기화 (옵션)
    // 만약 엔딩 페이지에서 "다시 시작" 버튼을 누를 때만 초기화하고 싶다면 이 줄을 주석 처리하세요.
    // resetGame(); 
  }, [totalTimePlayed, points, resetGame]);

  const handleRestartGame = () => {
    resetGame(); // 게임 상태 초기화
  };

  const finalMinutes = Math.floor(displayTotalTime / 60000);
  const finalSeconds = ((displayTotalTime % 60000) / 1000).toFixed(1);


  return (
    <div className="container mx-auto p-4 md:p-8 relative max-w-2xl min-h-screen flex items-center justify-center">
      <div className="panel text-center animate-fade-in p-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 drop-shadow-md">
          게임 클리어! 🎉
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-4">
        끝내 숫자를 복구하는 데 성공했다! <br />
        컴퓨터 세계의 평화를 지키는 데 성공했다.
        </p>

        <div className="my-8 space-y-3">
          <p className="text-lg md:text-xl font-semibold text-gray-700">
            총 소요 시간: <span className="font-extrabold text-blue-700">{finalMinutes}분 {finalSeconds}초</span>
          </p>
          <p className="text-lg md:text-xl font-semibold text-gray-700">
            최종 획득 포인트: <span className="font-extrabold text-green-700">{displayPoints} P</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
          <Link href="/" passHref>
            <button
              onClick={handleRestartGame} // 메인으로 갈 때도 초기화
              className="btn-retro-primary text-lg md:text-xl"
            >
              메인으로 돌아가기
            </button>
          </Link>
          <Link href="/game" passHref>
            <button
              onClick={handleRestartGame} // 다시 시작할 때도 초기화
              className="btn-retro-secondary text-lg md:text-xl"
            >
              다시 플레이하기
            </button>
          </Link>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025.06 {TEAM_NAME}. All rights reserved.</p>
          <p className="mt-1">Thanks for playing!</p>
        </footer>
      </div>
    </div>
  );
};

export default EndingPage;