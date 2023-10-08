<script lang="ts">
  import Line from "$lib/assets/Line.svelte";
  import { tooltip } from "$lib/tooltip";
  import { SvelteComponentTyped, onMount } from "svelte";
  import { fade } from "svelte/transition";

  let linesOffsets = { red: 0, green: 0, blue: 0 };
  let linesWidth = { red: 0, green: 0, blue: 0 };

  let line: SvelteComponentTyped | null;
  let section: HTMLElement | null;
  let isVisible = false;
  let lineDrawn = false;

  const setWidthsAndOffsets = () => {
    let redLine = document.getElementById("line-red")?.getBoundingClientRect();
    let greenLine = document
      .getElementById("line-green")
      ?.getBoundingClientRect();
    let blueLine = document
      .getElementById("line-blue")
      ?.getBoundingClientRect();
    if (redLine && greenLine && blueLine) {
      linesOffsets = {
        red: 0,
        green: redLine.width,
        blue: redLine.width + greenLine.width,
      };
      linesWidth = {
        red: redLine.width,
        green: greenLine.width,
        blue: blueLine.width,
      };
    }
  };
  onMount(() => {
    isVisible = true;
    setTimeout(() => {
      setWidthsAndOffsets();
      lineDrawn = true;
    }, 3100);
  });

  const pssg = `This I use much less and 100% in the cloud. My server built on FastAPI,
      Flask, Node or GO will be deployed using platforms like GCP, AWS, Vercel
      or Netlify and return a response with website like this. I lack necessary
      expertise to build anything around security, therefore I use third-party
      platforms like: Clerk or Firebase Auth. The data will be persisted using
      either NoSQL like MongoDB or Firestore or relational database like
      PostgreSQL or MySQL.`;
  const pspa = `This I know the best - NextJS, SvelteKit, Astro, Tailwind, etc. UX in form
      of speed and accessibility is what I strive for. UI - I keep it simple
      which additionally enhances the UX.`;
</script>

<section class="w-full h-screen relative pt-6 pb-12" bind:this={section}>
  <b class="absolute left-0 top-2 text-detail-red font-primary">Server</b>
  <b class="absolute right-0 top-2 text-detail-blue font-primary">Client</b>
  {#if lineDrawn}
    <b
      use:tooltip={{ text: pssg }}
      transition:fade={{ delay: 500 }}
      style={`left:${linesWidth.red / 2}px;`}
      class="top-0 -translate-x-1/2 absolute font-primary text-detail-red"
      >SSG</b
    >
    <b
      transition:fade={{ delay: 500 }}
      style={`left:${linesOffsets.green + linesWidth.green / 2}px;`}
      class="top-0 -translate-x-1/2 absolute font-primary text-detail-green"
      >SSR</b
    >
    <b
      use:tooltip={{ text: pspa }}
      transition:fade={{ delay: 500 }}
      style={`left:${linesOffsets.blue + linesWidth.blue / 2}px;`}
      class="top-0 -translate-x-1/2 absolute font-primary text-detail-blue"
      >SPA</b
    >
  {/if}
  {#if isVisible}
    <Line bind:this={line} class="w-full" />
  {/if}
</section>
