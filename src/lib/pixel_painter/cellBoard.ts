import Cell, { type TCell } from "./cell";

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
    let rawStr = "";
    let curr = cells[0].lastColor;
    let nrOfCurrs = 1;

    const conc = () => {
      if (!curr) {
        rawStr += "," + nrOfCurrs;
      } else {
        rawStr += "," + curr + nrOfCurrs;
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
   * E.g. "3,3,#1111113" -> [Cell[0,0,0], Cell[0,0,0], Cell[#1111113,#1111113,#1111113]]
   * @date 8/26/2023 - 12:14:34 PM
   *
   * @async
   * @param {string} pixelsString
   * @returns {void}
   */
  async fromRawColorsArray(pixelsString: string) {
    const cells: TCellArray = [];
    const pixelsStringSplitted = pixelsString.split(",");
    const size = parseInt(pixelsStringSplitted[0]);
    const pixelsArray = pixelsStringSplitted.slice(1);
    const flat = [];

    let row = 0;
    let col = 0;
    for (const item of pixelsArray) {
      if (item.startsWith("#")) {
        const color = item.slice(0, 7);
        const nrOfCells = parseInt(item.slice(7));
        for (let i = 0; i < nrOfCells; i++) {
          flat.push(
            new Cell(
              row * this.cellBorderSize,
              col * this.cellBorderSize,
              this.gridSize,
              color
            )
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
          flat.push(
            new Cell(
              row * this.cellBorderSize,
              col * this.cellBorderSize,
              this.gridSize
            )
          );
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

type TCellArray = TCell[][];
type TCellBoard = InstanceType<typeof import("./cellBoard").default>;
type TRawCellBoard = (string | 0)[][];
export default CellBoard;

export type { TCellArray, TCellBoard, TRawCellBoard }