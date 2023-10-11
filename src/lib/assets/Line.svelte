<script lang="ts">
  import { draw } from "svelte/transition";
  import { sineInOut } from "svelte/easing";

  export let index: number;
</script>

<svg
  class={$$props.class}
  style={$$props.style}
  width="881"
  height="8"
  viewBox="0 0 881 8"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <line
    class={index !== 0 ? "grayscale" : ""}
    transition:draw={{ duration: 750, easing: sineInOut }}
    x1="4"
    y1="4"
    x2="346"
    y2="4"
    stroke="#5D3891"
    stroke-width="12"
    stroke-linecap="square"
  />
  <path
    class={index !== 1 ? "grayscale" : ""}
    transition:draw={{ duration: 750, delay: 750, easing: sineInOut }}
    d="M354 4L527 4"
    stroke="#6D4C9C"
    stroke-width="12"
    stroke-linecap="square"
  />
  <line
    class={index !== 2 ? "grayscale" : ""}
    transition:draw={{ duration: 750, delay: 1500, easing: sineInOut }}
    x1="535"
    y1="4"
    x2="877"
    y2="4"
    stroke="#7D60A7"
    stroke-width="12"
    stroke-linecap="square"
  />
</svg>
