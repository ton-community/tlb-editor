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
	serializedData: string;
	setSerializedData: React.Dispatch<React.SetStateAction<string>>;
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
	module: Record<string, any>;
	setModule: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export type DataField = 'SERIALIZED' | 'JSON';
