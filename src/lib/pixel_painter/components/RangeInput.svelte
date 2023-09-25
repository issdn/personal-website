<script lang="ts">
	import { onMount } from 'svelte';

	export let steps = [
		{
			label: '1',
			value: 0
		},
		{
			label: '2',
			value: 1
		},
		{
			label: '3',
			value: 2
		},
		{
			label: '4',
			value: 3
		}
	];
	export let stepIndex = 0;

	let stepVisualSize = 0;
	let input: HTMLSpanElement;
	let dragging = false;

	const setIndexFromX = (x: number) => {
		const relativeX = x - input.getBoundingClientRect().left;
		const newStepIndex = Math.round(relativeX / stepVisualSize);
		if (newStepIndex >= 0 && newStepIndex < steps.length) {
			stepIndex = newStepIndex;
		}
	};

	const handleSliderDragStart = (e: MouseEvent | TouchEvent) => {
		dragging = true;
		if ('touches' in e) {
			handleSliderDragTouch(e);
		} else {
			handleSliderDragClick(e);
		}
	};

	const handleSliderDragEnd = () => {
		dragging = false;
	};

	const handleSliderDragClick = (e: MouseEvent) => {
		if (dragging) {
			setIndexFromX(e.clientX);
		}
	};

	const handleSliderDragTouch = (e: TouchEvent) => {
		if (dragging) {
			setIndexFromX(e.touches[0].clientX);
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			stepIndex = Math.max(0, stepIndex - 1);
		} else if (e.key === 'ArrowRight') {
			stepIndex = Math.min(steps.length - 1, stepIndex + 1);
		}
	};

	$: getXPosition = (index: number) => {
		if (index === 0) {
			return 4;
		} else {
			const pos = index * stepVisualSize;
			if (index === steps.length - 1) {
				return pos - 4;
			}
			return pos;
		}
	};

	onMount(() => {
		stepVisualSize = input.clientWidth / (steps.length - 1);
	});
</script>

<svelte:body
	on:mouseup={handleSliderDragEnd}
	on:touchend={handleSliderDragEnd}
	on:mouseleave={handleSliderDragEnd}
	on:mousemove={handleSliderDragClick}
	on:touchmove={handleSliderDragTouch}
/>

<span
	on:mousedown={handleSliderDragStart}
	on:touchstart={handleSliderDragStart}
	on:keydown={handleKeyDown}
	bind:this={input}
	class="select-none cursor-pointer mb-5 h-2 w-full relative flex flex-row items-center justify-between px-1"
>
	<span class="absolute top-0 left-0 h-2 bg-light/60 dark:bg-dark/60 rounded-md w-full" />
	<span
		style={`width: ${getXPosition(stepIndex)}px;`}
		class="transition-wh duration-250 absolute h-2 rounded-md bg-light dark:bg-dark top-0 left-0"
	/>
	{#each steps as step, i}
		<span
			style={`left: ${getXPosition(i)}px;`}
			class={`h-[0.175rem] w-[0.175rem] rounded-sm absolute -translate-x-1/2
					 ${i <= stepIndex ? 'dark:bg-light bg-dark' : 'dark:bg-light/60 bg-dark/60'}`}
		/>
		<span
			style={`left: ${getXPosition(i)}px;`}
			class={`
					absolute
					top-1.5
					text-md
					-translate-x-1/2
					${i === stepIndex ? 'text-light dark:text-dark' : 'text-light/50 dark:text-dark/50'}
					`}>{step.label}</span
		>
	{/each}
	<span
		style={`left: ${getXPosition(stepIndex)}px;`}
		class={`w-4 h-4 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-[left,_box-shadow] 
				duration-250 bg-light dark:bg-dark
				dark:bg-light-dark rounded-full absolute flex flex-col justify-center items-center
				${
					dragging
						? 'shadow-indication-md dark:shadow-indication-md-dark'
						: 'dark:hover:shadow-indication-sm-dark dark:focus-within:shadow-indication-sm-dark focus-within:shadow-indication-sm hover:shadow-indication-sm '
				}`}
	>
		<input
			class="w-full h-full border-0 clip-0"
			aria-label={$$restProps['aria-label']}
			name={$$restProps.name}
			type="range"
			min={steps[0].value}
			max={steps[steps.length - 1].value}
			step={steps[1].value - steps[0].value}
			aria-valuemin={steps[0].value}
			aria-valuemax={steps[steps.length - 1].value}
			aria-valuenow={steps[stepIndex].value}
			aria-valuetext={steps[stepIndex].label}
		/>
	</span>
</span>
