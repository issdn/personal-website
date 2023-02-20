const baseConfig = {
	gridSize: 10,
	borderWidth: 1,
	accentColor: '2b2b2b',
	xCellAmount: 250,
	yCellAmount: 125,
	isTouchScreen: false
};

class Cell {
	x: number;
	y: number;
	size: number;
	lastColor: null | string = null;
	originColor: null | string = null;
	owned = false;

	constructor(x: number, y: number, size: number, originColor: null | string = null) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.originColor = originColor;
	}

	draw(ctx: CanvasRenderingContext2D, color: string) {
		this.lastColor = color;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}

	drawPlaceholder(ctx: CanvasRenderingContext2D, color: string) {
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.size, this.size);
		ctx.globalAlpha = 1;
	}

	clear(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(this.x, this.y, this.size, this.size);
	}

	reset = (ctx: CanvasRenderingContext2D) => {
		if (!this.owned) return;
		if (!this.originColor) {
			this.clear(ctx);
		} else {
			this.draw(ctx, this.originColor);
		}
		this.lastColor = null;
		this.owned = false;
	};

	removePlaceholder(ctx: CanvasRenderingContext2D) {
		if (this.owned) {
			ctx.fillStyle = this.lastColor as string;
			ctx.fillRect(this.x, this.y, this.size, this.size);
		} else {
			if (this.originColor) {
				this.draw(ctx, this.originColor);
				this.lastColor = null;
			} else {
				this.clear(ctx);
			}
		}
	}

	equals(cell: TCell | null) {
		if (!cell) return false;
		return this.x === cell.x && this.y === cell.y;
	}
}

class CellBoard {
	cells: TCellArray = [];

	gridSize: number;
	borderWidth: number;
	cellBorderSize: number;

	constructor(gridSize: number, borderWidth: number) {
		this.gridSize = gridSize;
		this.borderWidth = borderWidth;
		this.cellBorderSize = gridSize + borderWidth;
	}

	getCellBoardCell(x: number, y: number): TCell {
		const cellX = Math.floor(x / this.cellBorderSize);
		const cellY = Math.floor(y / this.cellBorderSize);
		return this.cells?.[cellX]?.[cellY];
	}

	getCellBoardCells(x: number, y: number, radius: number): TCell[] {
		const cellX = Math.floor(x / this.cellBorderSize);
		const cellY = Math.floor(y / this.cellBorderSize);
		const radiusFloored = Math.floor(radius);
		const cells: TCell[] = [];
		for (let x = 0 - radiusFloored; x <= radiusFloored; x++) {
			for (let y = 0 - radiusFloored; y <= radiusFloored; y++) {
				const cell = this.cells[cellX + Math.floor(x)]?.[cellY + Math.floor(y)];
				if (cell) cells.push(cell);
			}
		}
		return cells;
	}

	interpolate(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		callback: (x: number, y: number) => void
	) {
		const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
		const steps = Math.ceil(distance) + 1;
		const stepX = (x2 - x1) / steps;
		const stepY = (y2 - y1) / steps;
		for (let i = 0; i < steps; i += this.cellBorderSize) {
			const interpX = x1 + stepX * i;
			const interpY = y1 + stepY * i;
			callback(interpX, interpY);
		}
	}

	/**
	 * Creates a string containing data of the cell board.
	 * E.g. with simplified cell board:
	 * input -> [Cell {color: null},{color: #111111},{color: #111111},{color: #222222},{color: null},{color: null}]
	 * output -> 3,1,#1111112,#2222221,1
	 * Where first number is the side length, second the number of zeros in row and third is 6-number hex color where 7th number is the number of same colors in row.
	 * @date 8/26/2023 - 12:57:32 PM
	 * @async
	 * @returns {string}
	 */
	async toRawColorsString() {
		const nrOfRows = this.cells.length;
		const cells = this.cells.flat();
		let rawStr = '';
		let curr = cells[0].lastColor;
		let nrOfCurrs = 1;

		const conc = () => {
			if (!curr) {
				rawStr += ',' + nrOfCurrs;
			} else {
				rawStr += ',' + curr + nrOfCurrs;
			}
		};

		for (let i = 1; i < cells.length; i++) {
			if (cells[i].lastColor === curr) {
				nrOfCurrs += 1;
			} else {
				conc();
				curr = cells[i].lastColor;
				nrOfCurrs = 1;
			}
		}
		if (nrOfCurrs > 0) conc();
		return nrOfRows + rawStr;
	}

