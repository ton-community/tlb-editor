import { useEffect } from 'react';

import { useMonaco } from '@monaco-editor/react';

export const useMonacoSetup = () => {
	const monaco = useMonaco();

	useEffect(() => {
		if (monaco) {
			monaco.languages.register({ id: 'tlb' });
			//@ts-ignore
			monaco.languages.setMonarchTokensProvider('tlb', syntaxConfig);
		}
	}, [monaco]);
};

const syntaxConfig = {
	// Set defaultToken to invalid to see what you do not tokenize yet
	// defaultToken: 'invalid',

	keywords: [
		'abstract',
		'continue',
		'for',
		'switch',
		'assert',
		'goto',
		'do',
		'if',
		'private',
		'this',
		'break',
		'protected',
		'throw',
		'else',
		'public',
		'enum',
		'return',
		'catch',
		'try',
		'interface',
		'static',
		'class',
		'finally',
		'const',
		'super',
		'while',
		'true',
		'false',
	],

	typeKeywords: [
		'boolean',
		'double',
		'byte',
		'int',
		'short',
		'char',
		'void',
		'long',
		'float',
		'Type',
		'#',
	],

	operators: [
		'=',
		'>',
		'<',
		'!',
		'~',
		'?',
		':',
		'==',
		'<=',
		'>=',
		'!=',
		'&&',
		'||',
		'++',
		'--',
		'+',
		'-',
		'*',
		'/',
		'&',
		'|',
		'^',
		'%',
		'<<',
		'>>',
		'>>>',
		'+=',
		'-=',
		'*=',
		'/=',
		'&=',
		'|=',
		'^=',
		'%=',
		'<<=',
		'>>=',
		'>>>=',
	],

	// we include these common regular expressions
	symbols: /[=><!~?:&|+\-*\/\^%]+/,

	// C# style strings
	escapes:
		/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			// identifiers and keywords
			[
				/[a-z_$][\w$]*/,
				{
					cases: {
						'@typeKeywords': 'keyword',
						'@keywords': 'keyword',
						'@default': 'identifier',
					},
				},
			],
			// to show class names nicely
			[/Type\b/, 'type.keyword'],
			[/#\w*/, 'type.keyword'],
			[/\$\w*/, 'type.keyword'],

			// [/:/, 'operator', '@afterColon'],
			[/=/, 'operator', '@postEqual'],
			// // whitespace
			{ include: '@whitespace' },
			// // delimiters and operators
			[/[{}()\[\]]/, '@brackets'],
			[/[<>](?!@symbols)/, '@brackets'],
			// [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
			// // @ annotations.
			// // As an example, we emit a debugging log message on these tokens.
			// // Note: message are supressed during the first load -- change some lines to see them.
			// [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
			// // numbers
			[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
			[/0[xX][0-9a-fA-F]+/, 'number.hex'],
			[/\d+/, 'number'],
			// // delimiter: after number because of .\d floats
			[/[;,.]/, 'delimiter'],
			// strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
			// characters
			[/'[^\\']'/, 'string'],
			[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
			[/'/, 'string.invalid'],
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			[/\/\*/, 'comment', '@push'], // nested comment
			['\\*/', 'comment', '@pop'],
			[/[\/*]/, 'comment'],
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
		],

		whitespace: [
			[/[ \t\r\n]+/, 'white'],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment'],
		],

		postEqual: [
			// Match words after "="
			[/\s+/, 'white'], // skip whitespaces
			[/[a-zA-Z_$][\w$]*/, 'variable', '@pop'], // Highlight word and return to the root state
			[/$/, '', '@pop'], // Return to root state at end of line
		],

		afterColon: [
			[/Type\b/, 'type.keyword', '@pop'],
			[/\(/, 'delimiter.parenthesis', '@insideParens'], // Match opening parenthesis and switch to insideParens state
			[/$/, '', '@pop'], // Handle end of line to return to root
			[/@.*/, 'text'], // Catch all other text and classify as text, staying in afterColon
		],

		insideParens: [
			[/Type\b/, 'type.keyword'],
			[/[A-Z][\w$]*/, 'variable', '@maybeCloseParen'], // Match words starting with capital letters
			[/\)/, 'delimiter.parenthesis', '@pop'], // Match closing parenthesis and pop to afterColon
			[/@.*/, 'text'], // All other text remains regular text
		],

		maybeCloseParen: [
			[/\s+/, 'white'], // Handle whitespace
			[/\)/, 'delimiter.parenthesis', '@popall'], // Pop all states when closing parenthesis
			[/[A-Z][\w$]*/, 'variable'], // Continue to match capital letter words
			[/@.*/, 'text'], // Other characters are just text
		],
	},
};
