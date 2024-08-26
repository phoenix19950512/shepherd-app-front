import React from 'react';
import {
  Box,
  Button,
  Skeleton,
  HStack,
  Flex,
  Menu,
  MenuItem,
  MenuButton,
  MenuGroup,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

const FlashcardSkeleton = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="12px"
        w="full" // Use the full width of the screen
        maxW={{ base: '95%', sm: '80%', md: '700px' }} // Responsive max width
        mx="auto"
        position="relative"
      >
        <Box
          padding={0}
          display={'flex'}
          justifyContent={'space-between'}
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
          flexDirection={'column'}
          minWidth={{ base: '80%', md: '700px' }}
          width="auto"
        >
          <Box w="100%">
            <Flex
              width="full"
              padding={{ base: '20px 15px', md: '20px' }}
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack spacing={4} alignItems="center">
                <Skeleton height="20px" width="120px" />
                <Skeleton height="20px" width="80px" />
              </HStack>
              <HStack spacing={4} alignItems="center">
                <Skeleton height="40px" width="80px" borderRadius="8px" />
              </HStack>
            </Flex>
            <Box position="relative" width="100%" height="2px">
              <Box
                className="progress-bar-base"
                position="absolute"
                width="100%"
                height="2px"
                bg="#EEEFF2"
                borderRadius="2px"
              />
            </Box>
            <Skeleton height="500px" />
          </Box>
        </Box>
        <ModalFooter>
          <Box ml="auto">
            <Skeleton height="32px" width="80px" />
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default FlashcardSkeleton;
