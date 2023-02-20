<script lang="ts">
	const sizes = {
		sm: 'w-4 h-4 border',
		md: 'w-8 h-8 border-2'
	};
	export let size: keyof typeof sizes = 'md';
</script>

<div class="grid grid-cols-2 grid-rows-2 gap-1 w-fit nice-grid z-[100]">
	{#each Array(4) as _, i (i)}
		<div class={`border-dark/10 dark:border-light/10 ${sizes[size]} rounded-sm`}>
			<div
				style={`animation-delay: ${i * 200}ms;`}
				class="animate-fill w-full h-full bg-dark/20 dark:bg-light/20"
			/>
		</div>
	{/each}
</div>

<style>
	@keyframes fill {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.animate-fill {
		animation: fill 2s linear infinite;
		animation-timing-function: steps(2, end);
	}
	.nice-grid {
		grid-template-areas:
			'a b'
			'c d';
	}
</style>
