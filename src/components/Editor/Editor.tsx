import React, { useRef } from 'react';
import { Box, BoxProps, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { Editor as MonacoEditor, EditorProps as MonacoEditorProps } from '@monaco-editor/react';

import './Editor.css';

type EditorProps = Omit<BoxProps, 'onChange'> &
    MonacoEditorProps & {
        errorMessage?: string;
        header?: React.ReactElement;
        footer?: React.ReactElement;
        isLoading?: boolean;
        fileName: string;
        wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
    };

export const Editor: React.FC<EditorProps> = ({
    header,
    defaultLanguage,
    value,
    options,
    onChange,
    errorMessage,
    footer,
    isLoading = false,
    fileName,
    wordWrap,
    ...props
}) => {
    const hiddenLinkRef = useRef<HTMLAnchorElement>(null);

    const [isRecentlyCopied, setIsRecentlyCopied] = React.useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCopy = () => {
        navigator.clipboard
            .writeText(value || '')
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('Text copied to clipboard');
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error('Failed to copy text: ', err);
            });

        setIsRecentlyCopied(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsRecentlyCopied(false);
        }, 1000);
    };

    const handleDownload = () => {
        // Create a Blob from the input content
        const blob = new Blob([value || ''], { type: 'text/plain' });
        // Create a URL for the Blob
        const fileUrl = URL.createObjectURL(blob);
        // Use a hidden link element to download the file
        const link = hiddenLinkRef.current;

        if (!link) {
            return;
        }

        link.href = fileUrl;
        link.download = fileName;
        link.click();
        // Clean up the URL object
        URL.revokeObjectURL(fileUrl);
    };

    return (
        <Flex
            {...props}
            flexShrink={0}
            position={'relative'}
            flexDirection={'column'}
            background={'white'}
            borderRadius={'1.5rem'}
            overflow={'hidden'}
            boxShadow={'rgba(114, 138, 150, 0.08) 0px 2px 16px'}
            border={errorMessage ? '1px solid #ef5350' : '1px solid rgba(114, 138, 150, 0.24)'}
            boxSizing={'border-box'}
        >
            <Flex padding={1} justifyContent={'space-between'} mx={3} alignItems={'center'}>
                {header}
                <Box>
                    <Button onClick={handleCopy} isDisabled={!value} mr={3} size={'sm'}>
                        {isRecentlyCopied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button onClick={handleDownload} isDisabled={!value} size={'sm'}>
                        Download
                    </Button>
                </Box>
            </Flex>

            <Box position={'relative'} flexGrow={1}>
                {isLoading && (
                    <Flex
                        position={'absolute'}
                        width={'100%'}
                        height={'100%'}
                        flexGrow={1}
                        zIndex={100}
                        bg={'white'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Spinner />
                    </Flex>
                )}
                <Flex height={'100%'} width={'100%'}>
                    <MonacoEditor
                        loading={
                            <Flex justifyContent={'center'} alignItems={'center'} height={'100%'} width={'100%'}>
                                <Spinner />
                            </Flex>
                        }
                        defaultLanguage={defaultLanguage}
                        value={value}
                        onChange={onChange}
                        options={{
                            showUnused: false,
                            minimap: { enabled: false },
                            wordWrap: wordWrap,
                            ...options,
                        }}
                    />
                </Flex>
            </Box>

            {footer}
            {errorMessage && (
                <Text zIndex={100} bg={'#ef5350'} px={6} color={'white'} position={'absolute'} bottom={0}>
                    {errorMessage}
                </Text>
            )}
            <a ref={hiddenLinkRef} style={{ display: 'none' }}>
                Download Link
            </a>
        </Flex>
    );
};
