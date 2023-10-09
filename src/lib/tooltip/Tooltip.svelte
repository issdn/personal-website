<script lang="ts">
  import { onMount, type ComponentType } from "svelte";
  import { fade } from "svelte/transition";
  import type { Sides } from "./tooltipAction";

  let shown = false;

  export let text = "";
  export let icon: ComponentType | null = null;
  export let className = "text-md";
  export let side: Sides;

  onMount(() => {
    shown = true;
  });

  const _styles = {
    bm: "top-[125%] left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2 after:bottom-full dark:after:!border-b-[#E8E2E2] after:!border-b-[#5d3891]",
    br: "top-[125%] left-full rounded-tl-none",
    bl: "top-[125%] right-full rounded-tr-none",
    tl: "bottom-[125%] right-full rounded-br-none",
    tr: "bottom-[125%] left-full rounded-bl-none",
    tm: "bottom-[125%] left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2 after:top-full dark:after:!border-t-[#E8E2E2] after:!border-t-[#5d3891]",
    r: "left-[125%] top-1/2 -translate-y-1/2 after:right-2 after:-translate-y-1/2 dark:after:!border-r-[#E8E2E2] after:!border-r-[#5d3891]",
    l: "right-[125%] top-1/2 -translate-y-1/2 after:left-2 after:-translate-y-1/2 dark:after:!border-l-[#E8E2E2] after:!border-l-[#5d3891]",
  };
</script>

{#if shown}
  <span
    transition:fade={{ duration: 125 }}
    role="tooltip"
    class={`transition-opacity delay-250 duration-200 after:border-transparent font-bold
  pointer-events-none drop-shadow-md after:content-[' '] after:border-[5px]
  after:border-solid after:absolute z-[50] absolute bg-primary dark:bg-light
  rounded-md px-2 py-2 text-light ${_styles[side]} dark:text-dark ${className}`}
  >
    {text}
    {#if icon}
      <svelte:component
        this={icon}
        class="h-4 w-4 inline fill-light dark:fill-dark"
      />
    {/if}
  </span>
{/if}
