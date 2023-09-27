import type { CommandFunction } from ".";
import type { TCell } from "../internals/cell";

const placeholderCommand = () => {
  let previousPlaceholder: TCell[] = [];

  const clearPlaceholder = (ctx: CanvasRenderingContext2D) => {
    for (const cell of previousPlaceholder) {
      cell.removePlaceholder(ctx);
    }
  };

  const execute: CommandFunction = ([x, y], { getCellBoardCells }) => {
    return ({ size, ctx, accentColor }) => {
      const cells = getCellBoardCells(x, y, size);
      clearPlaceholder(ctx);
      for (const cell of cells) {
        cell.drawPlaceholder(ctx, accentColor);
      }
      previousPlaceholder = cells;
    };
  };
  
  const start: CommandFunction = () => {
    return ({ ctx }) => {
      clearPlaceholder(ctx);
    };
  };
  
  const end: CommandFunction = () => {
    return ({ ctx }) => {
      clearPlaceholder(ctx);
    };
  };

  return {
    execute,
    start,
    end,
  };
};

export default placeholderCommand;
