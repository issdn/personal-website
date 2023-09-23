<script>
	import '../app.css';
</script>

<noscript>
	<div
		class="fixed top-0 left-0 w-full h-full flex flex-col justify-start items-center pt-16 px-12"
	>
		<span
			class="font-primary text-dark dark:text-light bg-accent-secondary dark:bg-accent-secondary-dark"
		>
			This website requires javascript 🥲.
		</span>
	</div>
</noscript>

<div
	class="w-full h-full bg-light font-secondary dark:bg-dark text-primary dark:text-light transition-colors duration-500"
>
	<slot />
</div>
