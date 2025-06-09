// src/store/gameStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CardType, Card, Stage } from '@/lib/types';
import { stages, ALL_SHOP_CARDS, INITIAL_INVENTORY_CARDS } from '@/lib/constants';

interface GameState {
  points: number;
  inventory: Card[];
  shopCards: Card[];
  currentStageIndex: number;
  currentExpression: Card[];
  currentStageStartTime: number; // 현재 스테이지 시작 시간
  gameStartTime: number; // 게임 전체 시작 시간 (새로 추가)
  totalTimePlayed: number; // 총 플레이 시간 (밀리초) (새로 추가)
  isGameStartedFromTitle: boolean;
}

interface GameActions {
  addPoints: (amount: number) => void;
  buyCard: (cardId: string) => boolean;
  addCardToInventory: (card: Card) => void;
  selectCardForExpression: (card: Card) => void;
  resetExpression: () => void;
  nextStage: () => void;
  resetGame: () => void;
  setCurrentStageStartTime: (time: number) => void;
  setGameStartedFromTitle: (started: boolean) => void;
  startGameTimer: () => void; // 게임 전체 타이머 시작
  addTimeToTotal: (timeToAdd: number) => void; // 총 플레이 시간에 시간 누적
}

// 카드에 고유 ID를 부여하는 헬퍼 함수
const initializeCardsWithUniqueIds = (cards: Card[]): Card[] => {
  return cards.map(card => ({
    ...card,
    id: `${card.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }));
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      points: 100,
      inventory: initializeCardsWithUniqueIds(INITIAL_INVENTORY_CARDS),
      shopCards: initializeCardsWithUniqueIds(ALL_SHOP_CARDS),
      currentStageIndex: 0,
      currentExpression: [],
      currentStageStartTime: Date.now(), // 초기 스테이지 시작 시간
      gameStartTime: Date.now(), // 게임 시작 시간 초기화
      totalTimePlayed: 0, // 총 플레이 시간 초기화
      isGameStartedFromTitle: false,

      addPoints: (amount) => set((state) => ({ points: state.points + amount })),

      buyCard: (cardId) => {
        const state = get();
        const cardToBuy = state.shopCards.find(card => card.id === cardId);

        if (!cardToBuy) {
          console.warn(`상점에 없는 카드입니다: ${cardId}`);
          return false;
        }

        if (state.points >= cardToBuy.currentCost) {
          const newInventory = [...state.inventory, {
            ...cardToBuy,
            id: `${cardToBuy.id}_inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          }];
          const newShopCards = state.shopCards.map(card => {
            if (card.id === cardId) {
              return { ...card, currentCost: Math.round(card.currentCost + Math.max(card.initialCost || 0, 1)) }; // initialCost가 없을 경우 0으로 처리
            }
            return card;
          });

          set({
            points: state.points - cardToBuy.currentCost,
            inventory: newInventory,
            shopCards: newShopCards,
          });
          return true;
        }
        return false;
      },

      addCardToInventory: (card) => set((state) => {
        return {
          inventory: [...state.inventory, { ...card, id: `${card.id}_inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` }],
        };
      }),

      selectCardForExpression: (cardToSelect) => {
        set((state) => {
          const newInventory = state.inventory.filter(card => card.id !== cardToSelect.id);
          return {
            currentExpression: [...state.currentExpression, cardToSelect],
            inventory: newInventory,
          };
        });
      },

      resetExpression: () => set((state) => {
        const cardsToReturn = state.currentExpression;
        return {
          currentExpression: [],
          inventory: [...state.inventory, ...cardsToReturn],
        };
      }),

      nextStage: () => set((state) => ({ currentStageIndex: state.currentStageIndex + 1 })),

      resetGame: () => set({
        points: 100,
        inventory: initializeCardsWithUniqueIds(INITIAL_INVENTORY_CARDS),
        shopCards: initializeCardsWithUniqueIds(ALL_SHOP_CARDS),
        currentStageIndex: 0,
        currentExpression: [],
        currentStageStartTime: Date.now(),
        gameStartTime: Date.now(), // 게임 초기화 시 게임 시작 시간도 리셋
        totalTimePlayed: 0, // 게임 초기화 시 총 플레이 시간도 리셋
        isGameStartedFromTitle: false,
      }),

      setCurrentStageStartTime: (time: number) => set({ currentStageStartTime: time }),
      setGameStartedFromTitle: (started: boolean) => set({ isGameStartedFromTitle: started }),

      startGameTimer: () => set({ gameStartTime: Date.now() }), // 게임 시작 시 호출될 액션
      addTimeToTotal: (timeToAdd: number) => set((state) => ({ totalTimePlayed: state.totalTimePlayed + timeToAdd })), // 총 시간에 누적
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => sessionStorage),
      // `initialCost`가 `undefined`일 수 있으므로 `initialCost || 0`을 사용했습니다.
      // `id` 생성 로직도 더욱 견고하게 변경했습니다.
      // TypeScript가 `initialCost`가 `Card` 타입에 없을 수 있다고 경고할 경우 `Card` 인터페이스에 추가해 주세요.
      // 예: `interface Card { /* ... */ initialCost?: number; }`
    }
  )
);