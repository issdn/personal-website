import { writable } from "svelte/store";
import PixelPainter from "../internals/pixelPainter";

export enum Actions {
  draw = "draw",
  erase = "erase",
  move = "move",
  placeholde = "placeholder"
}

const pixelPainter = new PixelPainter();
const painterStore = () => {
  const { subscribe, update } = writable<PixelPainter>(pixelPainter);
  return {
    subscribe,
    update,
  };
};

const painter = painterStore();

export default painter;
