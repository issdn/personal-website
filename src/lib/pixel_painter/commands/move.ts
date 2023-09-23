import type { GetRelativeCoordinatesFn, PainterContext } from ".";

const moveCommand = () => {
    let lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };
    let offset: { x: number; y: number } = { x: 0, y: 0 };
    let isMoving = false;
    let cursorStyleBefore = "";
  
    const start = (
      getRelativeCoordinates: GetRelativeCoordinatesFn,
      x: number,
      y: number
    ) => {
      lastMousePosition = { x: x, y: y };
      return (
        ctx: CanvasRenderingContext2D,
        painterContext: PainterContext,
        canvas: HTMLCanvasElement
      ) => {
        cursorStyleBefore = getComputedStyle(canvas).cursor;
        canvas.style.cursor = "grabbing";
        offset = { x: canvas.offsetLeft, y: canvas.offsetTop };
        isMoving = true;
      };
    }
  
    const execute = (
      getRelativeCoordinates: GetRelativeCoordinatesFn,
      x: number,
      y: number
    ) => {
      if (!isMoving) return;
      const xShift = offset.x + x - lastMousePosition.x;
      const yShift = offset.y + y - lastMousePosition.y;
      return (
        ctx: CanvasRenderingContext2D,
        painterContext: PainterContext,
        canvas: HTMLCanvasElement
      ) => {
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
    }
  
    const end = () => {
      return (
        ctx: CanvasRenderingContext2D,
        painterContext: PainterContext,
        canvas: HTMLCanvasElement
      ) => {
        isMoving = false;
        canvas.style.cursor = cursorStyleBefore;
      };
    }
  
    return {
      start,
      execute,
      end,
    };
  };

  export default moveCommand;