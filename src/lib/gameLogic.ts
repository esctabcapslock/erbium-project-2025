// src/lib/gameLogic.ts
import { Card, CardType } from './types';

// 연산자 우선순위 및 결합성 정의
const OPERATORS: { [key: string]: { precedence: number; associativity: 'left' | 'right'; arity: number; } } = {
  '+': { precedence: 2, associativity: 'left', arity: 2 },
  '-': { precedence: 2, associativity: 'left', arity: 2 },
  'x': { precedence: 3, associativity: 'left', arity: 2 },
  '÷': { precedence: 3, associativity: 'left', arity: 2 },
  '%': { precedence: 3, associativity: 'left', arity: 2 }, // 나머지
  '^': { precedence: 4, associativity: 'right', arity: 2 }, // 거듭제곱은 우측 결합성
  '!': { precedence: 5, associativity: 'right', arity: 1 }, // 팩토리얼 (단항 연산자)
  'abs': { precedence: 5, associativity: 'right', arity: 1 }, // 절댓값 (단항 연산자)
  'round': { precedence: 5, associativity: 'right', arity: 1 }, // 반올림 (단항 연산자)
  'floor': { precedence: 5, associativity: 'right', arity: 1 }, // 내림 (단항 연산자)
  'ceil': { precedence: 5, associativity: 'right', arity: 1 }, // 올림 (단항 연산자)
};

// 팩토리얼 계산 함수 (재귀)
const factorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('팩토리얼은 0 이상의 정수에 대해서만 계산할 수 있습니다.');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
};

/**
 * 중위 표기법(Infix Notation)으로 구성된 Card 배열을 역폴란드 표기법(RPN)으로 변환합니다.
 * Shunting-yard Algorithm 기반.
 */
export const toRPN = (expressionCards: Card[]): Card[] => {
  const outputQueue: Card[] = [];
  const operatorStack: Card[] = [];

  for (const token of expressionCards) {
    if (token.type === CardType.NUMBER) {
      outputQueue.push(token);
    } else if (token.type === CardType.OPERATOR) {
      const o1 = token;
      // 팩토리얼과 같은 단항 연산자는 바로 스택에 푸시
      if (['!', 'abs', 'round', 'floor', 'ceil'].includes(o1.label)) {
        operatorStack.push(o1);
        continue;
      }
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === CardType.OPERATOR &&
        operatorStack[operatorStack.length - 1].label !== '(' &&
        (
          (OPERATORS[o1.label].associativity === 'left' && OPERATORS[o1.label].precedence <= OPERATORS[operatorStack[operatorStack.length - 1].label].precedence) ||
          (OPERATORS[o1.label].associativity === 'right' && OPERATORS[o1.label].precedence < OPERATORS[operatorStack[operatorStack.length - 1].label].precedence)
        )
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(o1);
    } else if (token.label === '(') {
      operatorStack.push(token);
    } else if (token.label === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].label !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0 || operatorStack[operatorStack.length - 1].label !== '(') {
        throw new Error('괄호가 올바르게 짝지어지지 않았습니다.');
      }
      operatorStack.pop(); // '(' 제거
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op.label === '(' || op.label === ')') {
      throw new Error('괄호가 올바르게 짝지어지지 않았습니다.');
    }
    outputQueue.push(op);
  }

  return outputQueue;
};

/**
 * 역폴란드 표기법(RPN)으로 변환된 Card 배열을 계산합니다.
 */
