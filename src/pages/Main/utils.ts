import { Buffer } from 'buffer';

export const importTonDependencies = async () => {
    const ton = await import('@ton/core');

    const { beginCell, Dictionary, Builder, Slice, BitString, Cell, Address } = ton;

    window.beginCell = beginCell;
    window.Dictionary = typeof Dictionary;
    window.Builder = typeof Builder;
    window.Slice = typeof Slice;
    window.BitString = typeof BitString;
    window.Cell = typeof Cell;
    window.Address = typeof Address;

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
