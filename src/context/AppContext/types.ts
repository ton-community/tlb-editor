import React from 'react';

import { JSONObject } from '@/tlbutils/json_to_base64.ts';

export interface IAppContext {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    tlbSchema: string;
    setTlbSchema: React.Dispatch<React.SetStateAction<string>>;
    tlbError: string;
    setTlbError: React.Dispatch<React.SetStateAction<string>>;
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    isCodeLoading: boolean;
    setIsCodeLoading: React.Dispatch<React.SetStateAction<boolean>>;
    base64: string;
    setBase64: React.Dispatch<React.SetStateAction<string>>;
    hex: string;
    setHex: React.Dispatch<React.SetStateAction<string>>;
    isSerializedDataLoading: boolean;
    setIsSerializedDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
    serializedDataError: string;
    setSerializedDataError: React.Dispatch<React.SetStateAction<string>>;
    isJsonDataLoading: boolean;
    setIsJsonDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
    jsonData: string;
    setJsonData: React.Dispatch<React.SetStateAction<string>>;
    jsonDataError: string;
    setJsonDataError: React.Dispatch<React.SetStateAction<string>>;
    types: string[];
    setTypes: React.Dispatch<React.SetStateAction<string[]>>;
    selectedType: string;
    setSelectedType: React.Dispatch<React.SetStateAction<string>>;
    module: Record<string, never>;
    setModule: React.Dispatch<React.SetStateAction<Record<string, never>>>;
    selectedSerializedDataType: SerializedDataType;
    setSelectedSerializedDataType: React.Dispatch<React.SetStateAction<SerializedDataType>>;
    lastEdited: FieldType;
    setLastEdited: React.Dispatch<React.SetStateAction<FieldType>>;
    handleTypeChange: (value: string, module?: JSONObject, tlbSchema?: string) => void;
}

export type SerializedDataType = 'base64' | 'hex';
export type FieldType = 'serialized' | 'json';
