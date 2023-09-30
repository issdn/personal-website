<script lang="ts">
  import { slide } from "svelte/transition";
  import {
    texts,
    language,
    type Translations,
    type TranslationShape,
    languageImportObject,
    languageImportObjectKeys,
  } from ".";
  import { afterUpdate } from "svelte";
  import { getNextIndex, getPreviousIndex } from "$lib/utils";

  export let loading = false;
  export let expanded = false;

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

  const options: HTMLButtonElement[] = [];

  const handleOptionKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      options[getNextIndex(index, options.length)].focus();
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      options[getPreviousIndex(index, options.length)].focus();
      e.preventDefault();
    } else {
      for (const option of options) {
        const split = option.id.split("-");
        if (split[split.length - 1][0] === e.key.toLowerCase()) {
          option.focus();
          e.preventDefault();
        }
      }
    }
  };

  afterUpdate(() => {
    if (expanded) {
      options.forEach((option) => {
        if (option.id.includes($language)) {
          option.focus();
        }
      });
    }
  });
</script>

{#if expanded}
  <ul
    on:keydown={(e) => {
      if (e.key === "ArrowDown" && document.activeElement === e.target) {
        options[0].focus()
        e.preventDefault()
      }
    }}
    aria-labelledby="language-change-dropdown"
    id="language-dropdown-listbox"
    tabindex="0"
    role="listbox"
    aria-activedescendant={`language-${$language}`}
    aria-expanded={expanded}
    transition:slide={{ duration: 200 }}
    class="transition-colors duration-500 gap-y-1 mt-1 text-2xl absolute w-full flex flex-col items-center bg-light dark:bg-dark pb-2 rounded-b-xl"
  >
    {#each languageImportObjectKeys as _language, i}
      <li>
        <button
          bind:this={options[i]}
          id={`language-${_language}`}
          role="option"
          aria-selected={_language === $language}
          disabled={loading}
          on:keydown={(e) => handleOptionKeyDown(e, i)}
          on:focus={() => handlePreload(_language)}
          on:mouseenter={() => handlePreload(_language)}
          on:click={() => handleLanguageChange(_language)}
          class={`disabled:opacity-50 transition-colors duration-500 px-1 pb-1 rounded-lg leading-6
                        hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark focus:bg-accent-secondary dark:focus:bg-accent-secondary-dark
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
