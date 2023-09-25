class Cell {
  x: number;
  y: number;
  size: number;
  lastColor: null | string = null;
  originColor: null | string = null;
  owned = false;

  constructor(
    x: number,
    y: number,
    size: number,
    originColor: null | string = null
  ) {
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

type TCell = InstanceType<typeof import("./cell").default>;
export default Cell
export type { TCell }
