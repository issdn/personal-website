export { default as painter, painterReady } from "./pixelPainterStore"
enum Actions {
    draw = "draw",
    erase = "erase",
    move = "move",
    placeholde = "placeholder"
}
export { Actions }