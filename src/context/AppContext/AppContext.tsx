import React, { PropsWithChildren, useState } from 'react';
import { ast } from '@ton-community/tlb-parser';

import { FieldType, IAppContext, SerializedDataType } from './types';

import { useMonacoSetup } from '@/hooks/useMonacoSetup';
import { base64ToHumanJson, getDefaulHumanJsonUnsafe, getTLBCodeByAST, humanJsonToBase64 } from '@/tlbutils';
import { JSONObject, JSONValue } from '@/tlbutils/json_to_base64.ts';

export const AppContext = React.createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tlbSchema, setTlbSchema] = useState<string>('');
    const [tlbError, setTlbError] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
    const [base64, setBase64] = useState<string>('');
    const [hex, setHex] = useState<string>('');
    const [serializedDataError, setSerializedDataError] = useState<string>('');
    const [isSerializedDataLoading, setIsSerializedDataLoading] = useState<boolean>(false);
    const [jsonData, setJsonData] = useState<string>('');
    const [jsonDataError, setJsonDataError] = useState<string>('');
    const [isJsonDataLoading, setIsJsonDataLoading] = useState<boolean>(false);
    const [types, setTypes] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [module, setModule] = useState<JSONObject>({});
    const [selectedSerializedDataType, setSelectedSerializedDataType] = useState<SerializedDataType>('base64');
    const [lastEdited, setLastEdited] = useState<FieldType>('serialized');

    useMonacoSetup();

    const handleTypeChange = async (value = '', newModule = {}, newTlbSchema = '') => {
        try {
            setSelectedType(value);
            if (!value) {
                return;
            }
            const currentTlbSchema = newTlbSchema || tlbSchema;

            const tree = ast(currentTlbSchema);
            // eslint-disable-next-line no-console
            console.log(tree);
            let tlbCode = getTLBCodeByAST(tree, currentTlbSchema);

            let humanReadable: JSONObject = (await getDefaulHumanJsonUnsafe(tlbCode, tlbCode.types.get(value)!)) || {};

            const replacer = (_key: string, value: JSONValue) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            };
            const json = JSON.stringify(humanReadable, replacer, '\t');

            // reload humanReadableJson so that it becomes valid
            const currentModule = Object.keys(newModule).length ? newModule : module;

            humanReadable = JSON.parse(json);
            const kind = humanReadable['kind'];
            if (!(kind && typeof kind === 'string')) {
                return;
            }
            let base64 = await humanJsonToBase64(kind, tlbCode, humanReadable, currentModule[`store${value}`]);
            // eslint-disable-next-line no-console
            console.log('base64 from type change', base64);
            humanReadable = await base64ToHumanJson(base64, currentModule[`load${value}`]);

            setJsonData(
                JSON.stringify(
                    humanReadable,
                    (_, value) => (typeof value === 'bigint' ? value.toString() : value),
                    '\t',
                ),
            );

            let data = await humanJsonToBase64(
                humanReadable['kind'],
                tlbCode,
                humanReadable,
                currentModule[`store${value}`],
            );

            setBase64(data);
            setJsonDataError('');
        } catch (_) {
            setJsonDataError('Default JSON generation failed.');
        }
    };

    return (
        <AppContext.Provider
            value={{
                isLoading,
                setIsLoading,
                types,
                setTypes,
                tlbSchema,
                setTlbSchema,
                base64,
                setBase64,
                hex,
                setHex,
                code,
                setCode,
                isCodeLoading,
                setIsCodeLoading,
                serializedDataError,
                setSerializedDataError,
                isSerializedDataLoading,
                setIsSerializedDataLoading,
                isJsonDataLoading,
                setIsJsonDataLoading,
                jsonData,
                setJsonData,
                jsonDataError,
                setJsonDataError,
                tlbError,
                setTlbError,
                selectedType,
                setSelectedType,
                setModule,
                module,
                selectedSerializedDataType,
                setSelectedSerializedDataType,
                lastEdited,
                setLastEdited,
                handleTypeChange,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
