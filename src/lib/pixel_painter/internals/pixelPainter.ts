import type { TCellBoard } from "./cellBoard";
import type {
  CommandInvoker,
  PaintFunctionContext,
  TCommand,
} from "../commands";
import type { ICommandInvoker } from "../commands/commandInvoker";
import { Actions } from "../stores/pixelPainterStore";

class PixelPainter {
  canvas!: HTMLCanvasElement;
  cellBoard!: TCellBoard;
  action!: Actions;
  ctx!: CanvasRenderingContext2D;
  painterContext!: PaintFunctionContext;
  private xCellAmount: number;
  private yCellAmount: number;
  private isTouchScreen: boolean
  private canvasSize = { width: 0, height: 0 };
  private commandInvoker!: ICommandInvoker;
  private lastAction!: Actions;
  private quickAction = false;

  private commandsByListener: {
    mobile: Map<
      "touchstart" | "touchmove" | "touchend",
      (e: TouchEvent) => void
    >;
    desktop: Map<
      "mousedown" | "mousemove" | "mouseup" | "mouseleave",
      (e: MouseEvent) => void
    >;
  } = { mobile: new Map(), desktop: new Map() };

  private backgroundCommandsByListener: Set<
    Record<keyof ReturnType<TCommand>, (e: MouseEvent) => void>
  > = new Set();

  constructor(isTouchScreen: boolean, xCellAmount: number, yCellAmount: number) {
    this.isTouchScreen = isTouchScreen;
    this.xCellAmount = xCellAmount;
    this.yCellAmount = yCellAmount
  }

  init(
    canvas: HTMLCanvasElement,
    cellBoard: TCellBoard,
    commandInvoker: CommandInvoker
  ) {
    this.canvas = canvas;
    this.cellBoard = cellBoard;
    this.commandInvoker = commandInvoker;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Context is null");
    this.ctx = ctx;
    this.setCanvasPositionToMiddle = this.setCanvasPositionToMiddle.bind(this);
    window.addEventListener("resize", this.setCanvasPositionToMiddle);
    this.setCommandsByListener();
    if (!this.isTouchScreen) {
      this.createBackgroundCommandsEventsObject();
    }
    this.attachEventListeners();
    this.attachBackgroundEvents();
    this.setCanvasSize();
  }

