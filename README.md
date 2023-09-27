[Personal website](https://karolbielski.com/).

Around 160kB on initial load and ~240kB with pixel painter. DOM loads in ~200ms.

1. Translation.
    - Dynamic import
    - Preload
2. No library-components
3. Pixel art painter
    - Dynamic import
    - Preload
    - Extendable through commands using special command interface:
    ```typescript
    // The command implementation will look like:
    type CommandFunction = (
        ([x, y, absX, absY], {getCellBoardCells,...})) =>
        | void
        | ((...) => void);
    type TCommand = (...args: unknown[]) => {
        start: CommandFunction;
        execute: CommandFunction;
        end: CommandFunction;
    };
    // pixelPainterStore.ts
    const commandInvoker = new CommandInvoker();
    commandInvoker.commands
        .set('draw', drawCommand())
        .set('erase', eraseCommand())
        .set('move', moveCommand());
    commandInvoker.backgroundCommands.add(placeholderCommand());
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