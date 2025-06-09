export enum CardType {
    NUMBER = 'number',
    OPERATOR = 'operator',
    PARENTHESIS = 'parenthesis',
    POWER = 'power',
  }
  
  export interface Card {
    id: string;
    type: CardType;
    label: string; // 화면에 표시될 문자열 (예: '+', 'x', '(', '!', 'round')
    value?: number; // NUMBER 타입 카드에만 해당
    initialCost: number; // 카드의 초기 구매 비용
    currentCost: number; // 현재 구매 비용 (변동 가능)
    allowMultiple?: boolean; // 6, 8과 같이 여러 개 가질 수 있는 카드 (현재 사용 안 함)
  }
  
  export interface Stage {
    id: string;
    targetNumber: number;
    description: string;
    cardLimit: number;
    rewardPoints: number;
  }