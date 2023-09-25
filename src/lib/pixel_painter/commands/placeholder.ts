import type { GetRelativeCoordinatesFn, PainterContext } from ".";
import type { TCell } from "../cell";
import type { TCellBoard } from "../cellBoard";

const placeholderCommand = (cellBoard: TCellBoard) => {
    let previousPlaceholder: TCell[] = [];

    const clearPlaceholder = (ctx: CanvasRenderingContext2D) => {
        for (const cell of previousPlaceholder) {
            cell.removePlaceholder(ctx);
        }
    }

    const execute = (getRelativeCoordinates: GetRelativeCoordinatesFn) => {
        return (ctx: CanvasRenderingContext2D, painterContext: PainterContext) => {
            const cells = cellBoard.getCellBoardCells(
                ...getRelativeCoordinates(),
                painterContext.size
            );
            clearPlaceholder(ctx);
            for (const cell of cells) {
                cell.drawPlaceholder(ctx, painterContext.accentColor);
            }
            previousPlaceholder = cells;
        };
    }

    return {
        execute,
        start: () => {
            return (ctx: CanvasRenderingContext2D) => {
                clearPlaceholder(ctx);
            };
        },
        end: () => {
            return (ctx: CanvasRenderingContext2D) => {
                clearPlaceholder(ctx);
            };
        },
    };
};

export default placeholderCommand;