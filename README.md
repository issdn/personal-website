[Personal website](https://karolbielski.com/).

Around 160kB on initial load and ~240kB with pixel painter.

1. Translation.
2. Pixel art painter
    - Dynamic import
    - Preload
    - Extendable through commands using special command and background command interface:
    ```typescript
    // The command implementation will look like:
    type TCommand = (...args: unknown[]) => {
        start: CommandFunction;
        execute: CommandFunction;
        end: CommandFunction;
    };
    type CommandFunction = (
        getRelativeCoordinates: GetRelativeCoordinatesFn,
        x: number,
        y: number
        ) =>
        | void
        | ((
            ctx: CanvasRenderingContext2D,
            painterContext: PainterContext,
            canvas: HTMLCanvasElement
            ) => void);
    // pixelPainterStore.ts
    const cellBoard = new CellBoard(pixelPainter.config.gridSize, pixelPainter.config.borderWidth);
    const commandInvoker = new CommandInvoker();
    commandInvoker.commands
        .set('draw', drawCommand(cellBoard))
        .set('erase', eraseCommand(cellBoard))
        .set('move', moveCommand());
    commandInvoker.backgroundCommands.add(placeholderCommand(cellBoard));
    ```

Data of colored pixels for pixel art painter is compressed with custom algorithm.
Best case scenario is no colored cells where the string size is 5B 
and worst case is when you have fully filled canvas witch a different color for every other column: ~500kB (cached for 1 day tho).

Required Env variables:
```env
MONGODB_HOSTNAME: string
MONGODB_DB_NAME: string
MONGODB_PASSWORD: string
MONGODB_USERNAME: string
NEW_PIXELS_COL_NAME: string
VERIFIED_PIXELS_COL_NAME: string
CANVAS_X: int
CANVAS_Y: int
```