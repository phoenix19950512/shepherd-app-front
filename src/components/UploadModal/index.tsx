import DragAndDrop from '../DragandDrop';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Progress,
  Text
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import userStore from '../../state/userStore';
import PlansModal from '../PlansModal';

// ... Your DragAndDrop component code here ...

interface UploadModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  accept?: string;
  onClose: () => void;
  onUpload: (file: File) => void; // Callback function for when the "Upload" button is clicked
  progress?: number;
  countdown?: {
    active: boolean;
    message: string;
  };
  setProgress?: any;
  confirmReady?: boolean;
  file?: any;
  setFile?: any;
  // You can add more props as needed
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isLoading,
  accept,
  progress,
  countdown,
  setProgress,
  confirmReady,
  file,
  setFile
}) => {
  const { hasActiveSubscription, fileSizeLimitMB, fileSizeLimitBytes } =
    userStore();

  const hasFile = Boolean(file);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');

  const CountdownProgressBar = ({
    confirmReady,
    countdown
  }: {
    confirmReady: boolean;
    countdown: { active: boolean; message: string };
  }) => {
    // const [progress, setProgress] = useState(0);

    const randomSeed = (min = 1, max = 10) =>
      Math.floor(Math.random() * (max - min + 5) + min);

    useEffect(() => {
      if (confirmReady) {
        setProgress(() => 500);
      } else {
        const interval = setInterval(() => {
          setProgress((prevProgress) => prevProgress + randomSeed());
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [confirmReady]);

    return (
      <div>
        <Progress
          size="lg"
          hasStripe
          value={progress}
          max={500}
          colorScheme="green"
        />
        <Text>{countdown.message}</Text>
      </div>
    );
  };

  if (togglePlansModal) {
    return (
      <PlansModal
        togglePlansModal={togglePlansModal}
        setTogglePlansModal={setTogglePlansModal}
        message={plansModalMessage} // Pass the message to the modal
        subMessage={plansModalSubMessage}
      />
    );
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DragAndDrop
              accept={accept}
              file={file}
              progress={progress}
              countdown={countdown}
              setProgress={setProgress}
              onFileUpload={(file: File) => {
                // Check if the file size exceeds the limit
                if (!file || file.size > fileSizeLimitBytes) {
                  // Set the modal state and messages
                  setPlansModalMessage(
                    !hasActiveSubscription
                      ? `Let's get you on a plan so you can upload larger files!`
                      : `Oops! Your file is too big. Your current plan allows for files up to ${fileSizeLimitMB} MB.`
                  );
                  setPlansModalSubMessage(
                    !hasActiveSubscription
                      ? `You're currently limited to files under ${fileSizeLimitMB} MB.`
                      : 'Consider upgrading to upload larger files.'
                  );
                  setTogglePlansModal(true);
                } else {
                  setFile(file);
                }
              }}
            />
          </ModalBody>
          <Box my={2} mx={5}>
            {countdown.active && (
              <CountdownProgressBar
                confirmReady={confirmReady}
                countdown={countdown}
              />
            )}
          </Box>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              isDisabled={!hasFile}
              colorScheme="blue"
              mr={3}
              onClick={() => onUpload(file as File)}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
};

export default UploadModal;
