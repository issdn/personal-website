<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import InfoBox from "$lib/visual_indicators/InfoBox.svelte";
  import painter, { Actions } from "../stores/pixelPainterStore";
  import { darkmode } from "$lib/darkmode";
  import CellBoard from "../internals/cellBoard";
  import {
    CommandInvoker,
    drawCommand,
    eraseCommand,
    moveCommand,
    placeholderCommand,
  } from "../commands";

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
        .setPainterContext({
          accentColor: $darkmode ? "#D9D9D9" : "#232323",
        })
    );
  }

  onMount(async () => {
    const cellBoard = CellBoard.fromRawColorsArray(cells, 10, 1);
    const commandInvoker = new CommandInvoker();
    commandInvoker.commands
      .set(Actions.draw, drawCommand())
      .set(Actions.erase, eraseCommand())
      .set(Actions.move, moveCommand());
    commandInvoker.backgroundCommands.add(placeholderCommand());
    try {
      $painter.init(canvas, cellBoard, commandInvoker);
      $painter.drawGrid($darkmode ? "#232323" : "#D9D9D9");
      $painter.drawCells()
      painterInitialized = true;
      $painter.setCanvasPositionToMiddle();
    } catch {
      setErrorMessage(
        "Couldn't get canvas context.",
        "Your browser might not support canvas."
      );
    }
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
    on:resize={$painter.setCanvasPositionToMiddle}
    style={painterInitialized ? "opacity:1;" : "opacity: 0;"}
    class={`touch-none absolute transition-[opacity] duration-500`}
    bind:this={canvas}
  />
</div>
