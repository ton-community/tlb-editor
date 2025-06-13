import base from '@ton/toolchain';

export default [
    ...base,
    {
        languageOptions: {
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLAnchorElement: 'readonly',
                NodeJS: 'readonly',
            },
        },
        rules: {},
    },
];
