<script>
  import Linkedin from "./linkedin.svelte";
  import Github from "./github.svelte";
  import Person from "./person.svelte";
  import DarkmodeSwitch from "./DarkmodeSwitch.svelte";
  import LanguageDropdown from "./LanguageDropdown.svelte";
  import language, { translator } from "./languageStore";
  import tooltip from "./tooltip/tooltipAction";
  import darkModeStore from "./darkmodeStore";
  import { fade } from "svelte/transition";
  import OpenInNew from "$lib/symbols/OpenInNew.svelte";

  $: translation = translator($language);

  $: iconsColor = $darkModeStore ? "#E8E2E2" : "#5D3891";
</script>

<nav transition:fade>
  <div class="flex flex-row justify-between">
    <ul class="flex flex-row gap-x-4 md:gap-x-6 items-center">
      <li
        class="h-8 w-8"
        use:tooltip={{ text: translation("githubProfile"), icon: OpenInNew }}
      >
        <a
          aria-label="Link to my github profile."
          href="https://github.com/issdn"
          target="_blank"><Github color={iconsColor} /></a
        >
      </li>
      <li
        class="h-8 w-8"
        use:tooltip={{ text: translation("LinkedInProfile"), icon: OpenInNew }}
      >
        <a
          aria-label="Link to my github linkedin."
          href="https://www.linkedin.com/in/karol-bielski-ba9086276"
          target="_blank"><Linkedin color={iconsColor} /></a
        >
      </li>
      <li
        use:tooltip={{ text: translation("CVDownload"), icon: OpenInNew }}
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
