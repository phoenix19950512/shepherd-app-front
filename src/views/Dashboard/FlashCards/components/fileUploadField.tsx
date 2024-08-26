import { Box, Icon, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import userStore from '../../../../state/userStore';
import PlansModal from '../../../../components/PlansModal';
import ShepherdSpinner from '../../components/shepherd-spinner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isLoading,
  accept
}) => {
  const defaultAccept = '*/*';
  const { hasActiveSubscription, fileSizeLimitMB, fileSizeLimitBytes } =
    userStore();

  const inputFile = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const onUploadClick = () => {
    inputFile.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      // Check if the file size exceeds the limit
      if (file.size > fileSizeLimitBytes) {
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
        // Reset input file value to retrigger plans modal (handles failed re-upload edgecase)
        event.target.value = '';
      } else {
        onFileSelect(file);
        setFileName(file.name);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="between"
      bg="white"
      borderRadius="6px"
      border="1px solid #E4E6E7"
      py={'10px'}
      px={'20px'}
      onClick={onUploadClick}
      _hover={{ bg: '' }}
      cursor="pointer"
    >
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={onFileChange}
        accept={accept ? accept : defaultAccept}
      />

      <Box
        boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
        justifyContent={'center'}
        alignItems={'center'}
        display={'flex'}
      >
        {isLoading ? (
          <ShepherdSpinner />
        ) : (
          <Icon color="#9A9DA2" as={FaUpload} />
        )}
        <Text ml="10px" color="#9A9DA2" fontSize={'14px'}>
          {fileName || 'Upload a file'}
        </Text>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          border={4}
          borderColor="#9A9DA2"
          borderRadius="full"
          position="absolute"
          inset={0}
        />
      </Box>
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
          message={plansModalMessage} // Pass the message to the modal
          subMessage={plansModalSubMessage}
        />
      )}
    </Box>
  );
};

export default FileUpload;
