import { writable } from 'svelte/store';
import type { OptionalSnackbarProps, SnackbarProps, SnackbarType } from '.';

const defaultOptionalProps = {
	type: 'success' as SnackbarType,
	detail: null,
	duration: 3000
};

function _snackbars() {
	const { update, subscribe } = writable<SnackbarProps[]>([]);

	const add = (title: string, init: OptionalSnackbarProps = {}) => {
		update((snackbars) => {
			const id = Math.random().toString(36).substring(2, 9);
			const snackbar = { id, title, ...defaultOptionalProps, ...init };
			return [...snackbars, snackbar];
		});
	};

	const remove = (id: string) => {
		update((snackbars) => {
			return snackbars.filter((snackbar) => snackbar.id !== id);
		});
	};

	return {
		subscribe,
		add,
		remove
	};
}

const snackbars = _snackbars();
export default snackbars;
