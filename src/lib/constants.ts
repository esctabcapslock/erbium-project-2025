// src/lib/constants.ts
import { Card, CardType, Stage } from './types';

export const INITIAL_INVENTORY_CARDS: Card[] = []

export const ALL_SHOP_CARDS: Card[] = [
  // 숫자 카드 기본값
  { id: 'num_6', type: CardType.NUMBER, value: 6, label: '6', initialCost: 1, currentCost: 1, purchaseCount: 0, description:'숫자 6' },
  { id: 'num_8', type: CardType.NUMBER, value: 8, label: '8', initialCost: 1, currentCost: 1, purchaseCount: 0, description:'숫자 8' },

  // 연산
  { id: 'plus', type: CardType.OPERATOR, label: '+', initialCost: 1, currentCost: 1, purchaseCount: 0, description: "덧셈"  },
  { id: 'minus', type: CardType.OPERATOR, label: '-', initialCost: 2, currentCost: 2, purchaseCount: 0, description: "뺄셈"  },
  { id: 'multiply', type: CardType.OPERATOR, label: 'x', initialCost: 5, currentCost: 5, purchaseCount: 0, description: "곱셈"  },
  { id: 'divide', type: CardType.OPERATOR, label: '÷', initialCost: 10, currentCost: 10, purchaseCount: 0, description: "나눗셈"  },
  { id: 'open_paren', type: CardType.PARENTHESIS, label: '(', initialCost: 10, currentCost: 10, purchaseCount: 0, description: "여는 괄호. 사용시 0.5장으로 카운트"  },
  { id: 'close_paren', type: CardType.PARENTHESIS, label: ')', initialCost: 10, currentCost: 10, purchaseCount: 0, description: "닫는 괄호. 사용시 0.5장으로 카운트"  },
  { id: 'power', type: CardType.OPERATOR, label: '**', initialCost: 30, currentCost: 30, purchaseCount: 0, description: "거듭제곱 연산. (예시: 6**8 = 1679616)"  },

  // 추가된 연산자 카드
  { id: 'factorial', type: CardType.OPERATOR, label: '!', initialCost: 40, currentCost: 40, purchaseCount: 0, description: "펙토리얼 연산. (예시: 8! = 40320)"  }, // 팩토리얼
  { id: 'remainder', type: CardType.OPERATOR, label: '%', initialCost: 60, currentCost: 60, purchaseCount: 0, description: "나머지 연산. (예시: 8%6 = 2)"  }, // 나머지
  { id: 'round', type: CardType.OPERATOR, label: 'round', initialCost: 100, currentCost: 100, purchaseCount: 0, description: "반올림 연산 (미구현)"  }, // 반올림
  { id: 'abs', type: CardType.OPERATOR, label: 'abs', initialCost: 100, currentCost: 100, purchaseCount: 0, description: "절댓값 연산 (미구현)"  },     // 절댓값
  { id: 'floor', type: CardType.OPERATOR, label: 'floor', initialCost: 100, currentCost: 100, purchaseCount: 0, description: "내림 연산 (미구현)"  }, // 내림
  { id: 'ceil', type: CardType.OPERATOR, label: 'ceil', initialCost: 100, currentCost: 100, purchaseCount: 0, description: "올림 연산 (미구현)"  },   // 올림


  // ...
];

export const stages: Stage[] = [
  // {
  //   id: 'stage_0',
  //   targetNumber: 0, // 6 또는 8
  //   description: "개발용",
  //   cardLimit: 10000, // 6이나 8 단일 카드 사용
  //   rewardPoints: 100000,
  // },
  {
    id: 'stage_1',
    targetNumber: 6, // 6 또는 8
    description: "연습문제",
    cardLimit: 1, // 6이나 8 단일 카드 사용
    rewardPoints: 2,
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
    rewardPoints: 5,
  },
  {
    id: 'stage_4',
    targetNumber: 48, // 6 x 8
    description: "간단한 문제 3",
    cardLimit: 3,
    rewardPoints: 5,
  },
  {
    id: 'stage_5',
    targetNumber: 36, // 6*6
    description: "간단한 문제 4",
    cardLimit: 3,
    rewardPoints: 7,
  },
  {
    id: 'stage_6',
    targetNumber: 1, // 6/6
    description: "간단한 문제 5",
    cardLimit: 3,
    rewardPoints: 7,
  },
  {
    id: 'stage_7',
    targetNumber: 3, // 8-6+6/6
    description: "난이도 있는 문제 1",
    cardLimit: 7,
    rewardPoints: 8,
  },
  {
    id: 'stage_8',
    targetNumber: 4, // 8+8-6-6
    description: "난이도 있는 문제 2",
    cardLimit: 7,
    rewardPoints: 10,
  },
  {
    id: 'stage_9',
    targetNumber: 27, // 6*6*6/8
    description: "난이도 있는 문제 3",
    cardLimit: 7,
    rewardPoints: 20,
  },
  {
    id: 'stage_10',
    targetNumber: 100, // 6*6+8*8
    description: "난이도 있는 문제 4",
    cardLimit: 7,
    rewardPoints: 20,
  },
  {
    id: 'stage_11',
    targetNumber: 720, // 7!
    description: "어려운 문제 1",
    cardLimit: 2,
    rewardPoints: 30,
  },
  {
    id: 'stage_12',
    targetNumber: 712, // 7!-8
    description: "어려운 문제 2",
    cardLimit: 4,
    rewardPoints: 30,
  },
  {
    id: 'stage_13',
    targetNumber: 68,
    description: "불가능한 문제",
    cardLimit: 7,
    rewardPoints: 50, // 최종 스테이지는 보상 대폭 증가
  },
  // 더 많은 스테이지 추가...
];