import type { GetRelativeCoordinatesFn, PainterContext } from ".";
import type { TCell } from "../cell";
import type { TCellBoard } from "../cellBoard";

const drawCommand = (cellBoard: TCellBoard) => {
    let lastCell: TCell | null = null;
    let isDrawing = false;
  
    const paintMultipleCells = (
      ctx: CanvasRenderingContext2D,
      painterContext: PainterContext,
      x: number,
      y: number
    )  => {
      const cells = cellBoard.getCellBoardCells(x, y, painterContext.size);
      for (const cell of cells) {
        cell.owned = true;
        cell.draw(ctx, painterContext.color);
      }
      lastCell = cells[Math.floor(cells.length / 2)];
    }
  
    const start = (getRelativeCoordinates: GetRelativeCoordinatesFn) => {
      isDrawing = true;
      return (ctx: CanvasRenderingContext2D, painterContext: PainterContext) => {
        paintMultipleCells(ctx, painterContext, ...getRelativeCoordinates());
      };
    }
  
    const execute = (getRelativeCoordinates: GetRelativeCoordinatesFn) => {
      const initialCell = cellBoard.getCellBoardCell(...getRelativeCoordinates());
      if (!initialCell) return;
      if (!isDrawing) return;
      return (ctx: CanvasRenderingContext2D, painterContext: PainterContext) => {
        if (!lastCell) return;
        cellBoard.interpolate(
          lastCell.x,
          lastCell.y,
          initialCell.x,
          initialCell.y,
          (x: number, y: number) => {
            paintMultipleCells(ctx, painterContext, x, y);
          }
        );
        lastCell = initialCell;
      };
    }
  
    const end = () => {
      isDrawing = false;
      lastCell = null;
    }
  
    return {
      start,
      execute,
      end,
    };
  };

export default drawCommand;