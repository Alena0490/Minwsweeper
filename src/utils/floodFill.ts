import type { CellData } from "../data/game";

export const floodFill = (board: CellData[][], row: number, col: number): CellData[][] => {
    const newBoard = board.map(r => r.map(cell => ({ ...cell })));
    const queue: [number, number][] = [[row, col]];

    while (queue.length > 0) {
        const [r, c] = queue.shift()!;
        const cell = newBoard[r][c];

        if (cell.isOpen || cell.isMine || cell.mark !== 'none') continue;

        cell.isOpen = true;

        if (cell.adjacentMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < newBoard.length && nc >= 0 && nc < newBoard[0].length) {
                        queue.push([nr, nc]);
                    }
                }
            }
        }
    }

    return newBoard;
};