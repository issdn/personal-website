import type { CommandFunction, PaintFunctionContext } from ".";
import type { TCell } from "../internals/cell";
import type { TCellBoard } from "../internals/cellBoard";

const eraseCommand = () => {
  let lastCell: TCell | null = null;
  let isErasing = false;

  const eraseMultipleCells = (
    cells: ReturnType<TCellBoard["getCellBoardCells"]>,
    ctx: PaintFunctionContext["ctx"]
  ) => {
    for (const cell of cells) {
      cell.reset(ctx);
    }
    lastCell = cells[Math.floor(cells.length / 2)];
  };

  const start: CommandFunction = ([x, y], { getCellBoardCells }) => {
    isErasing = true;
    return ({ ctx, size }) => {
      eraseMultipleCells(getCellBoardCells(x, y, size), ctx);
    };
  };

  const execute: CommandFunction = (
    [x, y],
    { getCellBoardCell, interpolate, getCellBoardCells }
  ) => {
    const cell = getCellBoardCell(x, y);
    if (!cell) return;
    if (!isErasing) return;
    return ({ ctx, size }) => {
      if (!lastCell) return;
      interpolate(
        lastCell.x,
        lastCell.y,
        cell.x,
        cell.y,
        (x: number, y: number) => {
          eraseMultipleCells(getCellBoardCells(x, y, size), ctx);
        }
      );
      lastCell = cell;
    };
  };

  const end: CommandFunction = () => {
    isErasing = false;
    lastCell = null;
  };

  return {
    start,
    execute,
    end,
  };
};

export default eraseCommand;
