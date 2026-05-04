import type { CellData } from '../data/game';

const getNeighbors = (board: CellData[][], row: number, col: number): CellData[] => {
    const rows = board.length;
    const cols = board[0].length;
    const neighbors: CellData[] = [];

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                neighbors.push(board[r][c]);
            }
        }
    }

    return neighbors;
};

export const generateMines = (
    board: CellData[][],
    mineCount: number,
    safeRow: number,
    safeCol: number
): CellData[][] => {
    // Collect safe cell IDs (clicked cell + its neighbors)
    const safeIds = new Set<string>();
    safeIds.add(`${safeRow}-${safeCol}`);
    getNeighbors(board, safeRow, safeCol).forEach(cell => safeIds.add(cell.id));

    // Filter out safe cells to get mine candidates
    const candidates = board.flat().filter(cell => !safeIds.has(cell.id));

    // Fisher-Yates shuffle — pick first mineCount candidates
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const mineIds = new Set(candidates.slice(0, mineCount).map(c => c.id));

    // Place mines on the board
    const newBoard: CellData[][] = board.map(row =>
        row.map(cell => ({ ...cell, isMine: mineIds.has(cell.id) }))
    );

    // Calculate adjacent mine counts for each cell
    return newBoard.map(row =>
        row.map(cell => ({
            ...cell,
            adjacentMines: cell.isMine
                ? 0
                : getNeighbors(newBoard, cell.row, cell.col).filter(n => n.isMine).length,
        }))
    );
};