// src/lib/constants.ts
import { Card, CardType, Stage } from './types';

export const INITIAL_INVENTORY_CARDS: Card[] = []

export const ALL_SHOP_CARDS: Card[] = [
  // 숫자 카드 기본값
  { id: 'num_6', type: CardType.NUMBER, value: 6, label: '6', initialCost: 0, currentCost: 0 },
  { id: 'num_8', type: CardType.NUMBER, value: 8, label: '8', initialCost: 0, currentCost: 0 },

  // 연산
{ id: 'plus', type: CardType.OPERATOR, label: '+', initialCost: 1, currentCost: 1 },
  { id: 'minus', type: CardType.OPERATOR, label: '-', initialCost: 1, currentCost: 1 },
  { id: 'multiply', type: CardType.OPERATOR, label: 'x', initialCost: 5, currentCost: 5 },
  { id: 'divide', type: CardType.OPERATOR, label: '÷', initialCost: 10, currentCost: 10 },
  { id: 'open_paren', type: CardType.PARENTHESIS, label: '(', initialCost: 10, currentCost: 10 },
  { id: 'close_paren', type: CardType.PARENTHESIS, label: ')', initialCost: 10, currentCost: 10 },
  { id: 'power', type: CardType.POWER, label: '^', initialCost: 20, currentCost: 20 },

  // 추가된 연산자 카드
  { id: 'factorial', type: CardType.OPERATOR, label: '!', initialCost: 20, currentCost: 20 }, // 팩토리얼
  { id: 'remainder', type: CardType.OPERATOR, label: '%', initialCost: 7, currentCost: 7 }, // 나머지
  { id: 'round', type: CardType.OPERATOR, label: 'round', initialCost: 10, currentCost: 10 }, // 반올림
  { id: 'abs', type: CardType.OPERATOR, label: 'abs', initialCost: 12, currentCost: 12 },     // 절댓값
  { id: 'floor', type: CardType.OPERATOR, label: 'floor', initialCost: 12, currentCost: 12 }, // 내림
  { id: 'ceil', type: CardType.OPERATOR, label: 'ceil', initialCost: 12, currentCost: 12 },   // 올림


  // ...
];

export const stages: Stage[] = [
  {
    id: 'stage_1',
    targetNumber: 6, // 6 또는 8
    description: "연습문제",
    cardLimit: 1, // 6이나 8 단일 카드 사용
    rewardPoints: 1,
  },
  {
    id: 'stage_2',
    targetNumber: 14, // 6 + 8
    description: "간단한 문제",
    cardLimit: 3,
    rewardPoints: 2,
  },
  {
    id: 'stage_3',
    targetNumber: 2, // 6 - 8
    description: "간단한 문제2",
    cardLimit: 3,
    rewardPoints: 10,
  },
  {
    id: 'stage_4',
    targetNumber: 48, // 6 x 8
    description: "간단한 문제 3",
    cardLimit: 3,
    rewardPoints: 10,
  },
  {
    id: 'stage_4',
    targetNumber: 1, // 6/6
    description: "간단한 문제 4",
    cardLimit: 3,
    rewardPoints: 20,
  },
  {
    id: 'stage_5',
    targetNumber: 36, // 6^2
    description: "간단한 문제 5",
    cardLimit: 3,
    rewardPoints: 20,
  },
  {
    id: 'stage_6',
    targetNumber: 3, // 8-6+6/6
    description: "간단한 문제 6",
    cardLimit: 7,
    rewardPoints: 20,
  },
  {
    id: 'stage_7',
    targetNumber: 720, // 7!
    description: "간단한 문제 7",
    cardLimit: 2,
    rewardPoints: 20,
  },
  {
    id: 'stage_8',
    targetNumber: 68,
    description: "최종",
    cardLimit: 11,
    rewardPoints: 10, // 최종 스테이지는 보상 대폭 증가
  },
  // 더 많은 스테이지 추가...
];