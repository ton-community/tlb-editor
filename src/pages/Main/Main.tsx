import React, { useCallback, useContext, useEffect } from 'react';
import { debounce } from 'lodash';
import LZString from 'lz-string';
import { useSearchParams } from 'react-router-dom';
import * as ts from 'typescript';
import { Flex, Text } from '@chakra-ui/react';
import { OnChange } from '@monaco-editor/react';
import { ast } from '@ton-community/tlb-parser';
import { TLBCode, CodeGenerator } from '@ton-community/tlb-codegen';

import { base64ToHex, hexToBase64 } from './utils';

import { Editor } from '@/components/Editor';
import { SerializedDataTypeTab } from '@/components/SerializedDataTypeTab';
import { TypeMenu } from '@/components/TypeMenu';
import { AppContext } from '@/context/AppContext';
import {
    base64ToHumanJson,
    generateCodeByAST,
    getTLBCodeByAST,
    humanJsonToBase64,
    TypescriptGenerator,
} from '@/tlbutils';
import { JSONObject } from '@/tlbutils/json_to_base64.ts';

let generator: TypescriptGenerator;
let getGenerator: (tlbCode: TLBCode) => CodeGenerator = (tlbCode: TLBCode) => {
    generator = new TypescriptGenerator(tlbCode);
    return generator;
};

const dummyEvent = {
    changes: [],
    eol: '\n',
    versionId: 0,
    isUndoing: false,
    isRedoing: false,
    isFlush: false,
    isEolChange: false,
};

