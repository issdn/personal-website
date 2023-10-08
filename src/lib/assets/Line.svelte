<script>
  import { draw } from "svelte/transition";
  import { sineInOut } from "svelte/easing";
</script>

<svg
  class={$$props.class}
  style={$$props.style}
  width="902"
  height="35"
  viewBox="0 0 902 35"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <line
    transition:draw={{ duration: 1000, easing: sineInOut }}
    x1="2"
    y1="18"
    x2="374"
    y2="18"
    stroke="#913840"
    stroke-width="4"
    stroke-linecap="round"
    id="line-red"
  />
  <path
    transition:draw={{ duration: 1000, delay: 1000, easing: sineInOut }}
    d="M377.5 18L550.5 18"
    stroke="#6C9138"
    stroke-width="4"
    stroke-linecap="round"
    id="line-green"
  />
  <line
    transition:draw={{ duration: 1000, delay: 2000, easing: sineInOut }}
    x1="554"
    y1="18"
    x2="900"
    y2="18"
    stroke="#389189"
    stroke-width="4"
    stroke-linecap="round"
    id="line-blue"
  />
  <line
    transition:draw={{ duration: 500, delay: 750 }}
    x1="376"
    y1="10"
    x2="376"
    y2="26"
    stroke="#6C9138"
    stroke-width="4"
    stroke-linecap="round"
  />
  <line
    transition:draw={{ duration: 500, delay: 1750 }}
    x1="553"
    y1="2"
    x2="553"
    y2="33"
    stroke="#389189"
    stroke-width="4"
    stroke-linecap="round"
  />
</svg>
