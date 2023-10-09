<script lang="ts">
  import { draw } from "svelte/transition";
  import { sineInOut } from "svelte/easing";

  export let index: number;
</script>

<svg
  class={$$props.class}
  style={$$props.style}
  width="874"
  height="35"
  viewBox="0 0 874 35"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <line
    transition:draw={{ duration: 750, easing: sineInOut }}
    x1="2"
    y1="19"
    x2="348"
    y2="19"
    stroke="#913840"
    id="line-red"
    stroke-width={index === 0 ? "8" : "4"}
  />
  <path
    transition:draw={{ duration: 750, delay: 750, easing: sineInOut }}
    d="M350 19L523 19"
    stroke="#6C9138"
    stroke-width={index === 1 ? "8" : "4"}
    id="line-green"
  />
  <line
    transition:draw={{ duration: 750, delay: 1500, easing: sineInOut }}
    x1="526"
    y1="19"
    x2="872"
    y2="19"
    stroke="#389189"
    id="line-blue"
    stroke-width={index === 2 ? "8" : "4"}
  />
  <line
    transition:draw={{ duration: 500, delay: 500 }}
    x1="349"
    y1="11"
    x2="349"
    y2="27"
    stroke="#6C9138"
    stroke-width="4"
  />
  <line
    transition:draw={{ duration: 500, delay: 1250 }}
    x1="525"
    y1="2"
    x2="525"
    y2="33"
    stroke="#389189"
    stroke-width="4"
  />
</svg>
