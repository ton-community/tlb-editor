import { Buffer } from 'buffer';

export const importTonDependencies = async () => {
	const ton = await import('@ton/core');

	const { beginCell, Dictionary, Builder, Slice, BitString, Cell, Address } =
		ton;

	(window as any).beginCell = beginCell;
	(window as any).Dictionary = Dictionary;
	(window as any).Builder = Builder;
	(window as any).Slice = Slice;
	(window as any).BitString = BitString;
	(window as any).Cell = Cell;
	(window as any).Address = Address;

	return {
		beginCell,
		Dictionary,
		Builder,
		Slice,
		BitString,
		Cell,
		Address,
	};
};

export const base64ToHex = (base64: string): string => {
	return Buffer.from(base64, 'base64').toString('hex');
};

export const hexToBase64 = (hex: string): string => {
	return Buffer.from(hex, 'hex').toString('base64');
};
