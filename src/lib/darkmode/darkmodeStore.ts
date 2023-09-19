import { writable } from 'svelte/store';

const createDarkModeStore = () => {
	const { subscribe, update } = writable(true);
	const switchMode = () => update((value) => !value);
	return {
		subscribe,
		switchMode,
		update
	};
};

const darkModeStore = createDarkModeStore();
export default darkModeStore;