	/**
	 * Creates a cell board from a string containing data of the cell board.
	 * String has to be in format: [side length],[number of zeros in row or 6-digit hex color with 7th number being the number of same colors in row]
	 * E.g. "3,3,#1111116"
	 * @date 8/26/2023 - 12:14:34 PM
	 *
	 * @	 * @async
	 * @param {string} pixelsString
	 * @returns {void}
	 */
	async fromRawColorsArray(pixelsString: string) {
		const cells: TCellArray = [];
		const pixelsStringSplitted = pixelsString.split(',');
		const size = parseInt(pixelsStringSplitted[0]);
		const pixelsArray = pixelsStringSplitted.slice(1);
		const flat = [];

		let row = 0;
		let col = 0;
		for (const item of pixelsArray) {
			if (item.startsWith('#')) {
				const color = item.slice(0, 7);
				const nrOfCells = parseInt(item.slice(7));
				for (let i = 0; i < nrOfCells; i++) {
					flat.push(
						new Cell(row * this.cellBorderSize, col * this.cellBorderSize, this.gridSize, color)
					);
					col += 1;
					if (col >= size) {
						row += 1;
						col = 0;
					}
				}
			} else {
				const nrOfCells = parseInt(item);
				for (let i = 0; i < nrOfCells; i++) {
					flat.push(new Cell(row * this.cellBorderSize, col * this.cellBorderSize, this.gridSize));
					col += 1;
					if (col >= size) {
						row += 1;
						col = 0;
					}
				}
			}
		}

		for (let i = 0; i < size; i++) {
			cells.push(flat.slice(i * size, i * size + size));
		}
		this.cells = cells;
	}
}

class PixelPainter {
	canvas!: HTMLCanvasElement;
	cellBoard!: CellBoard;
	action!: Actions;
	config: TBaseConfig;
	private canvasSize = { width: 0, height: 0 };
	private ctx!: CanvasRenderingContext2D;
	private commandInvoker!: ICommandInvoker;
	private lastAction!: Actions;
	private quickAction = false;
	private painterContext!: PainterContext;

	private commandsByListener: {
		mobile: Map<'touchstart' | 'touchmove' | 'touchend', (e: TouchEvent) => void>;
		desktop: Map<'mousedown' | 'mousemove' | 'mouseup' | 'mouseleave', (e: MouseEvent) => void>;
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
		const ctx = this.canvas.getContext('2d');
		if (!ctx) throw new Error('Context is null');
		this.ctx = ctx;
		this.setCommandsByListener();
		this.createBackgroundCommandsEventsObject();
		this.addEventListenersToCanvas();
		this.addBackgroundCommandsEvents();
		return this;
	}

