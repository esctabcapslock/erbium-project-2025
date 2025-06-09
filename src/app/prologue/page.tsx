// src/app/prologue/page.tsx
'use client';

import React from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useGameStore } from '@/store/gameStore'; // Zustand 스토어 임포트

const ProloguePage: React.FC = () => {
//   const router = useRouter();
//   const { setGameStartedFromTitle } = useGameStore(); // isGameStartedFromTitle 상태 변경 함수 가져오기

  // 프롤로그를 처음 방문했을 때만 보여주도록 로직 추가 (선택 사항)
  // 예를 들어, isGameStartedFromTitle이 true일 때만 프롤로그를 보여주고,
  // 이후에는 바로 게임 페이지로 리다이렉트하는 등의 로직을 고려할 수 있습니다.
//   useEffect(() => {
//     // 여기에 필요한 프롤로그 표시 로직을 추가할 수 있습니다.
//     // 예를 들어, 특정 조건(예: 게임 시작 시)에서만 이 페이지로 오도록
//     // Link나 router.push를 사용하는 것이 일반적입니다.
//   }, []);

//   const handleDismiss = () => {
//     // setGameStartedFromTitle(false); // 프롤로그를 봤으니 상태를 false로 변경
//     router.push('/game'); // 게임 페이지로 이동
//   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-white text-center text-lg md:text-xl p-8 leading-relaxed max-w-2xl bg-gray-900 bg-opacity-80 rounded-lg shadow-xl relative border border-gray-700">
        <p className="mb-6 text-gray-200">
          때는 {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일. <br />
          실수로 컴퓨터를 하다가 수상하게 생긴 파일을 발견하고 아무 생각 없이 삭제해버렸다. <br />
          그러나 그 파일은 숫자를 표시하는데 아주 중요한 역할을 하는 파일이었다. <br />
          다행히 &apos;<b>6</b>&lsquo;과 &apos;<b>8</b>&lsquo;이라는 숫자가 남아있었다. <br />
          이 숫자들을 이용해 빠르게 복구하자. <br />
        </p>
        <Link
          href='/game'
          className="btn-retro-primary px-8 py-3 text-lg md:text-xl" // btn-primary 대신 btn-retro-primary 적용
        >
          프롤로그 넘어가기 ➡️
        </Link>
      </div>
    </div>
  );
};

export default ProloguePage;