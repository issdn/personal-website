<script>
  import Linkedin from "$lib/symbols/Linkedin.svelte";
  import Github from "$lib/symbols/Github.svelte";
  import Person from "$lib/symbols/Person.svelte";
  import DarkmodeSwitch from "$lib/darkmode/DarkmodeSwitch.svelte";
  import LanguageDropdown from "$lib/language/LanguageDropdown.svelte";
  import { translations } from "$lib/language";
  import { tooltip } from "$lib/tooltip";
  import {darkmode} from "$lib/darkmode";
  import { fade } from "svelte/transition";
  import OpenInNew from "$lib/symbols/OpenInNew.svelte";

  $: iconsColor = $darkmode ? "#E8E2E2" : "#5D3891";
</script>

<nav transition:fade>
  <div class="flex flex-row justify-between">
    <ul class="flex flex-row gap-x-4 md:gap-x-6 items-center">
      <li
        class="h-8 w-8"
        use:tooltip={{ text: $translations["githubProfile"], icon: OpenInNew }}
      >
        <a
          aria-label="Link to my github profile."
          href="https://github.com/issdn"
          target="_blank"><Github color={iconsColor} /></a
        >
      </li>
      <li
        class="h-8 w-8"
        use:tooltip={{
          text: $translations["LinkedInProfile"],
          icon: OpenInNew,
        }}
      >
        <a
          aria-label="Link to my github linkedin."
          href="https://www.linkedin.com/in/karol-bielski-ba9086276"
          target="_blank"><Linkedin color={iconsColor} /></a
        >
      </li>
      <li
        use:tooltip={{ text: $translations["CVDownload"], icon: OpenInNew }}
        class="h-8 w-8"
      >
        <a
          aria-label="S3 link to download my CV"
          href="https://karolbielski.s3.eu-central-1.amazonaws.com/Karol_Bielski_CV_2023.pdf"
          target="_blank"
          download><Person color={iconsColor} /></a
        >
      </li>
    </ul>
    <div class="flex flex-row items-center">
      <DarkmodeSwitch />
      <LanguageDropdown />
    </div>
  </div>
</nav>
