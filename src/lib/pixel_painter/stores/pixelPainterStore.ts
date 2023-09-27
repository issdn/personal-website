import { writable } from "svelte/store";
import PixelPainter from "../internals/pixelPainter";
import { isTouchScreen } from "$lib/stores/device"

export enum Actions {
  draw = "draw",
  erase = "erase",
  move = "move",
  placeholde = "placeholder",
}
let _isTouchScreen: boolean;
isTouchScreen.subscribe((is) => (_isTouchScreen = is));
const pixelPainter = new PixelPainter(_isTouchScreen!, 250, 125);
const painterStore = () => {
  const { subscribe, update } = writable<PixelPainter>(pixelPainter);
  return {
    subscribe,
    update,
  };
};

const painter = painterStore();

export default painter;
