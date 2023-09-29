<script lang="ts">
  import { texts, type TranslationKeys } from "$lib/translation";

  export let descKey: TranslationKeys
</script>

<desc>
    {$texts[descKey]}
</desc>