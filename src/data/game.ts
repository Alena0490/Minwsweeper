// TYPES

export interface CellData {
  id: string;
  row: number;
  col: number;
  isMine: boolean;
  isOpen: boolean;
  adjacentMines: number;
  mark: 'none' | 'flag' | 'question';
}

export type CellMark = 'none' | 'flag' | 'question';

export interface BoardConfig {
  rows: number;
  cols: number;
  mines: number;
}

// GAME STATES
export type GameState = 'playing' | 'won' | 'lost';

// CONFIG

export const beginnerConfig: BoardConfig = {
  rows: 9,
  cols: 9,
  mines: 10,
};

export const intermediateConfig: BoardConfig = {
  rows: 16,
  cols: 16,
  mines: 40,
};

export const expertConfig: BoardConfig = {
  rows: 16,
  cols: 30,
  mines: 99,
};