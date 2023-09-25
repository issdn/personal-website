<script lang="ts">
  import { fade } from "svelte/transition";
  import FormatPaint from "$lib/symbols/FormatPaint.svelte";
  import Navbar from "$lib/layout/Navbar.svelte";
  import SnackbarContainer from "$lib/snackbar/SnackbarContainer.svelte";
  import { onMount } from "svelte";
  import { tooltip } from "$lib/tooltip";
  import { DeviceType, deviceType } from "$lib/stores";
  import Help from "$lib/symbols/Help.svelte";
  import Spinner from "$lib/visual_indicators/Spinner.svelte";
  import { texts } from "$lib/translation";
  import en from "$lib/translation/en.json";

  texts.set(en);

  let PixelPainterToolBox: typeof import("$lib/pixel_painter/PixelPainterToolBox.svelte").default;
  let PixelPainter: typeof import("$lib/pixel_painter/PixelPainter.svelte").default;
  let painter: typeof import("$lib/pixel_painter/pixelPainterStore").default;
  let painterReady: typeof import("$lib/pixel_painter/pixelPainterStore").painterReady;

  let pageLoaded = false;
  let painterEnabled = false;
  let painterImported = false;

  const importPainter = async () => {
    const painterItems = (await import("$lib/pixel_painter/pixelPainterStore"));
    painterReady = painterItems.painterReady
    painter = painterItems.default
    PixelPainterToolBox = (
      await import("$lib/pixel_painter/PixelPainterToolBox.svelte")
    ).default;
    PixelPainter = (await import("$lib/pixel_painter/PixelPainter.svelte"))
      .default;
  };

  const handlePixelPainterOpen = async () => {
    if (!painterEnabled) {
      painterEnabled = true;
    } else {
      painterEnabled = false;
    }
    if (!painterImported) {
      await importPainter();
      painterImported = true;
    }
  };

  onMount(() => {
    deviceType.setDeviceType(
      "ontouchstart" in window ? DeviceType.Mobile : DeviceType.Desktop
    );
    pageLoaded = true;
  });
</script>

<div
  class="min-h-full max-h-[100vh] max-w-[100vw] overflow-hidden relative h-full bg-light dark:bg-dark"
>
  <div
    class={`${
      painterEnabled && "pointer-events-none opacity-50"
    } duration-500 relative h-full w-full px-4 md:px-16 lg:px-[20%] xl:px-[30%] py-8 flex flex-col justify-between gap-y-24`}
  >
    <Navbar />
    <div class="flex flex-col h-full gap-y-24">
      <section transition:fade={{ delay: 200 }} class="text-xl">
        <h1 class="text-5xl font-extrabold font-primary">
          {$texts["title"]}
        </h1>
        <p>{$texts["mainPar"]}</p>
      </section>
    </div>
    <footer
      class="flex flex-col py-4 gap-y-6 md:gap-2 text-md w-full"
    >
      <div class="flex flex-col md:flex-row gap-x-6 gap-y-1">
        <span
          class="bg-primary dark:bg-light text-light w-fit dark:text-dark rounded-md px-2"
          >{$texts["MadeWithSvelte"]}</span
        >
        <a href="mailto:karol.bielski@gmx.de" class="w-fit">karol.bielski@gmx.de</a>
      </div>
      <div class="flex flex-col md:flex-row gap-x-6 opacity-60 [&>a]:w-fit">
        <a
          target="_blank"
          href="https://commons.wikimedia.org/wiki/File:Octicons-mark-github.svg"
          >{$texts["GithubIcon"]}</a
        >
        <a target="_blank" href="https://icons8.com/icons/set/linkedin"
          >{$texts["LinkedInIcon"]}</a
        >
        <a target="_blank" href="https://fonts.google.com/icons"
          >{$texts["OtherIcons"]}</a
        >
      </div>
    </footer>
  </div>
  {#if painterEnabled}
    {#if $painterReady === "false"}
      <span
        in:fade={{ duration: 1000 }}
        out:fade={{ duration: 125 }}
        class="absolute left-1/2 gap-y-4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <Spinner />
      </span>
    {/if}
    {#if painterImported}
      <svelte:component this={PixelPainter} />
    {/if}
  {/if}
  {#if $painterReady === "drawn"}
    <svelte:component this={PixelPainterToolBox} />
  {/if}

  <div
    class="absolute bottom-10 right-4 md:right-16 lg:right-10 flex flex-row gap-x-1 items-end z-10"
  >
    {#if !pageLoaded}
      <Spinner size="sm" />
    {:else}
      <span
        tabindex="0"
        role="button"
        on:mouseover={importPainter}
        on:touchstart={importPainter}
        on:focus={importPainter}
        aria-label="Information about pixel art painter"
        class={`drop-shadow-lg cursor-help w-fit h-fit text-sm`}
        use:tooltip={{
          text: $texts["painterInfo"],
          device: $deviceType,
        }}
        ><Help class="fill-primary dark:fill-light h-8 w-8"
          ><desc>Information about pixel art painter</desc></Help
        ></span
      >
      <button
        disabled={!pageLoaded}
        aria-label="Toggle Pixel Painter"
        class={`bg-[length:400%] ${
          painterEnabled && "animate-background"
        } transition-[box-shadow] bg-special-gradient active:animate-background md:hover:animate-background fill-light rounded-md p-2 drop-shadow-lg`}
        on:click={handlePixelPainterOpen}
      >
        <FormatPaint class="h-10"
          ><desc>Turn on pixel art painter</desc></FormatPaint
        >
      </button>
    {/if}
  </div>
</div>
<SnackbarContainer />
