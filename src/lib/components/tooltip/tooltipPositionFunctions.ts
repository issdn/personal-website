// In percent
const arrowNodeGapSize = 50;

export const sides = {
	rm: `top: ${100 + arrowNodeGapSize}%; left: 0; transform: translateY(-50%);`,
	lm: `top: ${100 + arrowNodeGapSize}%; right: 0; transform: translateY(-50%);`,
	tm: `bottom: ${100 + arrowNodeGapSize}%; left: 50%; transform: translateX(-50%);`,
	bm: `top: ${100 + arrowNodeGapSize}%; left: 50%; transform: translateX(-50%);`,
	tl: `bottom: ${100 + arrowNodeGapSize}%; right: 0;`,
	tr: `bottom: ${100 + arrowNodeGapSize}%; left: 0;`,
	bl: `top: ${100 + arrowNodeGapSize}%; right: 0;`,
	br: `top: ${100 + arrowNodeGapSize}%; left: 0;`,
	l: `top: 50%; right: ${100 + arrowNodeGapSize}%; transform: translateY(-50%);`,
	r: `top: 50%; left: ${100 + arrowNodeGapSize}%; transform: translateY(-50%);`
} as const;

export type Sides = keyof typeof sides;

export const sidesArray = Object.keys(sides) as (keyof typeof sides)[];

export const arrowPositionFromTooltipSide = (side: Sides, arrowPosition: Sides | 'm') => {
	return (side + arrowPosition) as ArrowCreationKey;
};

const getFreePossibleSides = (
	node: HTMLElement,
	window: Window,
	squashedFreeSide: 'r' | 'l' | null = null
): Sides | null => {
	const { top, left, width, height } = node.getBoundingClientRect();
	const { width: parentWidth } = node.parentElement?.getBoundingClientRect() ?? { width: 0 };
	const ratioX = (1 + arrowNodeGapSize / 100) * width;
	const ratioY = (1 + arrowNodeGapSize / 100) * height;

	const t = top - ratioY > 0;
	const b = top + ratioY < window.innerHeight;
	const m = left + width / 2 < window.innerWidth && left - width / 2 > 0;
	const l = left - ratioX > 0;
	const r = left + ratioX < window.innerWidth;
	const startRToL = left - width + parentWidth > 0;
	const startLToR = left + width - parentWidth < window.innerWidth;
	switch (true) {
		case t && m:
			return 'tm';
		case b && m:
			return 'bm';
		case l:
			return 'l';
		case r:
			return 'r';
		case t && (startRToL || squashedFreeSide === 'l'):
			return 'tl';
		case t && (startLToR || squashedFreeSide === 'r'):
			return 'tr';
		case b && (startRToL || squashedFreeSide === 'l'):
			return 'bl';
		case b && (startLToR || squashedFreeSide === 'r'):
			return 'br';
		default:
			return null;
	}
};

export const getWidestPossibleSideAndSetWidth = (
	node: HTMLElement,
	window: Window
): ['l' | 'r', string] => {
	const { left } = node.getBoundingClientRect();
	const largestPossibleWidthOnRight = window.innerWidth - left;
	const largestPossibleWidthOnLeft = left;
	if (largestPossibleWidthOnLeft > largestPossibleWidthOnRight) {
		return ['l', `white-space: normal;`];
	} else {
		return ['r', `white-space: normal;`];
	}
};

export const adjustTooltipPosition = (
	node: HTMLElement,
	window: Window,
	squashedFreeSide: 'r' | 'l' | null = null
) => {
	const tooltipSide = getFreePossibleSides(node, window, squashedFreeSide);
	if (!tooltipSide) {
		if (!squashedFreeSide) {
			return null;
		}
		return [sides['bm'], 'tSide mvPos bDir'];
	}
	let arrowDirection: AD;
	let arrowSide: AS;
	let arrowPosition: AP;
	switch (tooltipSide) {
		case 'l':
			arrowSide = 'rSide';
			break;
		case 'r':
			arrowSide = 'lSide';
			break;
		case 'tm':
		case 'tr':
		case 'tl':
			arrowSide = 'bSide';
			break;
		case 'bm':
		case 'br':
		case 'bl':
			arrowSide = 'tSide';
			break;
		default:
			arrowSide = 'bSide';
	}

	switch (arrowSide) {
		case 'tSide':
			arrowDirection = 'bDir';
			break;
		case 'bSide':
			arrowDirection = 'tDir';
			break;
		case 'lSide':
			arrowDirection = 'rDir';
			break;
		case 'rSide':
			arrowDirection = 'lDir';
			break;
		default:
			arrowDirection = 'bDir';
			break;
	}
	switch (tooltipSide) {
		case 'tm':
			arrowPosition = 'mhPos';
			break;
		case 'bm':
			arrowPosition = 'mhPos';
			break;
		case 'tr':
		case 'br':
			arrowPosition = 'lPos';
			break;
		case 'tl':
		case 'bl':
			arrowPosition = 'rPos';
			break;
		default: {
			arrowPosition = 'mvPos';
			break;
		}
	}

	const arrowClasses = arrowSide + ' ' + arrowPosition + ' ' + arrowDirection;
	return [sides[tooltipSide as Sides], arrowClasses];
};
