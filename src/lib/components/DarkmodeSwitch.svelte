<script lang="ts">
	import DarkMode from '$lib/symbols/DarkMode.svelte';
	import LightMode from '$lib/symbols/LightMode.svelte';
	import darkModeStore from './darkmodeStore';

	const setDark = () => {
		document.documentElement.classList.add('dark');
		darkModeStore.switchMode();
	};

	const setLight = () => {
		document.documentElement.classList.remove('dark');
		darkModeStore.switchMode();
	};

	const toggle = () => {
		$darkModeStore ? setLight() : setDark();
	};
</script>

<button
	aria-label="Toggle dark mode"
	on:click={toggle}
	class="dark:[&>path]:fill-light [&>path]:fill-dark relative transition-colors duration-500 bg-accent-secondary dark:bg-accent-secondary-dark flex flex-row py-2 px-2 rounded-2xl gap-x-4 items-center"
>
	<DarkMode class="h-[20px] fill-primary dark:fill-light"><desc>Turn on dark mode</desc></DarkMode>
	<LightMode class="h-[20px] fill-primary dark:fill-light"
		><desc>Turn off dark mode</desc></LightMode
	>
	<span
		class={`absolute rounded-full bg-primary dark:bg-light h-[calc(100%-8px)] aspect-square top-1 left-1.5 transition-transform duration-500 ${
			$darkModeStore && 'translate-x-[calc(100%+6px)]'
		}`}
	/>
</button>
