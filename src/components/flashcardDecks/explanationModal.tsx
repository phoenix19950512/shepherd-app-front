import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  Tabs,
  Text
} from '@chakra-ui/react';
import React from 'react';

export const TabModal = ({
  isOpen,
  onCancel,
  onChange,
  text,
  tabIndex
}: {
  isOpen: boolean;
  onCancel: () => void;
  text: string;
  tabIndex: number;
  onChange: (id: number) => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} isCentered>
      <ModalOverlay />
      <ModalContent
        minWidth={{ base: '80%', md: '500px' }}
        mx="auto"
        w="fit-content"
        borderRadius="10px"
      >
        <ModalHeader>
          <Tabs
            index={tabIndex}
            onChange={(index) => onChange(index)}
            isFitted
            variant="enclosed"
          >
            <TabList mb="1em">
              <Tab>Answer</Tab>
              <Tab>Explanation</Tab>
            </TabList>
          </Tabs>
        </ModalHeader>
        <ModalBody>
          <Text lineHeight="6" fontSize={'16px'} color="#000">
            {text}
          </Text>
        </ModalBody>
        <ModalFooter
          bg="#F7F7F8"
          borderRadius="0px 0px 10px 10px"
          p="16px"
          justifyContent="flex-end"
        >
          <Button onClick={onCancel} colorScheme="blue" mr={3}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TabModal;
