import type { TCellBoard } from "../internals/cellBoard";

type PaintFunctionContext = {
  color: string;
  size: number;
  accentColor: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

type CommandFunction = (
  [x, y, absX, absY]: [number, number, number, number],
  {
    interpolate,
    getCellBoardCell,
    getCellBoardCells,
  }: {
    interpolate: TCellBoard["interpolate"];
    getCellBoardCell: TCellBoard["getCellBoardCell"];
    getCellBoardCells: TCellBoard["getCellBoardCells"];
  }
) => void | ((paintCtx: PaintFunctionContext) => void);

type TCommand = (...args: unknown[]) => {
  start: CommandFunction;
  execute: CommandFunction;
  end: CommandFunction;
};

export type {
  PaintFunctionContext,
  CommandFunction,
  TCommand,
};
export { default as drawCommand } from "./draw";
export { default as eraseCommand } from "./erase";
export { default as placeholderCommand } from "./placeholder";
export { default as moveCommand } from "./move";
export { default as CommandInvoker } from "./commandInvoker";
