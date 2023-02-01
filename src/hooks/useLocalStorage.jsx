import {useState } from 'react';

function useStoredState(key, defaultValue) {
	// 👇 Load stored state into regular react component state
	const [state, setState] = useState(() => {
		const storedState = localStorage.getItem(key);

		if (storedState) {
			// 🚩 Data is stored as string so need to parse
			return JSON.parse(storedState)
		}

		// No stored state - load default value.
		// It could be a function initializer or plain value.
		return defaultValue instanceof Function ? defaultValue() : defaultValue;
	});

	// 👇 Keeps the exact same interface as setState - value or setter function.
	const setValue = (value) => {
		const valueToStore = value instanceof Function ? value(state) : value;
		localStorage.setItem(key, JSON.stringify(valueToStore));
		setState(valueToStore);
	};

	// as const tells TypeScript you want tuple type, not array.
	return [state, setValue]
}

export default useStoredState;
