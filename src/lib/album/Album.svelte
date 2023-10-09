<script lang="ts">
  import IMG1 from "$lib/assets/img1.webp?url";
  import IMG2 from "$lib/assets/img2.webp?url";
  import IMG3 from "$lib/assets/img3.webp?url";
  import IMG4 from "$lib/assets/img4.webp?url";
  import icon from "$lib/assets/icon32.png?url";
  import Arrow from "$lib/symbols/Arrow.svelte";
  import Refresh from "$lib/symbols/Refresh.svelte";
  import Desc from "$lib/translation/Desc.svelte";

  import { texts, type TranslationKeys } from "$lib/translation";
  import { getNextIndex, getPreviousIndex } from "../utils";

  let page: HTMLDivElement;

  const imageByProject: {
    name: string;
    url: string;
    stack: string;
    descKey: TranslationKeys;
    github: string;
  }[] = [
    {
      name: "BrawlHub",
      url: IMG3,
      descKey: "DescBrawlHub",
      stack: "SvelteKit, TailwindCSS, VercelSDK, NodeJS under Vercel Functions",
      github: "brawlwheel",
    },
    {
      name: "Agora",
      url: IMG2,
      descKey: "DescAgora",
      stack: ".NET, React, JWT, TailwindCSS, Axios, MySQL",
      github: "agora",
    },
    {
      name: "Microservices",
      url: IMG1,
      descKey: "DescMicroservices",
      stack: "React, FastAPI, .NET, Docker Compose",
      github: "microservices",
    },
    {
      name: "Guess Who?",
      url: IMG4,
      descKey: "DescGuessWho",
      stack:
        "Svelte, FastAPI, TawilindCSS, Docker Compose, Stylegan3 AI, Websockets",
      github: "guesswho",
    },
  ];
  let index = 0;
  $: tab = imageByProject[index];

  const moveTabRight = () => {
    index = getNextIndex(index, imageByProject.length);
  };
  const moveTabLeft = () => {
    index = getPreviousIndex(index, imageByProject.length);
  };
  const focusAndPrevent = (e: KeyboardEvent) => {
    document.getElementById(`album-tab-${index}`)?.focus();
    e.preventDefault();
  };
  const handleTabKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Tab":
        if (!e.shiftKey) {
          document.getElementById(`album-tabpanel-${index}`)?.focus();
        } else {
          document.getElementById(`album-tablist`)?.focus();
        }
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "ArrowDown":
        moveTabLeft();
        focusAndPrevent(e);
        break;
      case "ArrowRight":
      case "ArrowUp":
        moveTabRight();
        focusAndPrevent(e);
        break;
      case "Home":
        index = 0;
        focusAndPrevent(e);
        break;
      case "End":
        index = imageByProject.length - 1;
        focusAndPrevent(e);
        break;
    }
  };
</script>

<div
  class="w-full h-[40rem] flex flex-col border-2 border-primary dark:border-light bg-light dark:bg-dark p-1 text-dark dark:text-light rounded-sm"
>
  <div class="flex flex-row gap-x-2 pb-2 pt-1 px-2 items-center">
    <img alt="Icon" class="h-6" src={icon} />
    <div
      class="flex flex-row gap-x-2 py-1 px-2 items-center overflow-x-auto overflow-y-hidden"
      on:keydown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") focusAndPrevent(e);
      }}
      tabindex="0"
      role="tablist"
      id="album-tablist"
    >
      {#each imageByProject as { name }, i}
        <button
          on:keydown={handleTabKeydown}
          id={`album-tab-${i}`}
          aria-controls={index === i ? `album-tabpanel-${index}` : null}
          role="tab"
          aria-selected={name === tab.name ? "true" : "false"}
          on:click={() => (index = i)}
          class={`${
            name === tab.name && "bg-light-tint-20 dark:bg-dark-tint-10"
          } hover:bg-light-tint-20 dark:hover:bg-dark-tint-10 px-2 rounded-sm font-primary whitespace-nowrap`}
        >
          {name}<b class="font-secondary">&nbsp;x</b>
        </button>
      {/each}
    </div>
  </div>
  <div
    class="font-arial flex flex-row tabs-center gap-x-4 bg-light-tint-20 dark:bg-dark-tint-10 py-1 px-4"
  >
    <div class="flex flex-row text-xl gap-x-1">
      <button
        class="h-8 w-8 flex flex-row items-center justify-center hover:bg-white/25 rounded-md fill-primary dark:fill-light"
        on:click={moveTabLeft}
      >
        <Arrow class="h-6 w-6" /><Desc descKey="DESCMoveTabBackwards" /></button
      >
      <button
        class="h-8 w-8 flex flex-row items-center justify-center hover:bg-white/25 rounded-md fill-primary dark:fill-light"
        on:click={moveTabRight}
      >
        <Arrow class="h-6 w-6 rotate-180" /><Desc
          descKey="DESCMoveTabBackwards"
        /></button
      >
      <button
        class="h-8 w-8 flex flex-row items-center justify-center hover:bg-white/25 rounded-md fill-primary dark:fill-light"
        on:click={() => (index = 0)}
      >
        <Refresh class="h-6 w-6" /><Desc descKey="DESCSetTabTo0" /></button
      >
    </div>
    <span class="bg-light rounded-sm dark:bg-dark px-2 py-1 truncate w-full">
      <a
        target="_blank"
        class="hover:text-blue-500 hover:underline text-md w-fit"
        href={`https://github.com/issdn/${tab.github}`}
      >
        https://github.com/issdn/{tab.github}
      </a>
    </span>
  </div>
  <div
    role="tabpanel"
    id={`album-tabpanel-${index}`}
    tabindex="0"
    bind:this={page}
    class="h-full overflow-y-scroll bg-white text-black font-serif p-8 flex flex-col gap-y-4"
  >
    <h2 class="text-xl font-bold">{tab.name}</h2>
    <p>{$texts[tab.descKey]}</p>
    <p>Stack: {tab.stack}</p>
    <img class="w-fit" alt={tab.name} src={tab.url} />
  </div>
</div>
