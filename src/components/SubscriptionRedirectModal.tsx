import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';

const SubscriptionRedirectModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>View in Mobile App</ModalHeader>

        <ModalBody padding={'0 24px'} flexDirection={'column'}>
          <p className="text-[16px]">
            {' '}
            You've already subscribed from our mobile app! Make changes to your
            plan from the app.
          </p>
          <img alt="file" src="/images/coming-soon.svg" />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubscriptionRedirectModal;
