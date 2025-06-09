// src/app/game/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { stages } from '@/lib/constants';
import { Card as CardType } from '@/lib/types';
import { evaluateExpression, isValidExpression, buildExpressionString, calculateCurrentCardCount } from '@/lib/gameLogic';
import Inventory from '@/components/Inventory';
import Card from '@/components/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 스테이지 클리어 팝업
interface CompletionPopupProps {
  timeTaken: number;
  pointsEarned: number;
  onConfirm: () => void;
  isFinalStage: boolean;
}

const CompletionPopup: React.FC<CompletionPopupProps> = ({
  timeTaken, pointsEarned, onConfirm, isFinalStage
}) => {
  const minutes = Math.floor(timeTaken / 60000);
  const seconds = ((timeTaken % 60000) / 1000).toFixed(1);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onConfirm}></div> {/* 오버레이 */}

      <div className="relative bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-gray-200 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          스테이지 클리어!
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          클리어 소요 시간: <span className="font-semibold text-blue-600">{minutes}분 {seconds}초</span>
        </p>
        <p className="text-lg text-gray-700 mb-6">
          획득 포인트: <span className="font-semibold text-green-600">{pointsEarned} P</span>
        </p>
        <button
          onClick={onConfirm}
          className="btn-retro-primary w-full"
        >
          {isFinalStage ? '최종 결과 보기' : '다음 스테이지 진행'}
        </button>
      </div>
    </div>
  );
};