  reset() {
    this.cellBoard.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.reset(this.ctx);
      });
    });
  }

  setCanvasPositionToMiddle() {
    this.canvas.style.left =
      -this.canvas.width / 2 + window.innerWidth / 2 + "px";
    this.canvas.style.top =
      -this.canvas.height / 2 + window.innerHeight / 2 + "px";
  }

  destroy() {
    if (!this.canvas) return;
    if (this.isTouchScreen) {
      this.commandsByListener.mobile.forEach((value, key) => {
        this.canvas.removeEventListener(key, value);
      });
    } else {
      window.removeEventListener("visibilitychange", this.resetQuickAction);
      this.commandsByListener.desktop.forEach((value, key) => {
        this.canvas.removeEventListener(key, value);
      });
    }
  }

  setPainterContext(cellContext: Partial<PaintFunctionContext>) {
    this.painterContext = { ...this.painterContext, ...cellContext };
    return this;
  }

  setQuickAction(action: Actions) {
    this.quickAction = true;
    this.lastAction = this.action;
    this.action = action;
    return this;
  }

  setAction(action: Actions) {
    if (action === this.action) return this;
    this.lastAction = this.action;
    this.action = action;
    return this;
  }

  private resetQuickAction() {
    if (!this.quickAction) return;
    this.quickAction = false;
    this.action = this.lastAction;
  }

  private getSideLengthInPX() {
    return {
      width: this.xCellAmount * this.cellBoard.cellBorderSize,
      height: this.yCellAmount * this.cellBoard.cellBorderSize,
    };
  }

  drawGrid(color: string) {
    this.ctx.fillStyle = color;
    let x = 0;
    let y = 0;
    for (let xCells = 0; xCells < this.xCellAmount; xCells++) {
      this.ctx.fillRect(
        x - this.cellBoard.borderWidth,
        0,
        this.cellBoard.borderWidth,
        this.canvasSize.height
      );
      x += this.cellBoard.cellBorderSize;
    }
    for (let yCells = 0; yCells < this.yCellAmount; yCells++) {
      this.ctx.fillRect(
        0,
        y - this.cellBoard.borderWidth,
        this.canvasSize.width,
        this.cellBoard.borderWidth
      );
      y += this.cellBoard.cellBorderSize;
    }
  }

  drawCells() {
    this.cellBoard.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.originColor) {
          cell.draw(this.ctx, cell.originColor);
          cell.lastColor = null;
        }
      });
    });
  }

  private getCellSizeFromSidesLength(xLength: number, yLength: number) {
    return Math.max(
      xLength / this.xCellAmount,
      yLength / this.yCellAmount
    );
  }

  private setCanvasSize() {
    this.canvasSize = this.getSideLengthInPX();
    /*
     * If the canvas is smaller than the window, we need to resize it.
     * Number of cells has to be static so their size has to be larger.
     */
    if (
      this.canvasSize.width < window.innerWidth ||
      this.canvasSize.height < window.innerHeight
    ) {
      const cellSize = this.getCellSizeFromSidesLength(
        window.innerWidth,
        window.innerHeight
      );
      this.cellBoard.borderWidth = Math.floor((cellSize * 10) / 100);
      this.cellBoard.cellSize = cellSize 
      this.canvasSize = this.getSideLengthInPX();
    }
    this.canvas.style.width = this.canvasSize.width + "px";
    this.canvas.style.height = this.canvasSize.height + "px";
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  private getRelativeCoordinates(x: number, y: number): [number, number] {
    const canvasDOMRect = this.canvas.getBoundingClientRect();
    const relativeX = x - canvasDOMRect.left;
    const relativeY = y - canvasDOMRect.top;
    return [relativeX, relativeY];
  }

  private feedParametersToCommand(
    x: number,
    y: number,
    fn: ReturnType<TCommand>[keyof ReturnType<TCommand>]
  ) {
    fn([...this.getRelativeCoordinates(x, y), x, y], {
      getCellBoardCell: this.cellBoard.getCellBoardCell.bind(this.cellBoard),
      getCellBoardCells: this.cellBoard.getCellBoardCells.bind(this.cellBoard),
      interpolate: this.cellBoard.interpolate.bind(this.cellBoard),
    })?.({ ...this.painterContext, ctx: this.ctx, canvas: this.canvas });
  }

  private setCommandsByListener() {
    this.commandsByListener.mobile
      .set("touchstart", (e: TouchEvent) => {
        if (e.touches.length >= 2) {
          this.setQuickAction(Actions.move);
        }
        this.feedParametersToCommand(
          e.touches[0].clientX,
          e.touches[0].clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.start
        );
      })
      .set("touchmove", (e: TouchEvent) =>
        this.feedParametersToCommand(
          e.touches[0].clientX,
          e.touches[0].clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.execute
        )
      )
      .set("touchend", (e: TouchEvent) => {
        this.feedParametersToCommand(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.end
        );
        this.resetQuickAction();
      });
    this.commandsByListener.desktop
      .set("mousedown", (e: MouseEvent) => {
        this.invokeBackgroundCommands(e, "start");
        this.removeBackgroundEvents();
        if (e.button === 1 || e.button === 2) {
          this.setQuickAction(Actions.move);
        }
        this.feedParametersToCommand(
          e.clientX,
          e.clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.start
        );
      })
      .set("mousemove", (e: MouseEvent) =>
        this.feedParametersToCommand(
          e.clientX,
          e.clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.execute
        )
      )
      .set("mouseup", (e: MouseEvent) => {
        this.feedParametersToCommand(
          e.clientX,
          e.clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.end
        );
        this.resetQuickAction();
        this.invokeBackgroundCommands(e, "end");
        this.attachBackgroundEvents();
      })
      .set("mouseleave", (e: MouseEvent) => {
        this.feedParametersToCommand(
          e.clientX,
          e.clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.end
        );
        this.resetQuickAction();
        this.invokeBackgroundCommands(e, "end");
        this.attachBackgroundEvents();
      });
  }

  private attachEventListeners() {
    if (!this.canvas) return;
    if (this.isTouchScreen) {
      this.commandsByListener.mobile.forEach((value, key) => {
        this.canvas.addEventListener(key, value);
      });
    } else {
      window.addEventListener("visibilitychange", this.resetQuickAction);
      this.commandsByListener.desktop.forEach((value, key) => {
        this.canvas.addEventListener(key, value);
      });
    }
  }

  private createBackgroundCommandsEventsObject() {
    this.commandInvoker.backgroundCommands.forEach((command) => {
      this.backgroundCommandsByListener.add(
        // @ts-ignore
        ["execute", "start", "end"].reduce(
          (acc, k) => ({
            ...acc,
            [k]: (e: MouseEvent) =>
              // @ts-ignore
              this.feedParametersToCommand(e.clientX, e.clientY, command[k]),
          }),
          {}
        )
      );
    });
  }

  private invokeBackgroundCommands(e: MouseEvent, type: "start" | "end") {
    this.backgroundCommandsByListener.forEach((commandFunctions) => {
      commandFunctions[type](e as never);
    });
  }

  private attachBackgroundEvents() {
    this.backgroundCommandsByListener.forEach((commandFunctions) => {
      this.canvas.addEventListener("mousemove", commandFunctions.execute);
    });
  }

  private removeBackgroundEvents() {
    this.backgroundCommandsByListener.forEach((commandFunctions) => {
      this.canvas.removeEventListener("mousemove", commandFunctions.execute);
    });
  }
}

type TPixelPainter = InstanceType<typeof PixelPainter>;
enum TPainterListenersKeys {
  desktop = "desktop",
  mobile = "mobile",
}
type TPainterListeners = {
  [key in keyof TPainterListenersKeys]: { [key: string]: (e: Event) => void };
};

export default PixelPainter;
export type {
  TPixelPainter,
  TPainterListeners,
  TPainterListenersKeys,
};
