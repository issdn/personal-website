<script lang="ts">
  import type { ComponentType } from "svelte";
  import {
    adjustTooltipPosition,
    getWidestPossibleSideAndSetWidth,
  } from "./tooltipPositionFunctions";

  export let text = "";
  export let icon: ComponentType | null = null;
  export let textSize = "text-md";

  let positionClasses: string = "";
  let tooltip: HTMLSpanElement;
  let styles = "";

  $: if (tooltip) {
    let _posClasses = adjustTooltipPosition(tooltip, window, 50);
    if (_posClasses) {
      positionClasses = _posClasses;
    } else {
      styles = "white-space: normal;";
      let newSqushedPos = getWidestPossibleSideAndSetWidth(tooltip, window);
      // If the newSquashedPos is passed then it will return string always.
      positionClasses = adjustTooltipPosition(
        tooltip,
        window,
        50,
        newSqushedPos
      ) as string;
    }
  }
</script>

<span
  role="tooltip"
  bind:this={tooltip}
  style={`${tooltip ? "opacity: 1;" : "opacity: 0;"}${styles}`}
  class={`transition-opacity delay-250 duration-200 after:border-transparent font-bold whitespace-nowrap pointer-events-none drop-shadow-md after:content-[' '] after:border-[5px] after:border-solid after:absolute z-[50] absolute bg-primary dark:bg-light rounded-md px-2 py-2 text-light dark:text-dark ${textSize} ${positionClasses}`}
>
  {text}
  {#if icon}
    <svelte:component
      this={icon}
      class="h-4 w-4 inline fill-light dark:fill-dark"
    />
  {/if}
</span>

<style>
  :root {
    --arrowNodeGapSize: 50%;
  }

  /* Sets where tooltip will be positioned around a node */
  .rm {
    top: calc(var(--arrowNodeGapSize) + 100%);
    left: 0;
    transform: translateY(-50%);
  }
  .lm {
    top: calc(var(--arrowNodeGapSize) + 100%);
    right: 0;
    transform: translateY(-50%);
  }
  .tm {
    bottom: calc(var(--arrowNodeGapSize) + 100%);
    left: 50%;
    transform: translateX(-50%);
  }
  .bm {
    top: calc(var(--arrowNodeGapSize) + 100%);
    left: 50%;
    transform: translateX(-50%);
  }
  .tl {
    bottom: calc(var(--arrowNodeGapSize) + 100%);
    right: 0;
  }
  .tr {
    bottom: calc(var(--arrowNodeGapSize) + 100%);
    left: 0;
  }
  .bl {
    top: calc(var(--arrowNodeGapSize) + 100%);
    right: 0;
  }
  .br {
    top: calc(var(--arrowNodeGapSize) + 100%);
    left: 0;
  }
  .l {
    top: 50%;
    right: calc(var(--arrowNodeGapSize) + 100%);
    transform: translateY(-50%);
  }
  .r {
    top: 50%;
    left: calc(var(--arrowNodeGapSize) + 100%);
    transform: translateY(-50%);
  }

  .tSide::after {
    bottom: 100%;
  }

  .bSide::after {
    top: 100%;
  }

  .lSide::after {
    right: 100%;
  }

  .rSide::after {
    left: 100%;
  }

  /* For arrowPositions */

  .tPos::after {
    top: 6cm;
  }

  .bPos::after {
    bottom: 6px;
  }

  .lPos::after {
    left: 6px;
  }

  .rPos::after {
    right: 6px;
  }

  .mvPos::after {
    top: 50%;
    transform: translateY(-50%);
  }

  .mhPos::after {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
