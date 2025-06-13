import { useEffect } from 'react';
import { useMonaco } from '@monaco-editor/react';

export const useMonacoSetup = () => {
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            monaco.languages.register({ id: 'tlb' });
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

    typeKeywords: ['boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float', 'Type', '#'],

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
    symbols: /[=><!~?:&|+\-*/^%]+/,

    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

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
            [/=/, 'operator', '@postEqual'],
            [/:/, 'operator', '@afterColon'],

            // // whitespace
            { include: '@whitespace' },
            // // delimiters and operators
            [/[{}()[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            // [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
            // // @ annotations.
            // // As an example, we emit a debugging log message on these tokens.
            // // Note: message are supressed during the first load -- change some lines to see them.
            // [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
            // // numbers
            [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
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
            [/[^/*]+/, 'comment'],
            [/\/\*/, 'comment', '@push'], // nested comment
            ['\\*/', 'comment', '@pop'],
            [/[/*]/, 'comment'],
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
            [/\s+/, 'white'], // skip whitespaces
            [/[{}()[\];,.]/, 'delimiter'], // skip common delimiters
            [/:[^=\s]+/, 'type'], // skip type annotations
            [/[a-zA-Z_$][\w$]*/, 'variable', '@pop'], // highlight variable after "="
            [/$/, '@pop'], // return to root at end of line
        ],

        afterColon: [
            // Handling space or any non-relevant characters between colon and opening parenthesis
            [/\s+/, 'white'],
            [
                /\(/,
                {
                    token: 'delimiter.parenthesis',
                    bracket: '@open',
                    next: '@insideParens',
                },
            ],
            // Default skip other characters, might adjust based on actual needs
            [/./, 'white'],
        ],

        insideParens: [
            // Highlight all words inside parentheses
            [/[a-zA-Z_$][\w$]*/, 'highlight'], // Custom style for words
            [/\)/, { token: 'delimiter.parenthesis', bracket: '@close', next: '@pop' }],
            // Handle whitespace and other characters within parentheses
            [/\s+/, 'white'],
            [/,/, 'delimiter'],
            [/./, 'text'],
        ],
    },
};
