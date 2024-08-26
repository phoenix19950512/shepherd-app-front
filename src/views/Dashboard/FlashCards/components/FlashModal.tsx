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
  VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface FlashModalProps {
  onSubmit: (noteId?: string | undefined) => void;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttonText: string;
  loadingButtonText: string;
}

export const FlashModal: React.FC<FlashModalProps> = ({
  onSubmit,
  isOpen,
  onClose,
  title,
  buttonText,
  loadingButtonText
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <Box width="80%" margin="0 auto" marginTop="2em">
          Add the number(s) of flashcard to generate.
        </Box>
        <ModalBody paddingTop={'0px'}>
          <VStack width={'full'}>
            <FormControl mt="20px">
              <Input
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                placeholder="Enter a number"
              />
            </FormControl>
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems={'start'}
              width="100%"
              marginTop="10px"
              justifyItems={'start'}
            ></Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          {isLoading ? (
            <Button
              colorScheme="grey"
              onClick={handleSubmit}
              isLoading
              loadingText={loadingButtonText}
            >
              {buttonText}
            </Button>
          ) : (
            <Button
              // isDisabled={}
              colorScheme="blue"
              onClick={handleSubmit}
            >
              {buttonText}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FlashModal;