export const Main: React.FC = () => {
    const {
        tlbSchema,
        setTlbSchema,
        code,
        jsonData,
        setJsonData,
        setCode,
        isCodeLoading,
        setIsCodeLoading,
        tlbError,
        setTlbError,
        serializedDataError,
        setSerializedDataError,
        setTypes,
        setModule,
        module,
        isSerializedDataLoading,
        isJsonDataLoading,
        setIsSerializedDataLoading,
        selectedType,
        setSelectedType,
        selectedSerializedDataType,
        setIsJsonDataLoading,
        jsonDataError,
        setJsonDataError,
        base64,
        setBase64,
        hex,
        setHex,
        setLastEdited,
        lastEdited,
        // handleTypeChange,
    } = useContext(AppContext);

    const [searchParams] = useSearchParams();

    const serializedDataHandler = async (value = '', type = '', newModule: JSONObject = {}) => {
        try {
            if (selectedSerializedDataType === 'base64') {
                setBase64(value);
                const newHex = base64ToHex(value);
                setHex(newHex);
            } else {
                setHex(value);
                const newBase64 = hexToBase64(value);
                setBase64(newBase64);

                value = newBase64;
            }

            if (value === '') {
                setJsonData('');
                setIsJsonDataLoading(false);
                return;
            }

            type = type || selectedType;
            if (!type) {
                return;
            }

            const currentModule: JSONObject = Object.keys(module).length ? module : newModule || {};
            let ft = currentModule[`load${type}`];
            // eslint-disable-next-line no-console
            console.log('base64 from serialized data handler', value);
            const json = await base64ToHumanJson(value, ft);

            setJsonData(
                JSON.stringify(json, (_, value) => (typeof value === 'bigint' ? value.toString() : value), '\t'),
            );
            setSerializedDataError('');
            setLastEdited('serialized');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            setSerializedDataError('Data is invalid');
        } finally {
            setIsJsonDataLoading(false);
        }
    };

    const handleSerializedDataChangeDebounced: OnChange = (value) => serializedDataHandler(value);

    const handleSerializedDataChange: OnChange = useCallback(
        (value, model) => {
            setIsJsonDataLoading(true);

            handleSerializedDataChangeDebounced(value, model);
        },
        [handleSerializedDataChangeDebounced, setIsJsonDataLoading],
    );

    const jsonHandler = useCallback(
        async (value = '', type = '', newTlbSchema = '', newModule?: JSONObject) => {
            try {
                // eslint-disable-next-line no-console
                console.log('json change');
                setJsonData(value);

                if (!value) {
                    setHex('');
                    setBase64('');
                    return;
                }

                type = type || selectedType;
                if (!type) {
                    return;
                }
                const currentModule = Object.keys(newModule || {}).length ? newModule : module;

                const currentTlbSchema = newTlbSchema || tlbSchema;

                const tree = ast(currentTlbSchema);
                let humanReadableJson = JSON.parse(value);

                let tlbCode = getTLBCodeByAST(tree, currentTlbSchema);

                let data = await humanJsonToBase64(
                    humanReadableJson['kind'],
                    tlbCode,
                    humanReadableJson,
                    currentModule[`store${type}`],
                );
                setBase64(data);
                setHex(base64ToHex(data));

                setJsonDataError('');
                setLastEdited('json');
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setJsonDataError('Data is invalid');
            } finally {
                setIsSerializedDataLoading(false);
            }
        },
        [module, selectedType],
    );

    const handleJsonDataChangeDebounced: OnChange = useCallback((value) => jsonHandler(value), [jsonHandler]);

    const handleJsonDataChange: OnChange = useCallback(
        (value, model) => {
            setIsSerializedDataLoading(true);

            handleJsonDataChangeDebounced(value, model);
        },
        [handleJsonDataChangeDebounced, setIsSerializedDataLoading],
    );

    const tlbHandler = useCallback(
        async (value = '') => {
            try {
                setTlbSchema(value);
                if (!value) {
                    setCode('');
                    return;
                }
                setIsCodeLoading(true);
                const tree = ast(value);
                const newCode = generateCodeByAST(tree, value, getGenerator);

                const types = [...generator.tlbCode.types.keys()]
                    .filter(
                        (type: string) => generator.tlbCode.types.get(type).constructors[0]?.parameters.length === 0,
                    )
                    .sort();

                setTypes(types);
                // eslint-disable-next-line no-console
                console.log('selected Type');
                const newSelectedType = selectedType || types[0];
                setSelectedType(newSelectedType);
                setCode(newCode);
                const jsCode = ts
                    .transpile(newCode, { target: 2 })
                    .replace(/import { ([^}]+) } from '@ton\/core';/g, '');
                const blob = new Blob([jsCode], {
                    type: 'application/javascript; charset=utf-8',
                });

                const scriptURL = URL.createObjectURL(blob);

                const newModule = await import(/* @vite-ignore */ scriptURL);
                setModule(newModule);

                setTlbError('');

                setIsCodeLoading(false);

                // handleTypeChange(newSelectedType, newModule, value);

                if (lastEdited === 'serialized') {
                    // eslint-disable-next-line no-console
                    console.log('start regenerate srialized');
                    if (
                        (selectedSerializedDataType === 'base64' && !base64) ||
                        (selectedSerializedDataType === 'hex' && !hex)
                    ) {
                        return newModule;
                    }
                    handleSerializedDataChange(
                        selectedSerializedDataType === 'base64' ? base64 || '' : hex || '',
                        dummyEvent,
                    );
                } else {
                    handleJsonDataChange(jsonData, dummyEvent);
                }

                return newModule;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setCode('');
                setTlbError('Scheme is incorrect');
            } finally {
                setIsCodeLoading(false);
            }
        },
        [
            selectedType,
            base64,
            handleJsonDataChange,
            hex,
            jsonData,
            setCode,
            setModule,
            setIsCodeLoading,
            lastEdited,
            setTlbError,
            setTlbSchema,
            setTypes,
            handleSerializedDataChange,
            selectedSerializedDataType,
            setSelectedType,
        ],
    );

    const handleTlbChangeDebounced: OnChange = useCallback(
        debounce((value) => tlbHandler(value), 1000),
        [selectedType],
    );

    const handleTlbChange: OnChange = useCallback(
        async (value, model) => {
            setIsCodeLoading(true);

            handleTlbChangeDebounced(value, model);
        },
        [handleTlbChangeDebounced, setIsCodeLoading],
    );

    useEffect(() => {
        const parseState = async () => {
            const tlbState = LZString.decompressFromEncodedURIComponent(searchParams.get('tlb') || '');
            const jsonState = LZString.decompressFromEncodedURIComponent(searchParams.get('json') || '');
            const base64State = LZString.decompressFromEncodedURIComponent(searchParams.get('base64') || '');
            const typeState = LZString.decompressFromEncodedURIComponent(searchParams.get('type') || '');
            setTlbSchema(tlbState);
            setIsCodeLoading(true);
            const module = await tlbHandler(tlbState);
            // eslint-disable-next-line no-console
            console.log('module', module);

            setSelectedType(typeState);
            setBase64(base64State);
            // eslint-disable-next-line no-console
            console.log('-----', base64State);

            if (base64State) {
                await serializedDataHandler(base64State, typeState, module);
                await serializedDataHandler(base64State, typeState, module);
            } else if (jsonState) {
                await jsonHandler(jsonState, typeState, tlbState, module);
            }
        };
        parseState();
    }, [searchParams]);
    return (
        <Flex as="main" flexGrow={1} gap={5} px={'1.25rem'} pt={'1.25rem'}>
            <Flex flexDirection="column" flexGrow={1} gap={5}>
                <Editor
                    header={<Text>TLB Schema</Text>}
                    flexGrow={2}
                    defaultLanguage="tlb"
                    value={tlbSchema}
                    onChange={handleTlbChange}
                    options={{
                        minimap: { enabled: false },
                    }}
                    footer={
                        <Flex justifyContent={'center'} alignItems={'center'} flexGrow={1} py={3}>
                            <TypeMenu />
                        </Flex>
                    }
                    errorMessage={tlbError}
                    fileName={'scheme.tlb'}
                />

                <Editor
                    header={<SerializedDataTypeTab />}
                    flexGrow={1}
                    isLoading={isSerializedDataLoading}
                    value={selectedSerializedDataType === 'base64' ? base64 : hex}
                    options={{
                        minimap: { enabled: false },
                        readOnly: !tlbSchema || Boolean(tlbError) || !selectedType,
                    }}
                    errorMessage={serializedDataError}
                    onChange={handleSerializedDataChange}
                    fileName={'serialized.txt'}
                    wordWrap="on"
                />
            </Flex>

            <Editor
                isLoading={isJsonDataLoading}
                header={<Text>JSON</Text>}
                flexGrow={1}
                defaultLanguage="json"
                value={jsonData}
                errorMessage={jsonDataError}
                options={{
                    minimap: { enabled: false },
                    readOnly: !tlbSchema || Boolean(tlbError) || !selectedType,
                }}
                onChange={handleJsonDataChange}
                fileName={'deserialized.json'}
            />

            <Editor
                isLoading={isCodeLoading}
                header={<Text>Code</Text>}
                flexGrow={1}
                defaultLanguage="typescript"
                value={code}
                options={{
                    minimap: { enabled: false },
                    readOnly: true,
                }}
                fileName={'code.ts'}
            />
        </Flex>
    );
};