const GamePage: React.FC = () => {
  const router = useRouter();

  const {
    points,
    inventory,
    currentStageIndex,
    currentExpression,
    addPoints,
    selectCardForExpression,
    resetExpression,
    nextStage,
    resetGame,
    currentStageStartTime,
    setCurrentStageStartTime,
    addTimeToTotal,
  } = useGameStore();

  const currentStage = stages[currentStageIndex];
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [tooltipType, setTooltipType] = useState<'success' | 'error'>('error');

  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [completionPoints, setCompletionPoints] = useState(0);

  useEffect(() => {
    setCurrentStageStartTime(Date.now());

  }, [currentStageIndex, setCurrentStageStartTime]);


  const showTemporaryTooltip = (message: string, type: 'success' | 'error' = 'error') => {
    setTooltipMessage(message);
    setTooltipType(type);
    setShowTooltip(true);
    const timer = setTimeout(() => {
      setShowTooltip(false);
      setTooltipMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  };


  // const handleDismissPrologue = () => {
  //   setGameStartedFromTitle(false);
  // };

  const handleGoToMainMenu = () => {
    if (confirm('게임을 포기하고 메인 메뉴로 돌아가시겠습니까? 현재 진행 상황은 초기화됩니다.')) {
      resetGame();
      router.push('/');
    }
  };

  const currentCardCount = calculateCurrentCardCount(currentExpression);


  if (!currentStage) {
    return (
      <div className="container mx-auto p-8 text-center panel mt-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">모든 미션 완료!</h1>
        <p className="text-lg text-gray-700">숫자 세계에 평화를 되찾았습니다!</p>
        <p className="mt-4 text-xl font-semibold">최종 포인트: <span className="text-blue-600">{points}</span> P</p>
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleGoToMainMenu}
            className="btn-retro-secondary"
          >
            처음으로 돌아가기
          </button>
          <button
            onClick={() => { resetGame(); router.push('/game'); }}
            className="btn-retro-primary"
          >
            다시 시작하기
          </button>
        </div>
      </div>
    );
  }

  const handleCardSelect = (card: CardType) => {
    const cardExistsInInventory = inventory.some(invCard => invCard.id === card.id);

    if (!cardExistsInInventory) {
      showTemporaryTooltip('이미 사용했거나 존재하지 않는 카드입니다.');
      return;
    }

    if (currentCardCount < currentStage.cardLimit) {
      selectCardForExpression(card);
      setShowTooltip(false);
    } else {
      showTemporaryTooltip(`카드 사용 개수 제한 (${currentStage.cardLimit}개)을 초과했어요.`);
    }
  };

  const handleCheckAnswer = () => {
    if (!isValidExpression(currentExpression)) {
      showTemporaryTooltip('수식이 올바르지 않아요. 다시 확인해 보세요!');
      return;
    }

    let result: number | null = null;
    try {
      result = evaluateExpression(currentExpression);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showTemporaryTooltip(`계산 오류: ${e.message}`);
      }else{
        showTemporaryTooltip(`계산 오류: ${e}`);
      }
      return;
    }

    const expressionString = buildExpressionString(currentExpression);
    const timeTaken = Date.now() - currentStageStartTime;
    addTimeToTotal(timeTaken);

    if (currentStage.id === 'stage_1') {
      if (result === 6 ) {
        addPoints(currentStage.rewardPoints);
        setCompletionTime(timeTaken);
        setCompletionPoints(currentStage.rewardPoints);
        setShowCompletionPopup(true);
      } else {
        showTemporaryTooltip(`아쉽지만 6 또는 8이 아니네요. (${expressionString} = ${result})`);
      }
    } else {
      if (result === currentStage.targetNumber) {
        addPoints(currentStage.rewardPoints);
        setCompletionTime(timeTaken);
        setCompletionPoints(currentStage.rewardPoints);
        setShowCompletionPopup(true);
      } else {
        showTemporaryTooltip(`아쉽지만 ${currentStage.targetNumber}이 아니네요. (${expressionString} = ${result})`);
      }
    }
  };

  const handleReset = () => {
    resetExpression();
    setShowTooltip(false);
  };

  const handleConfirmNextStage = () => {
    console.log('--handleConfirmNextStage-- ', currentStageIndex, stages)
    setShowCompletionPopup(false);
    resetExpression();
    if (currentStageIndex === stages.length - 1) {
      router.push('/ending'); // 모든 스테이지 완료 시 게임 종료 화면으로
    } else {
      nextStage();
      setCurrentStageStartTime(Date.now());
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 relative max-w-4xl">

      {showCompletionPopup && (
        <CompletionPopup
          timeTaken={completionTime}
          pointsEarned={completionPoints}
          onConfirm={handleConfirmNextStage}
          isFinalStage={currentStageIndex === stages.length - 1}
        />
      )}

      {showTooltip && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-3 rounded-md shadow-md text-white text-center z-50 animate-fade-in-down ${tooltipType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {tooltipMessage}
        </div>
      )}

      <div className="panel mb-6 flex justify-between items-center">
        <div className="text-xl font-medium text-gray-700 flex items-center">
          포인트: <span className="font-bold text-green-600 ml-2">{points} P</span>
        </div>
        <div className="flex space-x-2">
          <Link href="/shop" className="btn-retro-secondary text-sm md:text-base">
            카드 상점
          </Link>
          <button
            onClick={handleGoToMainMenu}
            className="btn-retro-tertiary text-sm md:text-base"
          >
            게임 종료
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="panel">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
            스테이지 {currentStageIndex + 1}
          </h2>
          <p className="text-base text-gray-700 text-center mb-3">{currentStage.description}</p>
          <div className="text-3xl font-bold text-center text-blue-700 my-4 bg-gray-100 p-2 rounded-md border border-gray-200">
            목표 숫자: {currentStage.targetNumber}
          </div>
          <p className="text-sm text-gray-600 text-center">
            카드 사용: <span className="font-semibold text-blue-600">{currentCardCount}</span> / {currentStage.cardLimit}
          </p>
        </div>

        <Inventory cards={inventory} onCardSelect={handleCardSelect} />
      </div>

      <div className="mt-6 panel animate-slide-in-up">
        <h3 className="text-2xl font-bold mb-3 text-gray-800 text-center">나의 수식</h3>
        <div className="card-zone">
          {currentCardCount === 0 ? (
            <p className="text-gray-500 text-base">인벤토리에서 카드를 선택하여 수식을 만들어보세요.</p>
          ) : (
            currentExpression.map((card, index) => (
              <Card key={card.id + '_' + index} card={card} isClickable={false} />
            ))
          )}
        </div>
        <div className="mt-6 flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-3">
          <button
            onClick={handleCheckAnswer}
            className="btn-retro-primary"
            disabled={currentCardCount === 0}
          >
            정답 확인
          </button>
          <button
            onClick={handleReset}
            className="btn-retro-secondary"
          >
            수식 초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;