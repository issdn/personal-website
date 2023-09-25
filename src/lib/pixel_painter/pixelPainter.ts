import type { TCellBoard } from "./cellBoard";
import type { PainterContext, TCommand } from "./commands";
import type { ICommandInvoker } from "./commands/commandInvoker";
import { Actions } from "./pixelPainterStore";

const baseConfig = {
  gridSize: 10,
  borderWidth: 1,
  accentColor: "2b2b2b",
  xCellAmount: 250,
  yCellAmount: 125,
  isTouchScreen: false,
};

class PixelPainter {
  canvas!: HTMLCanvasElement;
  cellBoard!: TCellBoard;
  action!: Actions;
  config: TBaseConfig;
  private canvasSize = { width: 0, height: 0 };
  private ctx!: CanvasRenderingContext2D;
  private commandInvoker!: ICommandInvoker;
  private lastAction!: Actions;
  private quickAction = false;
  private painterContext!: PainterContext;

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

  private backgroundCommandsByListener: {
    mobile: Set<Record<keyof ReturnType<TCommand>, (e: TouchEvent) => void>>;
    desktop: Set<Record<keyof ReturnType<TCommand>, (e: MouseEvent) => void>>;
  } = { mobile: new Set(), desktop: new Set() };

  constructor(config: TBaseConfigParameter = {}) {
    this.config = { ...baseConfig, ...config };
  }

