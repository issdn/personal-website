<script lang="ts">
  import translations from "../languageStore";
  export let active: boolean = false;
  export let label: TranslationKeys;
  export let shortcut: string;
  import tooltip from "../tooltip/tooltipAction";
  import windowStore from "../windowUtils";
</script>

<button
  use:tooltip={{
    text: $translations[label],
    textSize: "text-sm",
    device: $windowStore,
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
