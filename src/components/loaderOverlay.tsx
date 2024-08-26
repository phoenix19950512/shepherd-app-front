import { Modal, ModalOverlay } from '@chakra-ui/react';
import ShepherdSpinner from '../views/Dashboard/components/shepherd-spinner';
import React from 'react';
import { useLocation } from 'react-router';
const LoaderOverlay = () => {
  const { pathname } = useLocation();
  const bg =
    pathname === '/dashboard/flashcards' ||
    pathname === '/dashboard/quizzes' ||
    pathname === '/dashboard/notes' ||
    pathname === '/dashboard/library'
      ? '#fff'
      : 'rgba(0, 0, 0, 0.5)';
  return (
    <Modal
      onClose={() => {
        return;
      }}
      isOpen
    >
      <ModalOverlay
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: bg // Semi-transparent background
        }}
      >
        <ShepherdSpinner />
      </ModalOverlay>
    </Modal>
  );
};

export default LoaderOverlay;