  async init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Context is null");
    this.ctx = ctx;
    this.setCanvasPositionToMiddle = this.setCanvasPositionToMiddle.bind(this);
    window.addEventListener("resize", this.setCanvasPositionToMiddle);
    this.setCommandsByListener();
    this.createBackgroundCommandsEventsObject();
    this.addEventListenersToCanvas();
    this.addBackgroundCommandsEvents();
    return this;
  }

  async draw() {
    if (!this.cellBoard) throw new Error("Cell board is not set");
    this.canvasSize = this.getSideLengthInPX();
    /*
     * If the canvas is smaller than the window, we need to resize it.
     * Number of cells has to be static so their size has to be larger.
     */
    if (
      this.canvasSize.width < window.innerWidth ||
      this.canvasSize.height < window.innerHeight
    ) {
      const gridSize = this.getCellSizeFromSidesLength(
        window.innerWidth,
        window.innerHeight
      );
      this.config = {
        ...this.config,
        borderWidth: Math.floor((gridSize * 10) / 100),
        gridSize: gridSize,
      };
      this.canvasSize = this.getSideLengthInPX();
    }
    this.setCanvasSize();
    this.setCanvasPositionToMiddle();
    this.drawGrid();
    this.drawCells();
  }

  reset() {
    this.cellBoard.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.reset(this.ctx);
      });
    });
  }

  destroy() {
    window.removeEventListener("resize", this.setCanvasPositionToMiddle);
    if (!this.canvas) return;
    if (this.config.isTouchScreen) {
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

  setCellBoard(cellBoard: TCellBoard) {
    this.cellBoard = cellBoard;
    return this;
  }

  setPainterContext(cellContext: Partial<PainterContext>) {
    this.painterContext = { ...this.painterContext, ...cellContext };
    return this;
  }

  setConfig(config: TBaseConfigParameter) {
    this.config = { ...this.config, ...config };
    return this;
  }

  setCommandsInvoker(commandInvoker: ICommandInvoker) {
    this.commandInvoker = commandInvoker;
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

  private setCanvasPositionToMiddle() {
    this.canvas.style.left =
      -this.canvas.width / 2 + window.innerWidth / 2 + "px";
    this.canvas.style.top =
      -this.canvas.height / 2 + window.innerHeight / 2 + "px";
  }

  private getSideLengthInPX() {
    return {
      width:
        this.config.xCellAmount *
        (this.config.gridSize + this.config.borderWidth),
      height:
        this.config.yCellAmount *
        (this.config.gridSize + this.config.borderWidth),
    };
  }

  private drawGrid() {
    this.ctx.fillStyle = this.config.accentColor;
    let x = 0;
    let y = 0;
    for (let xCells = 0; xCells < this.config.xCellAmount; xCells++) {
      this.ctx.fillRect(
        x - this.config.borderWidth,
        0,
        this.config.borderWidth,
        this.canvasSize.height
      );
      x += this.config.gridSize + this.config.borderWidth;
    }
    for (let yCells = 0; yCells < this.config.yCellAmount; yCells++) {
      this.ctx.fillRect(
        0,
        y - this.config.borderWidth,
        this.canvasSize.width,
        this.config.borderWidth
      );
      y += this.config.gridSize + this.config.borderWidth;
    }
  }

  private drawCells() {
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
      xLength / this.config.xCellAmount,
      yLength / this.config.yCellAmount
    );
  }

  private setCanvasSize() {
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
    fn(() => this.getRelativeCoordinates(x, y), x, y)?.(
      this.ctx,
      this.painterContext,
      this.canvas
    );
  }

  private setCommandsByListener() {
    this.commandsByListener.mobile
      .set("touchstart", (e: TouchEvent) => {
        this.invokeBackgroundCommands(e, "start");
        this.removeBackgroundCommandsEvents();
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
          e.touches[0].clientX,
          e.touches[0].clientY,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.commandInvoker.commands.get(this.action)!.end
        );
        this.resetQuickAction();
        this.invokeBackgroundCommands(e, "end");
        this.addBackgroundCommandsEvents();
      });
    this.commandsByListener.desktop
      .set("mousedown", (e: MouseEvent) => {
        this.invokeBackgroundCommands(e, "start");
        this.removeBackgroundCommandsEvents();
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
        this.addBackgroundCommandsEvents();
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
        this.addBackgroundCommandsEvents();
      });
  }

  private createBackgroundCommandsEventsObject() {
    this.commandInvoker.backgroundCommands.forEach((command) => {
      this.backgroundCommandsByListener.mobile.add({
        execute: (e: TouchEvent) =>
          this.feedParametersToCommand(
            e.touches[0].clientX,
            e.touches[0].clientY,
            command.execute
          ),
        start: (e: TouchEvent) =>
          this.feedParametersToCommand(
            e.touches[0].clientX,
            e.touches[0].clientY,
            command.start
          ),
        end: (e: TouchEvent) =>
          this.feedParametersToCommand(
            e.touches[0].clientX,
            e.touches[0].clientY,
            command.end
          ),
      });
    });
    this.commandInvoker.backgroundCommands.forEach((command) => {
      this.backgroundCommandsByListener.desktop.add({
        execute: (e: MouseEvent) =>
          this.feedParametersToCommand(e.clientX, e.clientY, command.execute),
        start: (e: MouseEvent) =>
          this.feedParametersToCommand(e.clientX, e.clientY, command.start),
        end: (e: MouseEvent) =>
          this.feedParametersToCommand(e.clientX, e.clientY, command.end),
      });
    });
  }

  private invokeBackgroundCommands(
    e: TouchEvent | MouseEvent,
    type: "start" | "end"
  ) {
    if (this.config.isTouchScreen) {
      this.backgroundCommandsByListener.mobile.forEach((commandFunctions) => {
        commandFunctions[type](e as never);
      });
    } else {
      this.backgroundCommandsByListener.desktop.forEach((commandFunctions) => {
        commandFunctions[type](e as never);
      });
    }
  }
  private addEventListenersToCanvas() {
    if (!this.canvas) return;
    if (this.config.isTouchScreen) {
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

  private addBackgroundCommandsEvents() {
    if (this.config.isTouchScreen) {
      this.backgroundCommandsByListener.mobile.forEach((commandFunctions) => {
        this.canvas.addEventListener("touchmove", commandFunctions.execute);
      });
    } else {
      this.backgroundCommandsByListener.desktop.forEach((commandFunctions) => {
        this.canvas.addEventListener("mousemove", commandFunctions.execute);
      });
    }
  }

  private removeBackgroundCommandsEvents() {
    if (this.config.isTouchScreen) {
      this.backgroundCommandsByListener.mobile.forEach((commandFunctions) => {
        this.canvas.removeEventListener("touchmove", commandFunctions.execute);
      });
    } else {
      this.backgroundCommandsByListener.desktop.forEach((commandFunctions) => {
        this.canvas.removeEventListener("mousemove", commandFunctions.execute);
      });
    }
  }
}

type TPixelPainter = InstanceType<typeof PixelPainter>;
enum TPainterListenersKeys {
  desktop = "desktop",
  mobile = "mobile"
};
type TPainterListeners = {
  [key in keyof TPainterListenersKeys]: { [key: string]: (e: Event) => void };
};
type TBaseConfig = typeof baseConfig;
type TBaseConfigParameter = Partial<TBaseConfig>;

export default PixelPainter;
export type {
  TPixelPainter,
  TPainterListeners,
  TPainterListenersKeys,
  TBaseConfig,
  TBaseConfigParameter
}
