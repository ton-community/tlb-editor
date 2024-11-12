import { Buffer } from 'buffer';

export const importTonDependencies = async () => {
	const ton = await import('@ton/core');

	const { beginCell, Dictionary, Builder, Slice, BitString, Cell, Address, serializeTuple, parseTuple } =
		ton;

	(window as any).beginCell = beginCell;
	(window as any).Dictionary = Dictionary;
	(window as any).Builder = Builder;
	(window as any).Slice = Slice;
	(window as any).BitString = BitString;
	(window as any).Cell = Cell;
	(window as any).Address = Address;
	(window as any).serializeTuple = serializeTuple;
	(window as any).parseTuple = parseTuple;

	return {
		beginCell,
		Dictionary,
		Builder,
		Slice,
		BitString,
		Cell,
		Address,
		serializeTuple,
		parseTuple,
	};
};

export const base64ToHex = (base64: string): string => {
	return Buffer.from(base64, 'base64').toString('hex');
};

export const hexToBase64 = (hex: string): string => {
	return Buffer.from(hex, 'hex').toString('base64');
};
