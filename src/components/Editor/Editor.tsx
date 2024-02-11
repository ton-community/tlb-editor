import React from 'react';

import {
	Box,
	BoxProps,
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react';
import {
	Editor as MonacoEditor,
	EditorProps as MonacoEditorProps,
} from '@monaco-editor/react';

import './Editor.css';

type EditorProps = Omit<BoxProps, 'onChange'> &
	MonacoEditorProps & {
		errorMessage?: string;
		header?: React.ReactElement;
	};

export const Editor: React.FC<EditorProps> = ({
	header,
	defaultLanguage,
	value,
	options,
	onChange,
	errorMessage,
	...props
}) => {
	return (
		<Flex
			{...props}
			flexDirection={'column'}
			background={'white'}
			borderRadius={'1.5rem'}
			overflow={'hidden'}
			boxShadow={'rgba(114, 138, 150, 0.08) 0px 2px 16px'}
			border={
				errorMessage
					? '1px solid #ef5350'
					: '1px solid rgba(114, 138, 150, 0.24)'
			}
			boxSizing={'border-box'}
		>
			{header}
			<Box flexGrow={1}>
				<MonacoEditor
					defaultLanguage={defaultLanguage}
					value={value}
					onChange={onChange}
					options={{
						minimap: { enabled: false },
						...options,
					}}
				/>
			</Box>

			<Menu>
				<MenuButton as={Button} alignSelf={'center'}>
					Actions
				</MenuButton>
				<MenuList>
					<MenuItem>Download</MenuItem>
					<MenuItem>Create a Copy</MenuItem>
					<MenuItem>Mark as Draft</MenuItem>
					<MenuItem>Delete</MenuItem>
					<MenuItem>Attend a Workshop</MenuItem>
				</MenuList>
			</Menu>

			{errorMessage && (
				<Text mt={'-2.5rem'} zIndex={100} bg={'#ef5350'} px={6} color={'white'}>
					{errorMessage}
				</Text>
			)}
		</Flex>
	);
};
