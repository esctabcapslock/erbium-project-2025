// src/components/Card.tsx
import React, { useState } from 'react';
import { Card as CardType } from '@/lib/types'; // CardType 임포트

interface CardProps {
  card: CardType;
  isClickable: boolean; // 인벤토리 안에 있는 카드인지, 수식에 있는 카드인지 구분
  onCardClick?: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ card, isClickable, onCardClick }) => {
  const [showTooltip, setShowTooltip] = useState(false); // 툴팁 표시 여부 상태

  const handleClick = () => {
    if (isClickable && onCardClick) {
      onCardClick(card);
    }
  };

  // 툴팁 내용 정의 (description 필드가 없으면 기본 메시지)
  const tooltipContent = card.description || 
                         (card.type === 'number' ? `숫자 ${card.value}를 나타냅니다.` :
                         card.type === 'operator' ? `연산자 '${card.label}' 입니다.` :
                         card.type === 'parenthesis' ? `괄호 '${card.label}' 입니다.` :
                         '이 카드는 특별한 기능을 가지고 있습니다.');


  let typeClass = '';
  let activeClass = '';

  switch (card.type) {
    case 'number':
      typeClass = 'card-number';
      break;
    case 'operator':
      typeClass = 'card-operator';
      break;
    case 'parenthesis':
      typeClass = 'card-parenthesis';
      break;
    default:
      typeClass = 'bg-gray-100 text-gray-800 border-gray-200'; // Default for undefined types
      break;
  }

  if (isClickable) {
    activeClass = 'card-active';
  } else {
    activeClass = 'card-disabled';
  }

  // 터치 디바이스 여부 감지 (간단한 방법)
  // const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleMouseEnter = () => {
    // 인벤토리 카드(isClickable)는 터치 디바이스에서 마우스 오버 툴팁 미표시
    if (!isClickable) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // 터치 이벤트 핸들러: 인벤토리 카드는 터치 시 툴팁 미표시 (바로 클릭)
  const handleTouchStart = () => { // e: React.TouchEvent
    if (isClickable) {
      // 인벤토리 카드는 터치하면 바로 클릭 로직으로 가므로 툴팁을 표시하지 않음
      setShowTooltip(false);
    } else {
      // 수식 카드(isClickable이 false)는 터치 시 툴팁 표시
      setShowTooltip(true);
    }
  };

  const handleTouchEnd = () => {
    // 터치 종료 시 툴팁 숨김
    setShowTooltip(false);
  };


  return (
    <div
      className={`card-base ${typeClass} ${activeClass} relative`} // relative 포지션 추가
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart} // 터치 시작
      onTouchEnd={handleTouchEnd}     // 터치 종료
      onTouchCancel={handleTouchEnd}  // 터치 취소 (예: 스크롤)
    >
      <span className="card-label">{card.label}</span>
      {card.type === 'number' && card.value !== undefined && (
        <span className="card-value">({card.value})</span>
      )}

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 
                        bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap 
                        opacity-95 z-50 animate-fade-in-down">
          {tooltipContent}
          <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 
                          border-l-[5px] border-r-[5px] border-t-[5px] 
                          border-l-transparent border-r-transparent border-t-gray-800"></div> {/* 툴팁 꼬리 */}
        </div>
      )}
    </div>
  );
};

export default Card;