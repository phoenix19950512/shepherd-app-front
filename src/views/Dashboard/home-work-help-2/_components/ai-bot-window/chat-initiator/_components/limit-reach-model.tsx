import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';

function LimitReachModel({
  isLimitModalOpen,
  handleOpenLimitReached,
  handleCloseLimitModal,
  handleOpenPlansModal
}) {
  return (
    <Modal isOpen={isLimitModalOpen} onClose={handleCloseLimitModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Daily Chat Limit Reached</ModalHeader>
        <ModalBody padding={'8px'}>
          <Text textAlign={'center'} fontSize={'16px'}>
            Your daily chat limit has been reached. Upgrade your plan to
            continue using the chat feature now.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleOpenPlansModal}>
            Upgrade Plan
          </Button>
          <Button variant="ghost" onClick={handleCloseLimitModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LimitReachModel;
