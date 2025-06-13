import React from 'react';
import { Flex, Link } from '@chakra-ui/react';

import { GitHubIcon } from '@/assets';
import { TonIcon } from '@/assets/TonIcon';

export const Footer: React.FC = () => {
    return (
        <Flex
            width={'full'}
            as={'footer'}
            height={'4rem'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={3}
            px={'10rem'}
        >
            <Link href={'https://github.com/PolyProgrammist/tlb-editor'}>
                <GitHubIcon fill={'#98b2bf'} _hover={{ fill: '#00a6ff' }} />
            </Link>
            <Link href="https://ton.org/">
                <TonIcon fill={'#98b2bf'} _hover={{ fill: '#00a6ff' }} />
            </Link>
        </Flex>
    );
};
