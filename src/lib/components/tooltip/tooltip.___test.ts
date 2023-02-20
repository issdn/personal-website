import { describe, beforeEach, it, expect, vi } from 'vitest';
const MOCK_INNER_WINDOW_WIDTH = 340;
const MOCK_INNER_WINDOW_HEIGHT = 960;

class MockElement {
	constructor() {
		// Additional setup for your custom element
	}

	getBoundingClientRect() {
		// Implement the getBoundingClientRect method for your custom element
		return {
			top: 0,
			left: 0,
			width: 100,
			height: 100,
			x: 0,
			y: 0,
			bottom: 0,
			right: 0,
			toJSON: () => ({})
		};
	}
}

describe('isTooltipOutOfScreen', () => {
	let node: MockElement;
	beforeEach(() => {
		node = new MockElement();
		// Set up the node with necessary properties for each test case
	});

	it('should return true when the tooltip is out of the right side of the screen', () => {
		node.getBoundingClientRect = vi.fn(
			() =>
				({
					top: 0,
					left: MOCK_INNER_WINDOW_WIDTH - 10,
					width: 20,
					height: 20
				} as DOMRect)
		);

		const result = isTooltipOutOfScreen(
			sidesArray.find((el) => el === 'r') as Sides,
			node as HTMLElement,
			{ innerHeight: MOCK_INNER_WINDOW_HEIGHT, innerWidth: MOCK_INNER_WINDOW_WIDTH } as Window
		);

		expect(result).toBe(true);
	});

	it('should return true when the tooltip is out of the left side of the screen', () => {
		node.getBoundingClientRect = vi.fn(
			() =>
				({
					top: 0,
					left: -10,
					width: 20,
					height: 20
				} as DOMRect)
		);

		const result = isTooltipOutOfScreen(
			sidesArray.find((el) => el === 'l') as Sides,
			node as HTMLElement,
			{ innerHeight: MOCK_INNER_WINDOW_HEIGHT, innerWidth: MOCK_INNER_WINDOW_WIDTH } as Window
		);

		expect(result).toBe(true);
	});

	it('should return true when the tooltip is out of the top side of the screen', () => {
		node.getBoundingClientRect = vi.fn(
			() =>
				({
					top: -10,
					left: 0,
					width: 20,
					height: 20
				} as DOMRect)
		);

		const result = isTooltipOutOfScreen(
			sidesArray.find((el) => el === 't') as Sides,
			node as HTMLElement,
			{ innerHeight: MOCK_INNER_WINDOW_HEIGHT, innerWidth: MOCK_INNER_WINDOW_WIDTH } as Window
		);

		expect(result).toBe(true);
	});

	it('should return true when the tooltip is out of the bottom side of the screen', () => {
		node.getBoundingClientRect = vi.fn(
			() =>
				({
					top: MOCK_INNER_WINDOW_HEIGHT - 10,
					left: 0,
					width: 20,
					height: 20
				} as DOMRect)
		);

		const result = isTooltipOutOfScreen(
			sidesArray.find((el) => el === 'b') as Sides,
			node as HTMLElement,
			{ innerHeight: MOCK_INNER_WINDOW_HEIGHT, innerWidth: MOCK_INNER_WINDOW_WIDTH } as Window
		);

		expect(result).toBe(true);
	});

	it('should return false when the tooltip is within the screen bounds', () => {
		node.getBoundingClientRect = vi.fn(
			() =>
				({
					top: 10,
					left: 10,
					width: MOCK_INNER_WINDOW_WIDTH - 20,
					height: MOCK_INNER_WINDOW_HEIGHT - 20
				} as DOMRect)
		);

		const result = isTooltipOutOfScreen(
			sidesArray.find((el) => el === 'r') as Sides,
			node as HTMLElement,
			{ innerHeight: MOCK_INNER_WINDOW_HEIGHT, innerWidth: MOCK_INNER_WINDOW_WIDTH } as Window
		);

		expect(result).toBe(false);
	});
});
