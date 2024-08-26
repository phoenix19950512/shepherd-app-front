import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

interface TagModalProps {
  title: string;
  tags: string[];
  open: boolean;
  inputValue?: string;
  submitText?: string;
  cancelText?: string;
  onClose?: (...args: any) => any;
  onOpen?: (...args: any) => any;
  onSubmit?: (...args: any) => any;
  onCancel?: (...args: any) => any;
}

export const TagModal: React.FC<TagModalProps> = (props) => {
  const [tagList, setTagList] = useState<string[]>(props.tags ?? []);
  const {
    title,
    open,
    inputValue,
    onClose,
    onOpen,
    onSubmit,
    onCancel,
    submitText,
    cancelText
  } = props;
  const Tags = () => {
    return (
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems={'start'}
        width="100%"
        marginTop="10px"
        justifyItems={'start'}
      ></Box>
    );
  };

  return (
    <Modal isOpen={open} onClose={() => (onClose ? onClose(tagList) : null)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={'0px'}>
          <VStack width={'full'}>
            <FormControl mt="20px">
              <Input
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                placeholder="Add a tag and press enter"
                value={inputValue}
                // onChange={handleInputChange}
                // onKeyDown={(event) => {
                //   if (event.key === 'Enter') {
                //     handleAddTag();
                //     event.preventDefault();
                //   }
                // }}
              />
            </FormControl>
            <Tags />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={undefined}>{cancelText ?? 'Cancel'}</Button>
          <Button colorScheme="blue" onClick={undefined}>
            {submitText ?? 'Submit'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TagModal;
