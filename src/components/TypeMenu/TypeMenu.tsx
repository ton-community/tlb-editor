import React, { useContext } from 'react';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { AppContext } from '@/context/AppContext';

export const TypeMenu: React.FC = () => {
    const { types, tlbSchema, tlbError, selectedType, handleTypeChange } = useContext(AppContext);

    return (
        <Menu placement={'bottom'}>
            <MenuButton
                minW={'10rem'}
                as={Button}
                alignSelf={'center'}
                isDisabled={!tlbSchema || Boolean(tlbError)}
                size={'sm'}
            >
                {selectedType || 'Types'}
            </MenuButton>
            <MenuList maxHeight={'10rem'} overflow={'scroll'}>
                {types.map((type) => (
                    <MenuItem key={type} onClick={() => handleTypeChange(type)}>
                        {type}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};
