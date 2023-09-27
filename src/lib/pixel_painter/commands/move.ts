import type { CommandFunction, PaintFunctionContext } from ".";

const moveCommand = () => {
  let lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  let offset: { x: number; y: number } = { x: 0, y: 0 };
  let isMoving = false;
  let cursorStyleBefore = "";

  const start: CommandFunction = ([x, y, absX, absY]) => {
    lastMousePosition = { x: absX, y: absY };
    return ({ canvas }) => {
      cursorStyleBefore = getComputedStyle(canvas).cursor;
      canvas.style.cursor = "grabbing";
      offset = { x: canvas.offsetLeft, y: canvas.offsetTop };
      isMoving = true;
    };
  };

  const execute: CommandFunction = ([x, y, absX, absY]) => {
    if (!isMoving) return;
    const xShift = offset.x + absX - lastMousePosition.x;
    const yShift = offset.y + absY - lastMousePosition.y;
    return ({ canvas }) => {
      const {
        x: xCanvas,
        y: yCanvas,
        width,
        height,
      } = canvas.getBoundingClientRect();
      const setLeft = (x: number) => {
        canvas.style.left = x + "px";
      };
      const setTop = (y: number) => {
        canvas.style.top = y + "px";
      };
      if (xShift + xCanvas > 0) {
        setLeft(0);
      } else if (width + xShift < window.innerWidth) {
        setLeft(window.innerWidth - width);
      } else {
        setLeft(xShift);
      }
      if (yShift + yCanvas > 0) {
        setTop(0);
      } else if (height + yShift < window.innerHeight) {
        setTop(window.innerHeight - height);
      } else {
        setTop(yShift);
      }
    };
  };

  const end: CommandFunction = () => {
    return ({ canvas }) => {
      isMoving = false;
      canvas.style.cursor = cursorStyleBefore;
    };
  };

  return {
    start,
    execute,
    end,
  };
};

export default moveCommand;
