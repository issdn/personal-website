import { beforeEach, describe, expect, test } from 'vitest';
import  Cell  from './internals/cell';
import  CellBoard from './internals/cellBoard';

describe('Test CellBoard', () => {
	const mockCellArray = [
		[new Cell(0, 0, 1), new Cell(0, 2, 1)],
		[new Cell(2, 0, 1), new Cell(2, 2, 1)]
	];
	const _cell = new Cell(0, 2, 1);
	_cell.lastColor = '#000000';
	const mockCellArray2 = [
		[new Cell(0, 0, 1), _cell],
		[new Cell(2, 0, 1), new Cell(2, 2, 1)]
	];
	let cellBoard: CellBoard;
	beforeEach(() => {
		cellBoard = new CellBoard(1, 1);
	});

	test('toRawCollorsArray all zeros', async () => {
		cellBoard.cells = mockCellArray;
		const rawArray = await cellBoard.toRawColorsString();
		expect(rawArray).toEqual('2,4');
	});

	test('toRawCollorsArray standard', async () => {
		cellBoard.cells = mockCellArray2;
		const rawArray = await cellBoard.toRawColorsString();
		expect(rawArray).toEqual('2,1,#0000001,2');
	});

	test('fromRawColorsArray 3x3 only colors', async () => {
		await cellBoard.fromRawColorsArray('3,#0000004,#0000025');
		expect(cellBoard.cells).toMatchObject([
			[
				{ x: 0, y: 0, originColor: '#000000', size: 1 },
				{ x: 0, y: 2, originColor: '#000000', size: 1 },
				{ x: 0, y: 4, originColor: '#000000', size: 1 }
			],
			[
				{ x: 2, y: 0, originColor: '#000000', size: 1 },
				{ x: 2, y: 2, originColor: '#000002', size: 1 },
				{ x: 2, y: 4, originColor: '#000002', size: 1 }
			],
			[
				{ x: 4, y: 0, originColor: '#000002', size: 1 },
				{ x: 4, y: 2, originColor: '#000002', size: 1 },
				{ x: 4, y: 4, originColor: '#000002', size: 1 }
			]
		]);
	});

	test('fromRawColorsArray only zeros', async () => {
		await cellBoard.fromRawColorsArray('2,4');
		expect(cellBoard.cells).toMatchObject([
			[
				{ x: 0, y: 0, originColor: null, size: 1 },
				{ x: 0, y: 2, originColor: null, size: 1 }
			],
			[
				{ x: 2, y: 0, originColor: null, size: 1 },
				{ x: 2, y: 2, originColor: null, size: 1 }
			]
		]);
	});

	test('fromRawColorsArray 2x2', async () => {
		await cellBoard.fromRawColorsArray('2,#0000002,2');
		expect(cellBoard.cells).toMatchObject([
			[
				{ x: 0, y: 0, originColor: '#000000', size: 1 },
				{ x: 0, y: 2, originColor: '#000000', size: 1 }
			],
			[
				{ x: 2, y: 0, originColor: null, size: 1 },
				{ x: 2, y: 2, originColor: null, size: 1 }
			]
		]);
	});

	test('fromRawColorsArray 250x250', async () => {
		await cellBoard.fromRawColorsArray('250,#a760609,62491');
		expect(cellBoard.cells[0][0]).toMatchObject({ originColor: '#a76060' });
		expect(cellBoard.cells[0][8]).toMatchObject({ originColor: '#a76060' });
	});
});
