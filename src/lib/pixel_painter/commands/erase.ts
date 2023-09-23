import type { GetRelativeCoordinatesFn, PainterContext } from ".";

const eraseCommand = (cellBoard: TCellBoard) => {
    let lastCell: TCell | null = null;
    let isErasing = false;
  
    const eraseMultipleCells = (
      ctx: CanvasRenderingContext2D,
      painterContext: PainterContext,
      x: number,
      y: number
    ) => {
      const cells = cellBoard.getCellBoardCells(x, y, painterContext.size);
      for (const cell of cells) {
        cell.reset(ctx);
      }
      lastCell = cells[Math.floor(cells.length / 2)];
    }
  
    const start = (getRelativeCoordinates: GetRelativeCoordinatesFn) => {
      isErasing = true;
      return (ctx: CanvasRenderingContext2D, painterContext: PainterContext) => {
        eraseMultipleCells(ctx, painterContext, ...getRelativeCoordinates());
      };
    }
  
    const execute = (getRelativeCoordinates: GetRelativeCoordinatesFn) => {
      const cell = cellBoard.getCellBoardCell(...getRelativeCoordinates());
      if (!cell) return;
      if (!isErasing) return;
      return (ctx: CanvasRenderingContext2D, painterContext: PainterContext) => {
        if (!lastCell) return;
        cellBoard.interpolate(
          lastCell.x,
          lastCell.y,
          cell.x,
          cell.y,
          (x: number, y: number) => {
            eraseMultipleCells(ctx, painterContext, x, y);
          }
        );
        lastCell = cell;
      };
    }
  
    const end = () => {
      isErasing = false;
      lastCell = null;
    }
  
    return {
      start,
      execute,
      end,
    };
  };

  export default eraseCommand;