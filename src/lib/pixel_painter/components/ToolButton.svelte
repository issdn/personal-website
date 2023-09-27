<script lang="ts">
  export let active: boolean = false;
  export let label: TranslationKeys;
  export let shortcut: string;
  import { isTouchScreen } from "$lib/stores";
  import { tooltip } from "$lib/tooltip";
  import { texts, type TranslationKeys } from "$lib/translation";
</script>

<button
  use:tooltip={{
    text: $texts[label],
    textSize: "text-sm",
    isTouchScreen: $isTouchScreen,
    showOnMobile: false,
  }}
  {...$$restProps}
  on:click
  class={`flex relative items-center rounded-full dark:active:fill-dark/60 active:fill-light/60 md:dark:hover:fill-dark/60 md:hover:fill-light/60 ${
    active
      ? "dark:fill-dark/60 fill-light/60 animate-pulse"
      : "dark:fill-dark fill-light"
  }`}
>
  <slot />
  <span
    class="absolute -bottom-[0.45rem] break-keep whitespace-nowrap font-extralight left-1/2 -translate-x-1/2 text-[0.55rem] text-light dark:text-dark"
    >{shortcut}</span
  >
</button>
