<script lang="ts">
  import Line from "$lib/assets/Line.svelte";
  import { texts } from "$lib/translation";
  import { SvelteComponentTyped, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Contrast from "$lib/symbols/Contrast.svelte";

  let contrastMode = false;
  let section: HTMLElement | null;
  let isVisible = false;
  let lineDrawn = false;

  onMount(() => {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            isVisible = true;
            setTimeout(() => {
              lineDrawn = true;
            }, 2250);
          }
        });
      },
      { threshold: 1 }
    ).observe(section!);
  });

  const textKeys = ["SSG", "SSR", "SPA"] as const;

  let index = 0;

  const handleChangeText = (i: number) => {
    index = i;
  };
</script>

<div class="w-full min-h-[250px]" bind:this={section}>
  <div class="flex flex-row justify-between gap-x-4 pb-2">
    <em class="text-sm">*{$texts["AboutLineAppendix"]}</em>
    <button
      aria-label={$texts["DESCContrastMode"]}
      class="dark:fill-light fill-primary"
      on:click={() => (contrastMode = !contrastMode)}
      ><Contrast bind:on={contrastMode} /></button
    >
  </div>
  <div class="flex flex-row justify-between">
    <b class={`${!contrastMode && "text-primary"} font-primary`}>Server</b>
    <b class={`${!contrastMode && "text-primary-tint-20"} font-primary`}
      >Client</b
    >
  </div>
  {#if isVisible}
    <Line bind:index class="w-full" />
  {/if}
  <div class="flex flex-row gap-x-10 justify-around h-6">
    {#if lineDrawn}
      <button
        on:click={() => handleChangeText(0)}
        transition:fade={{ delay: 500 }}
        class={`font-primary ${!contrastMode && "text-primary"} rounded-md ${
          index === 0 ? "font-extrabold" : "grayscale"
        }`}>SSG</button
      >
      <button
        on:click={() => handleChangeText(1)}
        transition:fade={{ delay: 500 }}
        class={`font-primary ${
          !contrastMode && "text-primary-tint-10"
        } rounded-md ${index === 1 ? "font-extrabold" : "grayscale"}`}
        >SSR</button
      >
      <button
        on:click={() => handleChangeText(2)}
        transition:fade={{ delay: 500 }}
        class={`font-primary ${
          !contrastMode && "text-primary-tint-20"
        } rounded-md ${index === 2 ? "font-extrabold" : "grayscale"}`}
        >SPA</button
      >
    {/if}
  </div>
  {#if lineDrawn}
    {#key index}
      <p
        data-textKey={textKeys[index]}
        in:fade
        class={`mt-4 font-primary ${
          !contrastMode &&
          "data-[textKey=SSG]:text-primary data-[textKey=SSR]:text-primary-tint-10 data-[textKey=SPA]:text-primary-tint-20"
        }`}
      >
        {$texts[textKeys[index]]}
      </p>
    {/key}
  {/if}
</div>
