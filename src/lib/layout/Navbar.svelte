<script>
  import Linkedin from "$lib/symbols/Linkedin.svelte";
  import Github from "$lib/symbols/Github.svelte";
  import Person from "$lib/symbols/Person.svelte";
  import DarkmodeSwitch from "$lib/darkmode/DarkmodeSwitch.svelte";
  import LanguageDropdown from "$lib/translation/LanguageDropdown.svelte";
  import { texts } from "$lib/translation";
  import { tooltip } from "$lib/tooltip";
  import { darkmode } from "$lib/darkmode";
  import { fade } from "svelte/transition";
  import OpenInNew from "$lib/symbols/OpenInNew.svelte";
  import { Sides } from "$lib/tooltip/tooltipAction";

  $: iconsColor = $darkmode ? "#E8E2E2" : "#5D3891";
</script>

<nav transition:fade>
  <div class="flex flex-row justify-between">
    <ul class="flex flex-row gap-x-4 md:gap-x-6 items-center">
      <li
        use:tooltip={{
          text: $texts["githubProfile"],
          icon: OpenInNew,
          className: "whitespace-nowrap",
          side: Sides.BR,
        }}
      >
        <a
          aria-label="Link to my github profile."
          href="https://github.com/issdn"
          target="_blank"><Github class="w-10 h-10" color={iconsColor} /></a
        >
      </li>
      <li
        use:tooltip={{
          text: $texts["LinkedInProfile"],
          icon: OpenInNew,
          className: "whitespace-nowrap",
        }}
      >
        <a
          aria-label="Link to my github linkedin."
          href="https://www.linkedin.com/in/karol-bielski-ba9086276"
          target="_blank"><Linkedin class="w-10 h-10" color={iconsColor} /></a
        >
      </li>
      <li
        use:tooltip={{
          text: $texts["CVDownload"],
          icon: OpenInNew,
          className: "whitespace-nowrap",
        }}
      >
        <a
          aria-label="S3 link to download my CV"
          href="https://karolbielski.s3.eu-central-1.amazonaws.com/Karol_Bielski_CV_2023.pdf"
          target="_blank"
          download><Person class="w-10 h-10" color={iconsColor} /></a
        >
      </li>
    </ul>
    <div class="flex flex-row items-center">
      <DarkmodeSwitch />
      <LanguageDropdown />
    </div>
  </div>
</nav>
