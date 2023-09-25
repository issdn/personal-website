<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import InfoBox from "$lib/visual_indicators/InfoBox.svelte";
  import { deviceType } from "$lib/stores";
  import painter, { cellBoard, painterReady } from "../stores/pixelPainterStore";
  import { darkmode } from "$lib/darkmode"

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

  onMount(() => {
    fetch("api/painter")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(
            "Failed to fetch data.",
            "This happened because of unknown issue. Please try again later."
          );
          painterReady.set("error");
        } else {
          painterReady.set("fetched");
          cellBoard.fromRawColorsArray(data.cells);
          painter.update((painter) =>
            painter.setConfig({ isTouchScreen: $deviceType === "mobile" })
          );
          $painter
            .init(canvas)
            .then(async (painterInstance) => {
              try {
                await painterInstance.draw();
                painterReady.set("drawn");
              } catch {
                setErrorMessage(
                  "The database isn't responding.",
                  "Please try again later."
                );
              }
            })
            .catch(() => {
              setErrorMessage(
                "Couldn't get canvas context.",
                "Your browser might not support canvas."
              );
            });
        }
      })
      .catch(() =>
        setErrorMessage(
          "Failed to fetch data.",
          "Check your internet connection."
        )
      );
  });

  onDestroy(() => {
    $painter.destroy();
    painterReady.set("false");
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
    style={$painterReady === "fetched" || $painterReady === "drawn"
      ? "opacity:1;"
      : "opacity: 0;"}
    class={`touch-none absolute transition-[opacity] duration-500`}
    bind:this={canvas}
  />
</div>
