<script lang="ts">
	import CheckCircle from '$lib/symbols/CheckCircle.svelte';
	import Error from '$lib/symbols/Error.svelte';

	export let type: 'error' = 'error';

	const colors = {
		error: 'bg-red-600',
		warning: 'bg-yellow-600',
		success: 'bg-green-600',
		info: 'bg-blue-600'
	} as const;

	const icons = {
		success: CheckCircle,
		error: Error
	};
</script>

<div
	class={`w-screen md:max-w-xl px-2 rounded-md py-1 flex flex-row gap-x-2 items-center ${colors[type]} ${$$props.class}`}
>
	<svelte:component this={icons[type]} class="h-10 w-10 fill-light" />
	<slot />
</div>
