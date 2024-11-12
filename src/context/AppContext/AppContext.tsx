import React, { PropsWithChildren, useState } from 'react';

import { ast } from '@ton-community/tlb-parser';

import { useMonacoSetup } from '@/hooks/useMonacoSetup';
import {
	base64ToHumanJson,
	getDefaulHumanJsonUnsafe,
	getTLBCodeByAST,
	humanJsonToBase64,
} from '@/tlbutils';

import { FieldType, IAppContext, SerializedDataType } from './types';

export const AppContext = React.createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tlbSchema, setTlbSchema] = useState<string>('');
	const [tlbError, setTlbError] = useState<string>('');
	const [code, setCode] = useState<string>('');
	const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
	const [base64, setBase64] = useState<string>('');
	const [hex, setHex] = useState<string>('');
	const [serializedDataError, setSerializedDataError] = useState<string>('');
	const [isSerializedDataLoading, setIsSerializedDataLoading] =
		useState<boolean>(false);
	const [jsonData, setJsonData] = useState<string>('');
	const [jsonDataError, setJsonDataError] = useState<string>('');
	const [isJsonDataLoading, setIsJsonDataLoading] = useState<boolean>(false);
	const [types, setTypes] = useState<string[]>([]);
	const [selectedType, setSelectedType] = useState<string>('');
	const [module, setModule] = useState<{}>({});
	const [selectedSerializedDataType, setSelectedSerializedDataType] =
		useState<SerializedDataType>('base64');
	const [lastEdited, setLastEdited] = useState<FieldType>('serialized');

	useMonacoSetup();

	const handleTypeChange = async (
		value = '',
		newModule = {},
		newTlbSchema = ''
	) => {
		try {
			setSelectedType(value);
			if (!value) {
				return;
			}
			const currentTlbSchema = newTlbSchema || tlbSchema;

			const tree = ast(currentTlbSchema);
			let tlbCode = getTLBCodeByAST(tree, currentTlbSchema);
			let humanReadableJson = await getDefaulHumanJsonUnsafe(
				tlbCode,
				tlbCode.types.get(value)!
			);

			humanReadableJson = JSON.stringify(
				humanReadableJson,
				(_, value) => (typeof value === 'bigint' ? value.toString() : value),
				'\t'
			);

			// reload humanReadableJson so that it becomes valid
			const currentModule = Object.keys(newModule).length ? newModule : module;

			humanReadableJson = JSON.parse(humanReadableJson);
			let base64 = await humanJsonToBase64(
				humanReadableJson['kind'],
				tlbCode,
				humanReadableJson,
				//@ts-ignore
				currentModule[`store${value}`]
			);
			humanReadableJson = await base64ToHumanJson(
				base64,
				//@ts-ignore
				currentModule[`load${value}`]
			);

			setJsonData(
				JSON.stringify(
					humanReadableJson,
					(_, value) => (typeof value === 'bigint' ? value.toString() : value),
					'\t'
				)
			);

			let data = await humanJsonToBase64(
				humanReadableJson['kind'],
				tlbCode,
				humanReadableJson,
				//@ts-ignore
				currentModule[`store${value}`]
			);

			setBase64(data);
			setJsonDataError('');
		} catch (e) {
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
