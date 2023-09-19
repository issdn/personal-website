<script lang="ts">
  import { page } from "$app/stores";
</script>

<div
  class="w-screen h-screen gap-x-8 flex flex-col-reverse gap-y-8 md:flex-row justify-center items-center"
>
  <div class="flex flex-col gap-y-2 justify-center items-center">
    <h1 class="text-9xl">{$page.status}</h1>
    <a href="/" class="text-accent text-xl hover:underline">go back</a>
  </div>
</div>
