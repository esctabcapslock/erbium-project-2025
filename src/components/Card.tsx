// src/components/Card.tsx
import React from 'react';
import { Card as CardType } from '@/lib/types';

interface CardProps {
  card: CardType;
  isClickable: boolean;
  onCardClick?: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ card, isClickable, onCardClick }) => {
  const handleClick = () => {
    if (isClickable && onCardClick) {
      onCardClick(card);
    }
  };

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

  return (
    <div
      className={`card-base ${typeClass} ${activeClass}`}
      onClick={handleClick}
    >
      <span className="card-label">{card.label}</span>
      {card.type === 'number' && card.value !== undefined && (
        <span className="card-value">({card.value})</span>
      )}
    </div>
  );
};

export default Card;