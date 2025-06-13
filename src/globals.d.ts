import { Buffer } from 'buffer';

import { beginCell, Dictionary, Builder, Slice, BitString, Cell, Address } from '@ton/core';

declare global {
    interface Window {
        beginCell: beginCell;
        Dictionary: typeof Dictionary;
        Builder: typeof Builder;
        Slice: typeof Slice;
        BitString: typeof BitString;
        Cell: typeof Cell;
        Address: typeof Address;
        Buffer: Buffer;
    }
}

export {};
