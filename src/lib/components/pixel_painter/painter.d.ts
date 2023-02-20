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

interface ICommandInvoker {
	commands: Map<Actions, ReturnType<TCommand>>;
	backgroundCommands: Set<ReturnType<TCommand>>;
}

type TCell = InstanceType<typeof import('./pixelPainter').Cell>;
type TCellArray = TCell[][];
type TCellBoard = InstanceType<typeof import('./pixelPainter').CellBoard>;
type TRawCellBoard = (string | 0)[][];
type TPixelPainter = InstanceType<typeof import('./pixelPainter').PixelPainter>;
type PainterListeners = {
	[key in keyof PainterListenersKeys]: { [key: string]: (e: Event) => void };
};
type PainterListenersKeys = {
	desktop: string;
	mobile: string;
};
type TBaseConfig = typeof baseConfig;
type TBaseConfigParameter = Partial<TBaseConfig>;
