<script lang="ts">
  import { fade } from "svelte/transition";
  import FormatPaint from "$lib/symbols/FormatPaint.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import SnackbarContainer from "$lib/components/SnackbarContainer.svelte";
  import language, { translator } from "$lib/components/languageStore";
  import { onMount } from "svelte";
  import tooltip from "$lib/components/tooltip/tooltipAction";
  import windowStore from "$lib/components/windowUtils";
  import Help from "$lib/symbols/Help.svelte";
  import Spinner from "$lib/components/Spinner.svelte";

  let PixelPainterToolBox: typeof import("$lib/components/pixel_painter/PixelPainterToolBox.svelte").default;
  let PixelPainter: typeof import("$lib/components/pixel_painter/PixelPainter.svelte").default;
  let painter: typeof import("$lib/components/pixel_painter/pixelPainterStore").default;
  let painterReady: typeof import("$lib/components/pixel_painter/pixelPainterStore").painterReady;

  $: translation = translator($language);
  let pageLoaded = false;
  let painterEnabled = false;
  let painterImported = false;

  const importPainter = async () => {
    painter = (await import("$lib/components/pixel_painter/pixelPainterStore"))
      .default;
    PixelPainterToolBox = (
      await import("$lib/components/pixel_painter/PixelPainterToolBox.svelte")
    ).default;
    PixelPainter = (
      await import("$lib/components/pixel_painter/PixelPainter.svelte")
    ).default;
    painterReady = (
      await import("$lib/components/pixel_painter/pixelPainterStore")
    ).painterReady;
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
    windowStore.setDeviceType("ontouchstart" in window ? "mobile" : "desktop");
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
          {translation("title")}
        </h1>
        <p>{translation("mainPar")}</p>
      </section>
    </div>
    <footer
      class="flex flex-col md:flex-row py-4 gap-x-6 gap-y-2 md:items-center text-sm [&>span]:w-fit [&>a]:w-fit"
    >
      <span
        class="bg-primary dark:bg-light text-light dark:text-dark rounded-md px-2"
        >Made with Svelte</span
      >
      <a
        target="_blank"
        href="https://commons.wikimedia.org/wiki/File:Octicons-mark-github.svg"
        >Github Icon</a
      >
      <a target="_blank" href="https://icons8.com/icons/set/linkedin"
        >Linkedin Icon</a
      >
      <a target="_blank" href="https://fonts.google.com/icons">Other Icons</a>
    </footer>
  </div>
  {#if painterEnabled}
    {#if !$painter || $painterReady === "false"}
      <span
        in:fade={{ duration: 1000, delay: 500 }}
        out:fade={{ duration: 125, delay: 0 }}
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
        use:tooltip={{ text: translation("painterInfo"), device: $windowStore }}
        ><Help class="fill-primary dark:fill-light h-6 w-6"
          ><desc>Information about pixel art painter</desc></Help
        ></span
      >
      <button
        disabled={!pageLoaded}
        aria-label="Toggle Pixel Painter"
        class={`bg-[length:400%] ${
          painterEnabled && "animate-background"
        } transition-[box-shadow] bg-special active:animate-background md:hover:animate-background fill-light rounded-md p-2 drop-shadow-lg`}
        on:click={handlePixelPainterOpen}
      >
        <FormatPaint class="h-icon-sm"
          ><desc>Turn on pixel art painter</desc></FormatPaint
        >
      </button>
    {/if}
  </div>
</div>
<SnackbarContainer />