export const evaluateRPN = (rpnExpression: Card[]): number => {
  const stack: number[] = [];

  for (const token of rpnExpression) {
    if (token.type === CardType.NUMBER) {
      stack.push(token.value!);
    } else if (token.type === CardType.OPERATOR) {
      const opInfo = OPERATORS[token.label];
      if (!opInfo) {
        throw new Error(`알 수 없는 연산자: ${token.label}`);
      }

      if (opInfo.arity === 2) { // 이항 연산자
        if (stack.length < 2) {
          throw new Error(`이항 연산자 ${token.label}에 충분한 피연산자가 없습니다. (예: 5 + )`);
        }
        const b = stack.pop()!;
        const a = stack.pop()!;
        let result: number;
        switch (token.label) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case 'x': result = a * b; break;
          case '÷':
            if (b === 0) throw new Error('0으로 나눌 수 없습니다.');
            result = a / b;
            break;
          case '%':
            if (b === 0) throw new Error('0으로 나눌 수 없습니다 (나머지 연산).');
            result = a % b;
            break;
          case '^': result = Math.pow(a, b); break;
          default: throw new Error(`알 수 없는 이항 연산자: ${token.label}`);
        }
        stack.push(result);
      } else if (opInfo.arity === 1) { // 단항 연산자
        if (stack.length < 1) {
          throw new Error(`단항 연산자 ${token.label}에 충분한 피연산자가 없습니다. (예: ! )`);
        }
        const a = stack.pop()!;
        let result: number;
        switch (token.label) {
          case '!': result = factorial(a); break;
          case 'abs': result = Math.abs(a); break;
          case 'round': result = Math.round(a); break;
          case 'floor': result = Math.floor(a); break;
          case 'ceil': result = Math.ceil(a); break;
          default: throw new Error(`알 수 없는 단항 연산자: ${token.label}`);
        }
        stack.push(result);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('수식 형식이 올바르지 않습니다. (예: 5 + 3 2)');
  }

  return stack[0];
};

/**
 * 사용자에게 보여줄 수식 문자열을 만듭니다.
 * 단항 연산자는 해당 숫자에 적절히 붙도록 개선합니다.
 */
export const buildExpressionString = (cards: Card[]): string => {
  const expressionTokens: string[] = [];

  for (const card of cards) {
    if (card.type === CardType.NUMBER) {
      expressionTokens.push(card.label);
    } else if (card.type === CardType.OPERATOR) {
      const isUnary = ['!', 'abs', 'round', 'floor', 'ceil'].includes(card.label);
      if (isUnary) {
        if (card.label === '!') {
          // 팩토리얼은 숫자 바로 뒤에 붙음
          if (expressionTokens.length > 0) {
            expressionTokens[expressionTokens.length - 1] += card.label;
          } else {
            expressionTokens.push(card.label); // 오류 상황 (시작부터 !만 오는 경우)
          }
        } else {
          // 함수 형태의 단항 연산자 (abs, round 등)
          expressionTokens.push(`${card.label}(`);
        }
      } else {
        // 이항 연산자는 공백 추가
        expressionTokens.push(` ${card.label} `);
      }
    } else if (card.type === CardType.PARENTHESIS) {
      expressionTokens.push(card.label);
      if (card.label === ')') {
        // 닫는 괄호 뒤에 오는 단항 함수 괄호 닫기
        // 예: abs(5 + 3)) -> abs(5 + 3)
        let openParenIndex = -1;
        for(let i = expressionTokens.length - 2; i >= 0; i--) {
            if (expressionTokens[i].endsWith('(') && !expressionTokens[i].startsWith('(')) {
                openParenIndex = i;
                break;
            }
        }
        if (openParenIndex !== -1) {
            expressionTokens[expressionTokens.length - 1] += ')';
        }
      }
    }
  }
  return expressionTokens.join('').trim();
};

/**
 * 수식의 유효성을 검사합니다.
 * - 괄호 짝이 맞는지
 * - 연산자 위치 (숫자 - 연산자 - 숫자 패턴)
 * - 단일 숫자도 유효하게 처리
 */
export const isValidExpression = (cards: Card[]): boolean => {
  if (cards.length === 0) return false;
  if (cards.length === 1 && cards[0].type === CardType.NUMBER) return true; // 단일 숫자는 항상 유효

  let openParenCount = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const prevCard = i > 0 ? cards[i - 1] : null;
    const nextCard = i < cards.length - 1 ? cards[i + 1] : null;

    if (card.label === '(') {
      openParenCount++;
      // ( 다음에 연산자가 오거나 ) 가 바로 오는 경우 방지 (예외: -5 같은 음수)
      if (nextCard && (nextCard.type === CardType.OPERATOR && !['-', '+'].includes(nextCard.label) || nextCard.label === ')')) {
        return false;
      }
    } else if (card.label === ')') {
      openParenCount--;
      if (openParenCount < 0) return false; // 닫는 괄호가 먼저 나옴
      // ) 다음에 숫자나 여는 괄호가 오는 경우 방지 (예: (5)6, (5)(6))
      if (nextCard && (nextCard.type === CardType.NUMBER || nextCard.label === '(' || ['abs', 'round', 'floor', 'ceil', '!'].includes(nextCard.label))) {
          return false;
      }
    } else if (card.type === CardType.NUMBER) {
      // 숫자 뒤에 숫자, 여는 괄호, 함수 형태의 단항 연산자가 오는 경우 방지 (예: 5 6, 5(, 5abs)
      if (nextCard && (nextCard.type === CardType.NUMBER || nextCard.label === '(' || ['abs', 'round', 'floor', 'ceil'].includes(nextCard.label))) {
        return false;
      }
    } else if (card.type === CardType.OPERATOR) {
        const isUnary = ['!', 'abs', 'round', 'floor', 'ceil'].includes(card.label);
        // 연산자 뒤에 닫는 괄호나 다른 연산자가 오는 경우 방지 (단, 특정 경우 예외)
        if (nextCard && (nextCard.type === CardType.OPERATOR && !isUnary || nextCard.label === ')')) {
            // 이항 연산자 뒤에 바로 단항 연산자가 올 수 없음 (예: 5 + !)
            if (!isUnary && nextCard.type === CardType.OPERATOR && ['!', 'abs', 'round', 'floor', 'ceil'].includes(nextCard.label)) {
                return false;
            }
        }
        // 이항 연산자
        if (!isUnary) {
            // 이항 연산자 앞에 아무것도 없거나 연산자가 오는 경우 (단, ( 다음에 오는 +,-는 허용)
            if (!prevCard || (prevCard.type === CardType.OPERATOR && !['(', ')'].includes(prevCard.label) && !(['+', '-'].includes(card.label) && prevCard.label === '('))) {
                return false;
            }
            // 이항 연산자 뒤에 아무것도 없거나 닫는 괄호가 오는 경우
            if (!nextCard || (nextCard.type === CardType.OPERATOR && !['(', ')'].includes(nextCard.label))) {
                 return false;
            }
        } else { // 단항 연산자 (!, abs, round 등)
            if (card.label === '!') { // 팩토리얼은 숫자나 닫는 괄호 뒤에만 올 수 있음
                if (!prevCard || (prevCard.type !== CardType.NUMBER && prevCard.label !== ')')) return false;
            } else { // abs, round 등은 숫자 앞에 오거나 (숫자) 앞에 올 수 있음
                if (!nextCard || (nextCard.type !== CardType.NUMBER && nextCard.label !== '(')) return false;
            }
        }
    }
  }

  return openParenCount === 0;
};

/**
 * 수식을 계산하는 주 함수 (RPN 변환 후 계산)
 */
export const evaluateExpression = (cards: Card[]): number => {
  // 단일 숫자 카드 처리 (Shunting-yard algorithm이 단일 숫자를 처리할 수 있으므로 특별한 분기 불필요)
  const rpn = toRPN(cards);
  return evaluateRPN(rpn);
};