	async draw() {
		if (!this.cellBoard) throw new Error('Cell board is not set');
		this.canvasSize = this.getSideLengthInPX();
		/*
		 * If the canvas is smaller than the window, we need to resize it.
		 * Number of cells has to be static so their size has to be larger.
		 */
		if (this.canvasSize.width < window.innerWidth || this.canvasSize.height < window.innerHeight) {
			const gridSize = this.getCellSizeFromSidesLength(window.innerWidth, window.innerHeight);
			this.config = {
				...this.config,
				borderWidth: Math.floor((gridSize * 10) / 100),
				gridSize: gridSize
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

	private resetQuickAction() {
		if (!this.quickAction) return;
		this.quickAction = false;
		this.action = this.lastAction;
	}

	setCellBoard(cellBoard: CellBoard) {
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
		this.setAction(action);
		return this;
	}

	setAction(action: Actions) {
		if (action === this.action) return this;
		this.lastAction = this.action;
		this.action = action;
		return this;
	}

	public setCanvasPositionToMiddle() {
		this.canvas.style.left = -this.canvas.width / 2 + window.innerWidth / 2 + 'px';
		this.canvas.style.top = -this.canvas.height / 2 + window.innerHeight / 2 + 'px';
	}

	private getSideLengthInPX() {
		return {
			width: this.config.xCellAmount * (this.config.gridSize + this.config.borderWidth),
			height: this.config.yCellAmount * (this.config.gridSize + this.config.borderWidth)
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
		return Math.max(xLength / this.config.xCellAmount, yLength / this.config.yCellAmount);
	}

	private setCanvasSize() {
		this.canvas.style.width = this.canvasSize.width + 'px';
		this.canvas.style.height = this.canvasSize.height + 'px';
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
		fn(() => this.getRelativeCoordinates(x, y), x, y)?.(this.ctx, this.painterContext, this.canvas);
	}

	private setCommandsByListener() {
		this.commandsByListener.mobile
			.set('touchstart', (e: TouchEvent) => {
				this.invokeBackgroundCommands(e, 'start');
				this.removeBackgroundCommandsEvents();
				if (e.touches.length >= 2) {
					this.setQuickAction('move');
				}
				this.feedParametersToCommand(
					e.touches[0].clientX,
					e.touches[0].clientY,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.commandInvoker.commands.get(this.action)!.start
				);
			})
			.set('touchmove', (e: TouchEvent) =>
				this.feedParametersToCommand(
					e.touches[0].clientX,
					e.touches[0].clientY,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.commandInvoker.commands.get(this.action)!.execute
				)
			)
			.set('touchend', (e: TouchEvent) => {
				this.feedParametersToCommand(
					e.touches[0].clientX,
					e.touches[0].clientY,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.commandInvoker.commands.get(this.action)!.end
				);
				this.resetQuickAction();
				this.invokeBackgroundCommands(e, 'end');
				this.addBackgroundCommandsEvents();
			});
		this.commandsByListener.desktop
			.set('mousedown', (e: MouseEvent) => {
				this.invokeBackgroundCommands(e, 'start');
				this.removeBackgroundCommandsEvents();
				if (e.button === 1 || e.button === 2) {
					this.setQuickAction('move');
				}
				this.feedParametersToCommand(
					e.clientX,
					e.clientY,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.commandInvoker.commands.get(this.action)!.start
				);
			})
			.set('mousemove', (e: MouseEvent) =>
				this.feedParametersToCommand(
					e.clientX,
					e.clientY,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.commandInvoker.commands.get(this.action)!.execute
				)
			)
			.set('mouseup', (e: MouseEvent) => {
				this.feedParametersToCommand(
					e.clientX,
					e.clientY,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.commandInvoker.commands.get(this.action)!.end
				);
				this.resetQuickAction();
				this.invokeBackgroundCommands(e, 'end');
				this.addBackgroundCommandsEvents();
			})
			.set('mouseleave', (e: MouseEvent) => {
				this.feedParametersToCommand(
					e.clientX,
					e.clientY,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.commandInvoker.commands.get(this.action)!.end
				);
				this.resetQuickAction();
				this.invokeBackgroundCommands(e, 'end');
				this.addBackgroundCommandsEvents();
			});
	}

	private createBackgroundCommandsEventsObject() {
		this.commandInvoker.backgroundCommands.forEach((command) => {
			this.backgroundCommandsByListener.mobile.add({
				execute: (e: TouchEvent) =>
					this.feedParametersToCommand(e.touches[0].clientX, e.touches[0].clientY, command.execute),
				start: (e: TouchEvent) =>
					this.feedParametersToCommand(e.touches[0].clientX, e.touches[0].clientY, command.start),
				end: (e: TouchEvent) =>
					this.feedParametersToCommand(e.touches[0].clientX, e.touches[0].clientY, command.end)
			});
		});
		this.commandInvoker.backgroundCommands.forEach((command) => {
			this.backgroundCommandsByListener.desktop.add({
				execute: (e: MouseEvent) =>
					this.feedParametersToCommand(e.clientX, e.clientY, command.execute),
				start: (e: MouseEvent) => this.feedParametersToCommand(e.clientX, e.clientY, command.start),
				end: (e: MouseEvent) => this.feedParametersToCommand(e.clientX, e.clientY, command.end)
			});
		});
	}

	private invokeBackgroundCommands(e: TouchEvent | MouseEvent, type: 'start' | 'end') {
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
			window.addEventListener('visibilitychange', this.resetQuickAction);
			this.commandsByListener.desktop.forEach((value, key) => {
				this.canvas.addEventListener(key, value);
			});
		}
	}

	private addBackgroundCommandsEvents() {
		if (this.config.isTouchScreen) {
			this.backgroundCommandsByListener.mobile.forEach((commandFunctions) => {
				this.canvas.addEventListener('touchmove', commandFunctions.execute);
			});
		} else {
			this.backgroundCommandsByListener.desktop.forEach((commandFunctions) => {
				this.canvas.addEventListener('mousemove', commandFunctions.execute);
			});
		}
	}

	private removeBackgroundCommandsEvents() {
		if (this.config.isTouchScreen) {
			this.backgroundCommandsByListener.mobile.forEach((commandFunctions) => {
				this.canvas.removeEventListener('touchmove', commandFunctions.execute);
			});
		} else {
			this.backgroundCommandsByListener.desktop.forEach((commandFunctions) => {
				this.canvas.removeEventListener('mousemove', commandFunctions.execute);
			});
		}
	}

	destroy() {
		if (!this.canvas) return;
		if (this.config.isTouchScreen) {
			this.commandsByListener.mobile.forEach((value, key) => {
				this.canvas.removeEventListener(key, value);
			});
		} else {
			window.removeEventListener('visibilitychange', this.resetQuickAction);
			this.commandsByListener.desktop.forEach((value, key) => {
				this.canvas.removeEventListener(key, value);
			});
		}
	}
}

export { CellBoard, Cell };
export default PixelPainter;
