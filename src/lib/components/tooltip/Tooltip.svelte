<script lang="ts">
	import type { ComponentType } from 'svelte';
	import {
		adjustTooltipPosition,
		getWidestPossibleSideAndSetWidth
	} from './tooltipPositionFunctions';

	export let text = '';
	export let visible = false;
	export let icon: ComponentType | null = null;
	export let textSize = 'text-md';

	let styles: string | null = null;
	let arrowClasses: string = '';
	let tooltip: HTMLSpanElement;

	$: if (tooltip) {
		let _stylesObj = adjustTooltipPosition(tooltip, window);
		if (_stylesObj) {
			styles = _stylesObj[0];
			arrowClasses = _stylesObj[1];
		} else {
			let _sizing = getWidestPossibleSideAndSetWidth(tooltip, window);
			const _stylesObj = adjustTooltipPosition(tooltip, window, _sizing[0]);
			styles = _sizing[1] + ' ' + _stylesObj![0];
			arrowClasses = _stylesObj![1];
		}
	}

	const destroyOnWindowExit = () => {
		if (document.visibilityState === 'hidden') {
			visible = false;
		}
	};
</script>

<svelte:window on:visibilitychange={destroyOnWindowExit} />

<span
	role="tooltip"
	bind:this={tooltip}
	style={`${styles ? styles : 'top: 0; left: 0;'} ${tooltip ? 'opacity: 1;' : 'opacity: 0;'}`}
	class={`transition-opacity delay-500 duration-200 after:border-transparent font-bold whitespace-nowrap pointer-events-none drop-shadow-md after:content-[' '] after:border-[5px] after:border-solid after:absolute z-[99] absolute bg-primary dark:bg-light rounded-md px-2 py-2 text-light dark:text-dark ${arrowClasses} ${textSize}`}
>
	{text}
	{#if icon}
		<svelte:component this={icon} class="h-4 w-4 inline fill-light dark:fill-dark" />
	{/if}
</span>

<style>
	:root {
		--arrowNodeGapSize: 50%;
	}

	.tSide::after {
		bottom: 100%;
	}

	.bSide::after {
		top: 100%;
	}

	.lSide::after {
		right: 100%;
	}

	.rSide::after {
		left: 100%;
	}

	/* For arrowPositions */

	.tPos::after {
		top: 6cm;
	}

	.bPos::after {
		bottom: 6px;
	}

	.lPos::after {
		left: 6px;
	}

	.rPos::after {
		right: 6px;
	}

	.mvPos::after {
		top: 50%;
		transform: translateY(-50%);
	}

	.mhPos::after {
		left: 50%;
		transform: translateX(-50%);
	}
</style>
