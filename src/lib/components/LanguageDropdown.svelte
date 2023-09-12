<script lang="ts">
  import { slide } from "svelte/transition";
  import translations, { language, languages } from "./languageStore";
  import Translate from "$lib/symbols/Translate.svelte";
  import snackbars from "./snackbars";

  let expanded = false;
  let loading = false;

  let prefetchLanguage: string | null = null;
  let prefetched: Promise<Response> | null = null;

  const handlePreFetch = (lang: string) => {
    if (prefetched && lang === prefetchLanguage) {
      return;
    }
    prefetchLanguage = lang;
    prefetched = fetch(`/api/lang?lang=${lang}`);
  };

  const handleLanguageChange = async (lang: string) => {
    const oldLang = $language;
    language.set(lang);
    expanded = false;
    loading = true;
    if (!prefetched) {
      return;
    }
    const res = await prefetched;
    prefetched = null;
    if (res.ok) {
      res.json().then((data) => {
        translations.set(data.translation);
        loading = false;
      });
    } else {
      language.set(oldLang);
      loading = false;
      snackbars.add("Failed to change language", {
        type: "error",
      });
    }
  };
</script>

<div class={`relative rounded-t-xl`}>
  <button
    aria-label="Language Change Dropdown Toggle"
    on:click={() => (expanded = !expanded)}
    class={`${
      loading && "animate-pulse"
    } h-12 w-12 flex items-center justify-center hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark rounded-full`}
    ><Translate class="fill-primary dark:fill-light w-6 h-6"
      ><desc>Change language dropdown button</desc></Translate
    ></button
  >
  {#if expanded}
    <ul
      transition:slide={{ duration: 200 }}
      class="transition-colors duration-500 gap-y-1 mt-1 text-xl absolute w-full flex flex-col items-center bg-light dark:bg-dark pb-2 rounded-b-xl"
    >
      {#each languages as _language}
        <li>
          <button
            on:focus={() => handlePreFetch(_language)}
            on:mouseenter={() => handlePreFetch(_language)}
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
