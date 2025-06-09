// src/app/shop/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';
import { Card as CardType } from '@/lib/types';
import Card from '@/components/Card';

interface ShopMessagePopupProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const ShopMessagePopup: React.FC<ShopMessagePopupProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  const textColor = type === 'success' ? 'text-green-600' : 'text-red-600'; // Colors similar to your 'Stage Clear!' text

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div> {/* 오버레이 */}

      <div className="relative bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-gray-200 animate-fade-in">
        <h2 className={`text-3xl font-bold ${textColor} mb-4`}>
          {type === 'success' ? '알림' : '오류'}
        </h2> {/* Title for the popup */}
        <p className="text-lg text-gray-700 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="btn-retro-primary w-full" // Use the same button style
        >
          확인
        </button>
      </div>
    </div>
  );
};


const ShopPage: React.FC = () => {
  const { points, shopCards, buyCard, inventory } = useGameStore();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  const handleBuyCard = (cardId: string) => {
    const purchased = buyCard(cardId);
    console.log('purchased--',purchased)
    
    if (purchased) {
      setPopupMessage('카드를 구매했습니다!');
      setPopupType('success');
    } else {
      setPopupMessage('포인트가 부족합니다!');
      setPopupType('error');
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  const getCardCountInInventory = (cardLabel: string, cardType: CardType['type']): number => {
    if (cardType === 'number') {
      const shopCard = shopCards.find(c => c.label === cardLabel && c.type === cardType);
      if (shopCard && shopCard.value !== undefined) {
        return inventory.filter(invCard => invCard.label === cardLabel && invCard.type === cardType && invCard.value === shopCard.value).length;
      }
    }
    return inventory.filter(invCard => invCard.label === cardLabel && invCard.type === cardType).length;
  };

  return (
    <div className="container mx-auto p-4 md:p-8 relative max-w-6xl"> {/* Max width for shop content */}
      {showPopup && (
        <ShopMessagePopup
          message={popupMessage}
          type={popupType}
          onClose={handleClosePopup}
        />
      )}

      <div className="panel mb-6 flex justify-between items-center">
        <Link href="/game" className="btn-retro-secondary text-sm md:text-base">
          게임으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">카드 상점</h1>
        <div className="text-xl font-medium text-gray-700 flex items-center">
          포인트: <span className="font-bold text-green-600 ml-2">{points} P</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Smaller gap */}
        {shopCards.map((card) => (
          <div key={card.id} className="panel p-4 flex flex-col items-center justify-between text-center animate-fade-in">
            <Card card={card} isClickable={false} />
            <p className="text-lg font-semibold text-gray-800 mt-3 mb-1">
              비용: <span className="text-blue-600">{card.currentCost} P</span>
            </p>
            <p className="text-sm text-gray-600 mb-3">
              보유 수량: <span className="font-semibold text-gray-700">{getCardCountInInventory(card.label, card.type)}</span> 개
            </p>
            <button
              onClick={() => handleBuyCard(card.id)}
              className="btn-retro-primary w-full"
              // disabled={points < card.currentCost}
            >
              구매하기
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <Link href="/game" className="btn-retro-secondary text-base">
          게임으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default ShopPage;