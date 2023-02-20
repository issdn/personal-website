<script lang="ts">
	export let icon: string;
</script>

<i style={$$props.style} class={$$props.class}>
	{@html icon}
</i>
