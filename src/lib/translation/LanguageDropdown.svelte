<script lang="ts">
  import Translate from "$lib/symbols/Translate.svelte";
  import Desc from "./Desc.svelte";
  import LanguageDropdownListbox from "./LanguageDropdownListbox.svelte";

  let expanded = false;
  let loading = false;
</script>

<div
  on:keydown={(e) => {
    if (e.key === "Escape") expanded = false;
  }}
  class={`relative rounded-t-xl`}
>
  <button
    id="language-change-dropdown"
    aria-haspopup="listbox"
    aria-controls="language-dropdown-listbox"
    aria-label="Language Change Dropdown Toggle"
    on:click={() => (expanded = !expanded)}
    on:keydown={(e) => {
      if (e.key === "ArrowDown" && document.activeElement === e.target) {
        expanded = true;
        e.preventDefault()
      }
    }}
    class={`${
      loading && "animate-pulse"
    } h-16 w-16 flex items-center justify-center hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark rounded-full`}
    ><Translate class="fill-primary dark:fill-light w-8 h-8"
      ><Desc descKey="DESCChangeLanguageDropdownToggle" /></Translate
    ></button
  >
  <LanguageDropdownListbox bind:loading bind:expanded />
</div>
