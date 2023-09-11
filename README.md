[Personal website](https://karolbielski.com/).

1. Translation
2. Pixel art painter
    - Dynamic import
    - Preload
    - Extendable through commands:
    ```typescript
    const cellBoard = new CellBoard(pixelPainter.config.gridSize, pixelPainter.config.borderWidth);
    const commandInvoker = new CommandInvoker();
    commandInvoker.commands
        .set('draw', drawCommand(cellBoard))
        .set('erase', eraseCommand(cellBoard))
        .set('move', moveCommand());
    commandInvoker.backgroundCommands.add(placeholderCommand(cellBoard));
    ```

Required Env variables:
MONGODB_DB_NAME: string
MONGODB_PASSWORD: string
MONGODB_USERNAME: string
NEW_PIXELS_COL_NAME: string
VERIFIED_PIXELS_COL_NAME: string
CANVAS_X: int
CANVAS_Y: int
