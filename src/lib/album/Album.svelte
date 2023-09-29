<script lang="ts">
  import IMG1 from "$lib/assets/img1.webp?url";
  import IMG2 from "$lib/assets/img2.webp?url";
  import IMG3 from "$lib/assets/img3.webp?url";
  import IMG4 from "$lib/assets/img4.webp?url";
  import icon from "$lib/assets/icon32.png?url";
  import Checkout from "$lib/assets/Checkout.gif?url";

  import { texts, type TranslationKeys } from "$lib/translation";

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
    {
      name: "Epic Stuff",
      url: Checkout,
      stack: "",
      github: "",
      descKey: "" as TranslationKeys,
    },
  ];

  let currIndex = 0;
</script>

<div
  class="w-full h-[40rem] flex flex-col border-2 border-primary dark:border-light bg-light dark:bg-dark p-1 text-dark dark:text-light rounded-sm"
>
  <div
    style="scrollbar-gutter: stable;"
    class="flex flex-row gap-x-2 pb-2 pt-1 px-2 items-center overflow-x-auto overflow-y-hidden"
  >
    <img alt="Icon" class="h-5" src={icon} />
    {#each imageByProject as { name }, i}
      <button
        on:click={() => (currIndex = i)}
        class="bg-light-tint-20 dark:bg-dark-tint-10 px-2 rounded-sm font-primary whitespace-nowrap"
        >{name}<b class="font-secondary">&nbsp;x</b></button
      >
    {/each}
  </div>
  <div
    class="font-arial flex flex-row gap-x-8 bg-light-tint-20 dark:bg-dark-tint-10 py-1 px-4"
  >
    <div class="flex flex-row text-xl">
      <span>⬅️</span>
      <span>➡️</span>
      <span>🔃</span>
    </div>
    <span class="w-full pt-0.5 bg-light dark:bg-dark text-md px-1 truncate">
      http://www.past.com/{imageByProject[currIndex].name
        .toLowerCase()
        .replace(" ", "")}.html
    </span>
  </div>
  <div
    bind:this={page}
    class="h-full overflow-y-scroll bg-white text-black font-serif p-8 flex flex-col gap-y-4"
  >
  {#if imageByProject[currIndex].descKey}
    <h2 class="text-xl font-bold">{imageByProject[currIndex].name}</h2>
      <p>{$texts[imageByProject[currIndex].descKey]}</p>
      <p>Stack: {imageByProject[currIndex].stack}</p>
      <a
        target="_blank"
        class="text-blue-600 hover:underline text-blue-500 w-fit"
        href={`https://github.com/issdn/${imageByProject[currIndex].github}`}
        >Github Link</a
      >
    {/if}

    {#key imageByProject[currIndex].url}
      <img
        class="w-fit"
        alt={imageByProject[currIndex].name}
        src={imageByProject[currIndex].url}
      />
    {/key}
  </div>
</div>
