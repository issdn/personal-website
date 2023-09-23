<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import snackbars from "../snackbar/snackbars";
  import { slide } from "svelte/transition";
  import Close from "$lib/symbols/Close.svelte";
  import CheckCircle from "$lib/symbols/CheckCircle.svelte";
  import Error from "$lib/symbols/Error.svelte";
  import { focusOnMount } from "../pixel_painter/actions";
  import { SnackbarType, type SnackbarStyleObject, type SnackbarSettingObject } from ".";

  const widthAnimate = (
    node: HTMLElement,
    { duration }: { duration: number }
  ) => {
    return {
      duration,
      css: (t: number) => {
        return `width: ${(1 - t) * 100}%;`;
      },
    };
  };

  export let id: string;
  export let title: string;
  export let detail: string | null = null;
  export let type: SnackbarType = SnackbarType.success;
  export let duration: number;
  export let timeout: NodeJS.Timeout;

  const styles: SnackbarStyleObject = {
    success: "bg-green-600",
    error: "bg-red-600",
  };

  const barColors: SnackbarStyleObject = {
    success: "bg-green-900",
    error: "bg-red-900",
  };

  const icons: SnackbarSettingObject = {
    success: CheckCircle,
    error: Error,
  };

  const handleClose = () => {
    snackbars.remove(id);
  };

  let show = false;

  onMount(() => {
    show = true;
  });

  onDestroy(() => {
    show = false;
    clearTimeout(timeout);
  });
</script>

{#if show}
  <div
    transition:slide
    class={`${styles[type]} text-light relative overflow-hidden pointer-events-auto rounded-md drop-shadow-lg justify-between md:max-w-[28rem] flex flex-row gap-x-4 py-2 px-4 items-center`}
  >
    <svelte:component this={icons[type]} class="h-16 fill-light" />
    <div class="flex flex-col font-primary break-all w-full">
      <h1 class="font-bold text-lg break-all">{title}</h1>
      {#if detail}
        <span>{detail}</span>
      {/if}
    </div>
    <button
      class="hover:opacity-80 text-5xl"
      use:focusOnMount
      on:click={handleClose}><Close class="h-8 fill-light/80" /></button
    >
    <div
      in:widthAnimate={{ duration: duration }}
      class={`absolute h-1 w-0 rounded-b-md bottom-0 left-0 ${barColors[type]}`}
    />
  </div>
{/if}
