import React, { useContext } from 'react';
import { Tab, TabList, Tabs } from '@chakra-ui/react';

import { AppContext, SerializedDataType } from '@/context/AppContext';

const serializedDataTypeToIndex: Record<SerializedDataType, number> = {
    base64: 0,
    hex: 1,
};
const indexToSerializedDataType: Record<number, SerializedDataType> = {
    0: 'base64',
    1: 'hex',
};

export const SerializedDataTypeTab: React.FC = () => {
    const { selectedSerializedDataType, setSelectedSerializedDataType } = useContext(AppContext);
    return (
        <Tabs
            index={serializedDataTypeToIndex[selectedSerializedDataType]}
            onChange={(index) => {
                setSelectedSerializedDataType(indexToSerializedDataType[index]);
            }}
        >
            <TabList border={0} zIndex={100} flexShrink={0} mb={1} ml={3}>
                <Tab>Base64</Tab>
                <Tab>Hex</Tab>
            </TabList>
        </Tabs>
    );
};
