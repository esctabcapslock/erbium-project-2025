// src/components/Inventory.tsx
import React from 'react';
import { Card as CardType } from '@/lib/types';
import Card from './Card';

interface InventoryProps {
  cards: CardType[];
  onCardSelect: (card: CardType) => void;
}

const Inventory: React.FC<InventoryProps> = ({ cards, onCardSelect }) => {
  // 카드 타입에 따른 정렬 순서 정의
  const typeOrder: { [key: string]: number } = {
    'number': 1,
    'operator': 2,
    'parenthesis': 3,
  };

  // 카드 정렬 함수
  const sortCards = (cardsToSort: CardType[]): CardType[] => {
    return [...cardsToSort].sort((a, b) => {
      // 1. 타입별 정렬
      const typeComparison = typeOrder[a.type] - typeOrder[b.type];
      if (typeComparison !== 0) {
        return typeComparison;
      }

      // 2. 같은 타입 내에서 정렬
      if (a.type === 'number' && b.type === 'number') {
        return (a.value || 0) - (b.value || 0); // 숫자 카드: value 기준 오름차순
      } else {
        return a.label.localeCompare(b.label); // 그 외: label 기준 사전순
      }
    });
  };

  const sortedCards = sortCards(cards);

  return (
    <div className="panel animate-fade-in"> {/* 'panel' 클래스 유지 */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">인벤토리</h3>
      <div className="card-zone inventory-grid">
        {sortedCards.length === 0 ? (
          <p className="text-gray-500 text-base col-span-full text-center">획득한 카드가 없다. 상점에서 카드를 획득할 수 있을 것 같다.</p>
        ) : (
          sortedCards.map((card) => (
            <Card key={card.id} card={card} isClickable={true} onCardClick={onCardSelect} />
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;