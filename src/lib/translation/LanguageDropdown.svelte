<script lang="ts">
  import { slide } from "svelte/transition";
  import { texts, language, type Translations, type TranslationShape, languageImportObject, languageImportObjectKeys } from ".";
  import Translate from "$lib/symbols/Translate.svelte";
  import Desc from "./Desc.svelte";

  let expanded = false;
  let loading = false;
  let languageFetched = false;

  let translation: TranslationShape;
  let preloadPromise: Promise<void>;

  const handlePreload = async (lang: Translations) => {
    preloadPromise = languageImportObject[lang]().then((file) => {
      translation = file.default;
      languageFetched = true;
    });
  };

  const handleLanguageChange = async (lang: Translations) => {
    expanded = false;
    if (!languageFetched) {
      loading = true;
    }
    preloadPromise.then(() => {
      language.set(lang);
      texts.set(translation);
      languageFetched = false;
      loading = false;
    });
  };
</script>

<div class={`relative rounded-t-xl`}>
  <button
    aria-label="Language Change Dropdown Toggle"
    on:click={() => (expanded = !expanded)}
    class={`${
      loading && "animate-pulse"
    } h-16 w-16 flex items-center justify-center hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark rounded-full`}
    ><Translate class="fill-primary dark:fill-light w-8 h-8"
      ><Desc descKey="DESCChangeLanguageDropdownToggle"/></Translate
    ></button
  >
  {#if expanded}
    <ul
      transition:slide={{ duration: 200 }}
      class="transition-colors duration-500 gap-y-1 mt-1 text-2xl absolute w-full flex flex-col items-center bg-light dark:bg-dark pb-2 rounded-b-xl"
    >
      {#each languageImportObjectKeys as _language}
        <li>
          <button
            on:focus={() => handlePreload(_language)}
            on:mouseenter={() => handlePreload(_language)}
            disabled={loading}
            on:click={() => handleLanguageChange(_language)}
            class={`disabled:opacity-50 transition-colors duration-500 px-1 pb-1 rounded-lg leading-6
                        hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark
                        ${
                          _language === $language &&
                          "bg-accent-secondary dark:bg-accent-secondary-dark"
                        }`}
          >
            {_language}</button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>
