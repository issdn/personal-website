<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import InfoBox from '../InfoBox.svelte';
	import windowStore from '../windowUtils';
	import painter, { cellBoard, painterReady } from './pixelPainterStore';
	import darkModeStore from '$lib/components/darkmodeStore';
	import { fade } from 'svelte/transition';

	let error: { message: string; detail: string } | null = null;
	let canvas: HTMLCanvasElement;

	const setErrorMessage = (message: string, detail: string) => {
		error = {
			message,
			detail
		};
	};

	$: {
		painter.update((painter) =>
			painter.setConfig({ accentColor: $darkModeStore ? '#232323' : '#D9D9D9' }).setPainterContext({
				accentColor: $darkModeStore ? '#D9D9D9' : '#232323'
			})
		);
	}

	onMount(() => {
		fetch('api/painter')
			.then((res) => res.json())
			.catch((err) =>
				setErrorMessage(
					err.message || 'Failed to fetch data.',
					err.detail || 'Please email me if the problem persists.'
				)
			)
			.then((data) => {
				cellBoard.fromRawColorsArray(data.cells);
				painter.update((painter) =>
					painter.setConfig({ isTouchScreen: $windowStore === 'mobile' })
				);
				$painter
					.init(canvas)
					.then(async (painterInstance) => {
						try {
							await painterInstance.draw();
							painterReady.set(true);
						} catch {
							setErrorMessage("The database isn't responding.", 'Please try again later.');
						}
					})
					.catch(() => {
						setErrorMessage(
							"Couldn't get canvas context.",
							'Your browser might not support canvas.'
						);
					});
			});
	});

	onDestroy(() => {
		$painter.destroy();
	});
</script>

<!-- 
	@component
	Creates a canvas element and draws the pixel painter on it.
	Handles the loading and error states.
 -->
{#if error}
	<InfoBox class="absolute drop-shadow-lg top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
		<div class="flex flex-col">
			<h1 class="font-primary font-bold">{error.message}</h1>
			<p class="text-sm">{error.detail}</p>
		</div>
	</InfoBox>
{/if}
<div class="absolute overflow-hidden top-0 left-0 h-full w-full z-0 box-border">
	<canvas
		out:fade
		in:fade={{ delay: 500 }}
		class={`touch-none absolute transition-[opacity] duration-500`}
		bind:this={canvas}
	/>
</div>
