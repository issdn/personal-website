<script lang="ts">
  import DarkMode from "$lib/symbols/DarkMode.svelte";
  import LightMode from "$lib/symbols/LightMode.svelte";
  import {darkmode} from "./"

  const setDark = () => {
    document.documentElement.classList.add("dark");
    darkmode.switchMode();
  };

  const setLight = () => {
    document.documentElement.classList.remove("dark");
    darkmode.switchMode();
  };

  const toggle = () => {
    $darkmode ? setLight() : setDark();
  };

  let hovering = false;
</script>

<button
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:blur={() => (hovering = false)}
  aria-label="Toggle dark mode"
  on:click={toggle}
  class="h-12 w-12 rounded-full relative hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark overflow-hidden"
>
  {#if $darkmode}
    <DarkMode
      filled={hovering}
      class="h-6 w-6 absolute fill-primary dark:fill-light left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      ><desc>Turn on dark mode</desc></DarkMode
    >
  {:else}
    <LightMode
      filled={hovering}
      class="h-6 w-6 absolute fill-primary dark:fill-light left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      ><desc>Turn off dark mode</desc></LightMode
    >
  {/if}
</button>
