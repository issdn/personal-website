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
  import en from "$lib/translation/languages/en";
  import { SnackbarType, snackbars } from "$lib/snackbar";

  texts.set(en);

  let pageLoaded = false;
  let painterEnabled = false;

  /*
  * Most of the code below will dynamically fetch the pixel painter and cells.
  * On hover it will create a allSettled promise and on click,
  * it will add a `then` clause to it where it will be checked whether all
  * promises are settled: if not - disable painter and show a snackbar,
  * if yes - mount the pixel painter and pass cells to it.
  */
  const addErrorSnackbar = () => {
    snackbars.add("Failed to fetch data.", {
      detail:
        "This happened because of unknown issue. Please try again later.",
      type: SnackbarType.error,
    });
    painterEnabled = false;
  }

  const fetchPainterCells = async (): Promise<string | undefined> => {
    const response = await fetch("api/painter")
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Couldn't fetch cells.")
    } else {
      return data.cells;
    }
  }

  let painterData: Promise<[
    PromiseSettledResult<typeof import("$lib/pixel_painter/components/PixelPainterContainer.svelte").default>, 
    PromiseSettledResult<string | undefined>
  ]>;

  const importPainter = () => {
    if (!painterData) {
      painterData = Promise.allSettled([
        import("$lib/pixel_painter/components/PixelPainterContainer.svelte")
        .then(({default: c}) => c),
        fetchPainterCells()
      ])
    }
  };

  const handlePixelPainterOpen = () => {
    painterData.then(data => {
      for(const settledResult of data) {
        if(settledResult.status === "rejected") {
          addErrorSnackbar()
          return;
        }
      }
    })
    painterEnabled = painterEnabled ? false : true;
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
      painterEnabled && "[&>section,nav,footer]:pointer-events-none [&>section,nav,footer]:opacity-50"
    } duration-500 h-full w-full px-4 md:px-16 lg:px-[20%] xl:px-[30%] py-8 flex flex-col justify-between gap-y-24`}
  >
    <Navbar />
    <main class="flex flex-col h-full gap-y-24">
      <section transition:fade={{ delay: 200 }} class="text-xl">
        <h1 class="text-5xl font-extrabold font-primary">
          {$texts["title"]}
        </h1>
        <p>{$texts["mainPar"]}</p>
      </section>
      {#if painterEnabled}
      {#await painterData}
        <span
          in:fade={{ duration: 250 }}
          out:fade={{ duration: 125 }}
          class="absolute left-1/2 gap-y-4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <Spinner />
        </span>
      {:then settledResults}
        {#if settledResults[0].status === "fulfilled" 
          && settledResults[1].status === "fulfilled" 
          && settledResults[1].value}
          <svelte:component cells={settledResults[1].value} this={settledResults[0].value} />
        {/if}
      {/await}
    {/if}
    </main>
    <footer class="flex flex-col py-4 gap-y-6 md:gap-2 text-md w-full">
      <div class="flex flex-col md:flex-row gap-x-6 gap-y-1">
        <span
          class="bg-primary dark:bg-light text-light w-fit dark:text-dark rounded-md px-2"
          >{$texts["MadeWithSvelte"]}</span
        >
        <a href="mailto:karol.bielski@gmx.de" class="w-fit"
          >karol.bielski@gmx.de</a
        >
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
        on:focus={importPainter}
        on:touchstart={importPainter}
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
        on:mouseover={importPainter}
        on:focus={importPainter}
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
