import { writable } from "svelte/store";
import PixelPainter from "./pixelPainter";
import CellBoard from "./cellBoard";
import {
  CommandInvoker,
  drawCommand,
  eraseCommand,
  moveCommand,
  placeholderCommand,
} from "./commands";
import { Actions } from ".";

const pixelPainter = new PixelPainter();
const painterStore = () => {
  const { subscribe, update } = writable<PixelPainter>(pixelPainter);
  return {
    subscribe,
    update,
  };
};

const painterReadyStore = writable<"fetched" | "false" | "error" | "drawn">(
  "false"
);
const painter = painterStore();

const cellBoard = new CellBoard(
  pixelPainter.config.gridSize,
  pixelPainter.config.borderWidth
);
const commandInvoker = new CommandInvoker();
commandInvoker.commands
  .set(Actions.draw, drawCommand(cellBoard))
  .set(Actions.erase, eraseCommand(cellBoard))
  .set(Actions.move, moveCommand());
commandInvoker.backgroundCommands.add(placeholderCommand(cellBoard));

painter.update((painter) =>
  painter.setCellBoard(cellBoard).setCommandsInvoker(commandInvoker)
);

export { cellBoard, painterReadyStore as painterReady };
export default painter;
