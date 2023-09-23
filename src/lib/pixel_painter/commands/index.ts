type PainterContext = {
    color: string;
    size: number;
    accentColor: string;
};

type GetRelativeCoordinatesFn = () => [number, number];

type CommandFunction = (
    getRelativeCoordinates: GetRelativeCoordinatesFn,
    x: number,
    y: number
) =>
    | void
    | ((
        ctx: CanvasRenderingContext2D,
        painterContext: PainterContext,
        canvas: HTMLCanvasElement
    ) => void);

type TCommand = (...args: unknown[]) => {
    start: CommandFunction;
    execute: CommandFunction;
    end: CommandFunction;
};

export type { PainterContext, GetRelativeCoordinatesFn, CommandFunction, TCommand }
export { default as drawCommand } from "./draw"
export { default as eraseCommand } from "./erase"
export { default as placeholderCommand } from "./placeholder"
export { default as moveCommand } from "./move"
export { default as CommandInvoker } from "./commandInvoker"