import type {
  CommandFunction,
  PaintFunctionContext,
} from ".";
import type { TCell } from "../internals/cell";
import type { TCellBoard } from "../internals/cellBoard";

const drawCommand = () => {
  let lastCell: TCell | null = null;
  let isDrawing = false;

  const paintMultipleCells = (
    cells: ReturnType<TCellBoard["getCellBoardCells"]>,
    ctx: PaintFunctionContext["ctx"],
    color: PaintFunctionContext["color"]
  ) => {
    for (const cell of cells) {
      cell.owned = true;
      cell.draw(ctx, color);
    }
    lastCell = cells[Math.floor(cells.length / 2)];
  };

  const start: CommandFunction = (
    [x, y],
    { getCellBoardCells }
  ) => {
    isDrawing = true;
    return ({ ctx, color, size }) => {
      paintMultipleCells(getCellBoardCells(x, y, size), ctx, color);
    };
  };

  const execute: CommandFunction = (
    [x, y],
    { getCellBoardCell, interpolate, getCellBoardCells }
  ) => {
    const initialCell = getCellBoardCell(x, y);
    if (!initialCell) return;
    if (!isDrawing) return;
    return ({ ctx, size, color }) => {
      if (!lastCell) return;
      interpolate(
        lastCell.x,
        lastCell.y,
        initialCell.x,
        initialCell.y,
        (x: number, y: number) => {
          paintMultipleCells(getCellBoardCells(x, y, size), ctx, color);
        }
      );
      lastCell = initialCell;
    };
  };

  const end: CommandFunction = () => {
    isDrawing = false;
    lastCell = null;
  };

  return {
    start,
    execute,
    end,
  };
};

export default drawCommand;
