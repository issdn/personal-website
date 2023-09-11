<script lang="ts">
  import { slide } from "svelte/transition";
  import language, { languages, type Languages } from "./languageStore";
  import Language from "$lib/symbols/Language.svelte";
  import Translate from "$lib/symbols/Translate.svelte";

  let expanded = false;

  const setLanguage = (lang: Languages) => {
    language.set(lang);
    expanded = false;
  };
</script>

<div class={`relative rounded-t-xl`}>
  <button
    aria-label="Language Change Dropdown Toggle"
    on:click={() => (expanded = !expanded)}
    class="h-12 w-12 flex items-center justify-center hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark rounded-full"
    ><Translate class="fill-primary dark:fill-light w-6 h-6"
      ><desc>Change language dropdown button</desc></Translate
    ></button
  >
  {#if expanded}
    <ul
      transition:slide={{ duration: 200 }}
      class="transition-colors duration-500 gap-y-1 mt-1 text-xl absolute w-full flex flex-col items-center bg-light dark:bg-dark pb-2 rounded-b-xl"
    >
      {#each languages as lang}
        <li>
          <button
            class={`transition-colors duration-500 px-1 pb-1 rounded-lg leading-6
                        hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark
                        ${
                          lang === $language &&
                          "bg-accent-secondary dark:bg-accent-secondary-dark"
                        }`}
            on:click={() => setLanguage(lang)}
          >
            {lang}</button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>
