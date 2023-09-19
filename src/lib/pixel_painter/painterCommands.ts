class CommandInvoker implements ICommandInvoker {
  commands: Map<Actions, ReturnType<TCommand>> = new Map();
  backgroundCommands = new Set<ReturnType<TCommand>>();
}

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

const moveCommand = () => {
  let lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  let offset: { x: number; y: number } = { x: 0, y: 0 };
  let isMoving = false;
  let cursorStyleBefore = "";

  const start = (
    getRelativeCoordinates: GetRelativeCoordinatesFn,
    x: number,
    y: number
  ) => {
    lastMousePosition = { x: x, y: y };
    return (
      ctx: CanvasRenderingContext2D,
      painterContext: PainterContext,
      canvas: HTMLCanvasElement
    ) => {
      cursorStyleBefore = getComputedStyle(canvas).cursor;
      canvas.style.cursor = "grabbing";
      offset = { x: canvas.offsetLeft, y: canvas.offsetTop };
      isMoving = true;
    };
  }

  const execute = (
    getRelativeCoordinates: GetRelativeCoordinatesFn,
    x: number,
    y: number
  ) => {
    if (!isMoving) return;
    const xShift = offset.x + x - lastMousePosition.x;
    const yShift = offset.y + y - lastMousePosition.y;
    return (
      ctx: CanvasRenderingContext2D,
      painterContext: PainterContext,
      canvas: HTMLCanvasElement
    ) => {
      const {
        x: xCanvas,
        y: yCanvas,
        width,
        height,
      } = canvas.getBoundingClientRect();
      const setLeft = (x: number) => {
        canvas.style.left = x + "px";
      };
      const setTop = (y: number) => {
        canvas.style.top = y + "px";
      };
      if (xShift + xCanvas > 0) {
        setLeft(0);
      } else if (width + xShift < window.innerWidth) {
        setLeft(window.innerWidth - width);
      } else {
        setLeft(xShift);
      }
      if (yShift + yCanvas > 0) {
        setTop(0);
      } else if (height + yShift < window.innerHeight) {
        setTop(window.innerHeight - height);
      } else {
        setTop(yShift);
      }
    };
  }

  const end = () => {
    return (
      ctx: CanvasRenderingContext2D,
      painterContext: PainterContext,
      canvas: HTMLCanvasElement
    ) => {
      isMoving = false;
      canvas.style.cursor = cursorStyleBefore;
    };
  }

  return {
    start,
    execute,
    end,
  };
};

const placeholderCommand = (cellBoard: TCellBoard) => {
  let previousPlaceholder: TCell[] = [];

  const clearPlaceholder = (ctx: CanvasRenderingContext2D) => {
    for (const cell of previousPlaceholder) {
      cell.removePlaceholder(ctx);
    }
  }

  const execute = (getRelativeCoordinates: GetRelativeCoordinatesFn) => {
    return (ctx: CanvasRenderingContext2D, painterContext: PainterContext) => {
      const cells = cellBoard.getCellBoardCells(
        ...getRelativeCoordinates(),
        painterContext.size
      );
      clearPlaceholder(ctx);
      for (const cell of cells) {
        cell.drawPlaceholder(ctx, painterContext.accentColor);
      }
      previousPlaceholder = cells;
    };
  }

  return {
    execute,
    start: () => {
      return (ctx: CanvasRenderingContext2D) => {
        clearPlaceholder(ctx);
      };
    },
    end: () => {
      return (ctx: CanvasRenderingContext2D) => {
        clearPlaceholder(ctx);
      };
    },
  };
};

export {
  CommandInvoker,
  drawCommand,
  eraseCommand,
  moveCommand,
  placeholderCommand,
};
