<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import InfoBox from "$lib/visual_indicators/InfoBox.svelte";
  import { deviceType } from "$lib/stores";
  import painter, { Actions } from "../stores/pixelPainterStore";
  import { darkmode } from "$lib/darkmode";
  import CellBoard from "../internals/cellBoard";
  import { CommandInvoker, drawCommand, eraseCommand, moveCommand, placeholderCommand } from "../commands";

  export let cells: string;
  export let painterInitialized: boolean = false;

  let error: { message: string; detail: string } | null = null;
  let canvas: HTMLCanvasElement;

  const setErrorMessage = (message: string, detail: string) => {
    error = {
      message,
      detail,
    };
  };

  $: {
    painter.update((painter) =>
      painter
        .setConfig({ accentColor: $darkmode ? "#232323" : "#D9D9D9" })
        .setPainterContext({
          accentColor: $darkmode ? "#D9D9D9" : "#232323",
        })
    );
  }

  onMount(async () => {
    const cellBoard = new CellBoard(
      $painter.config.gridSize,
      $painter.config.borderWidth
    );
    await cellBoard.fromRawColorsArray(cells)
    const commandInvoker = new CommandInvoker();
    commandInvoker.commands
      .set(Actions.draw, drawCommand(cellBoard))
      .set(Actions.erase, eraseCommand(cellBoard))
      .set(Actions.move, moveCommand());
    commandInvoker.backgroundCommands.add(placeholderCommand(cellBoard));
    painter.update((painter) =>
      painter.setCellBoard(cellBoard)
      .setCommandsInvoker(commandInvoker)
      .setConfig({ isTouchScreen: $deviceType === "mobile" })
    );
    painterInitialized = true;
    $painter
      .init(canvas)
      .then(async (painterInstance) => {
        await painterInstance.draw();
      })
      .catch(() => {
        setErrorMessage(
          "Couldn't get canvas context.",
          "Your browser might not support canvas."
        );
      });
  });

  onDestroy(() => {
    $painter.destroy();
  });
</script>

<!-- 
	@component
	Creates a canvas element and draws the pixel painter on it.
	Handles the loading and error states.
 -->
{#if error}
  <InfoBox
    class="absolute drop-shadow-lg top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
  >
    <div class="flex flex-col">
      <h1 class="font-primary font-bold">{error.message}</h1>
      <p class="text-sm">{error.detail}</p>
    </div>
  </InfoBox>
{/if}
<div class="absolute overflow-hidden top-0 left-0 h-full w-full z-0 box-border">
  <canvas
    style={painterInitialized ? "opacity:1;" : "opacity: 0;"}
    class={`touch-none absolute transition-[opacity] duration-500`}
    bind:this={canvas}
  />
</div>
