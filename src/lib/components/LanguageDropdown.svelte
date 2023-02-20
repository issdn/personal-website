<script lang="ts">
	import { slide } from 'svelte/transition';
	import language, { languages, type Languages } from './languageStore';
	import Language from '$lib/symbols/Language.svelte';

	let expanded = false;

	const setLanguage = (lang: Languages) => {
		language.set(lang);
		expanded = false;
	};
</script>

<div class={`relative h-full rounded-t-xl`}>
	<button
		aria-label="Language Change Dropdown Toggle"
		on:click={() => (expanded = !expanded)}
		class="h-full group origin-center transition-transform duration-100"
		><Language class="fill-primary dark:fill-light w-11 h-11 group-hover:rotate-6 origin-center"
			><desc>Change language dropdown button</desc></Language
		></button
	>
	{#if expanded}
		<ul
			transition:slide={{ duration: 200 }}
			class="transition-colors duration-500 gap-y-1 mt-1 text-xl absolute w-full flex flex-col items-center bg-light dark:bg-dark pb-2 rounded-b-xl"
		>
			{#each languages as lang}
				<li>
					<button
						class={`transition-colors duration-500 px-1 pb-1 rounded-lg leading-6
                        hover:bg-accent-secondary dark:hover:bg-accent-secondary-dark
                        ${
													lang === $language && 'bg-accent-secondary dark:bg-accent-secondary-dark'
												}`}
						on:click={() => setLanguage(lang)}
					>
						{lang}</button
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>
