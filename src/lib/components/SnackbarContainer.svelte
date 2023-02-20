<script lang="ts">
	import Snackbar from './Snackbar.svelte';
	import snackbars from './snackbars';
</script>

<div
	class="absolute pointer-events-none w-full h-full px-4 top-0 left-0 z-[100] flex flex-col justify-end items-center gap-y-4 py-8"
>
	{#each $snackbars as snackbar}
		<Snackbar
			id={snackbar.id}
			title={snackbar.title}
			detail={snackbar.detail}
			type={snackbar.type}
			duration={snackbar.duration}
			timeout={setTimeout(() => {
				snackbars.remove(snackbar.id);
			}, snackbar.duration)}
		/>
	{/each}
</div>
