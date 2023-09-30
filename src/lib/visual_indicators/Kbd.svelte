<script lang="ts">
  export let fn: (e: KeyboardEvent) => void;
  export let shift: boolean = false;
  export let key: string;
  export let label: string;
</script>

<svelte:window
  on:keydown={(e) => {
    if ((e.key === key) && (shift ? e.shiftKey : true)) fn(e);
  }}
/>
<!-- @component
Wrapper around kbd element, key prop will be used to compare key from event.
 -->
<kbd
  class="border-b-[3px] w-fit text-sm border-2 border-primary dark:border-light rounded-md px-1"
>
  {label}
</kbd>
