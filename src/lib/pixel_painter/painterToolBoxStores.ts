import { writable } from 'svelte/store';

export const COLORS = [
	[
		{ color: '#a76060', label: 'Light Red' },
		{ color: '#913838', label: 'Red' },
		{ color: '#742d2d', label: 'Dark Red' }
	],
	[
		{ color: '#a79a60', label: 'Light Yellow' },
		{ color: '#918138', label: 'Yellow' },
		{ color: '#74672d', label: 'Dark Yellow' }
	],
	[
		{ color: '#51abcb', label: 'Light Blue' },
		{ color: '#2596BE', label: 'Blue' },
		{ color: '#1e7898', label: 'Dark Blue' }
	],
	[
		{ color: '#6dcb51', label: 'Light Green' },
		{ color: '#49be25', label: 'Green' },
		{ color: '#3a981e', label: 'Dark Green' }
	],
	[
		{ color: '#a7609b', label: 'Light Pink' },
		{ color: '#913882', label: 'Pink' },
		{ color: '#742d68', label: 'Dark Pink' }
	]
];

const color = writable(COLORS[0][0]);
const sizeStore = () => {
	const { update, subscribe } = writable(1);
	const increment = () => {
		update((val) => {
			if (val >= 5) {
				return val;
			}
			return (val += 1);
		});
	};
	const decrement = () => {
		update((val) => {
			if (val <= 0) {
				return val;
			}
			return (val += 1);
		});
	};
	return {
		subscribe,
		increment,
		decrement
	};
};
const size = sizeStore();
export { size, color };
