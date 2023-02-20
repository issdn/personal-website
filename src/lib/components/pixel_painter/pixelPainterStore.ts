import { writable } from 'svelte/store';
import PixelPainter, { CellBoard } from './pixelPainter';
import {
	CommandInvoker,
	drawCommand,
	eraseCommand,
	moveCommand,
	placeholderCommand
} from './painterCommands';

const pixelPainter = new PixelPainter();
const painterStore = () => {
	const { subscribe, update } = writable<PixelPainter>(pixelPainter);
	return {
		subscribe,
		update
	};
};
const painterReadyStore = writable(false);
const painter = painterStore();

const cellBoard = new CellBoard(pixelPainter.config.gridSize, pixelPainter.config.borderWidth);
const commandInvoker = new CommandInvoker();
commandInvoker.commands
	.set('draw', drawCommand(cellBoard))
	.set('erase', eraseCommand(cellBoard))
	.set('move', moveCommand());
commandInvoker.backgroundCommands.add(placeholderCommand(cellBoard));

painter.update((painter) => painter.setCellBoard(cellBoard).setCommandsInvoker(commandInvoker));

export { cellBoard, painterReadyStore as painterReady };
export default painter;
