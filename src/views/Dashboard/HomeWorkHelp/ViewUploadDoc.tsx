import React, { RefObject, useRef, useState, useEffect } from 'react';
import {
  MAX_FILE_NAME_LENGTH,
  MAX_FILE_UPLOAD_LIMIT
} from '../../../helpers/constants';
import userStore from '../../../state/userStore';
import { uploadBytesResumable, ref, getDownloadURL } from '@firebase/storage';
import { storage } from '../../../firebase';
import {
  Box,
  Center,
  Flex,
  Progress,
  Select,
  Text,
  useToast
} from '@chakra-ui/react';
import { processDocument } from '../../../services/AI';
import ApiService from '../../../services/ApiService';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import { AttachmentIcon } from '@chakra-ui/icons';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import styled from 'styled-components';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import { useNavigate } from 'react-router-dom';
import uploadFile, { snip } from '../../../helpers/file.helpers';
import { encodeQueryParams, languages } from '../../../helpers';

interface UiMessage {
  status: 'error' | 'success' | 'info' | 'warning' | 'loading' | undefined;
  heading: string;
  description: string;
}

const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #585f68;
`;

const PDFTextContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ErrorDiv = styled.div`
  height: auto;
  border-radius: 8px;
  background: red;
  width: auto;
  color: white;
  text-align: center;
  line-height: 40px;
  padding: 10px; /* Add some padding to the div */

  /* Style the header */
  p:first-child {
    font-size: 0.875rem;
    font-weight: bold;
  }

  /* Style the message */
  p:last-child {
    font-size: 0.75rem;
    line-height: 2;
  }
`;

interface ShowProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setShowHelp?: (showHelp: boolean) => void;
  chatButton?: boolean;
  okayButton?: boolean;
  cancelButton?: boolean;
  handleClose?: any;
}

const ViewUploadDoc = ({
  show,
  setShow,
  setShowHelp,
  cancelButton = true,
  handleClose
}: ShowProps) => {
  const [countdown, setCountdown] = useState({
    active: false,
    message: ''
  });
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [confirmReady, setConfirmReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentURL, setDocumentURL] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;
  const { user } = userStore();
  const [documentId, setDocumentId] = useState('');
  const [canUpload, setCanUpload] = useState(true);
  const toast = useToast();

  const [alreadyExist, setAlreadyExist] = useState(false);
  const [chatButton] = useState(true);
  const navigate = useNavigate();
  const [docKeywords, setDocKeywords] = useState([]);

  const handleInputFreshUpload = async (file, user, fileName) => {
    setProgress(0);
    setCountdown(() => ({
      active: false,
      message: ''
    }));
    let readableFileName = fileName
      .toLowerCase()
      .replace(/\.pdf$/, '')
      .replace(/_/g, ' ');

    if (readableFileName.length > MAX_FILE_NAME_LENGTH) {
      readableFileName = readableFileName.substring(0, MAX_FILE_NAME_LENGTH);
      setCountdown((prev) => ({
        active: true,
        message: `The file name has been truncated to ${MAX_FILE_NAME_LENGTH} characters`
      }));
      setProgress(5);
    }
    if (!user?._id || !readableFileName) {
      return toast({
        render: () => (
          <CustomToast
            title="We couldn't retrieve your user details to start the upload process."
            status="error"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
    const SIZE_IN_MB = parseInt((file?.size / 1_000_000).toFixed(2), 10);
    if (SIZE_IN_MB > MAX_FILE_UPLOAD_LIMIT) {
      setUiMessage({
        status: 'error',
        heading: 'Your file is too large',
        description: `Your file is ${SIZE_IN_MB}MB, above our ${MAX_FILE_UPLOAD_LIMIT}MB limit. Please upload a smaller document.`
      });
      return;
    }

    setCountdown(() => ({
      active: true,
      message: 'Uploading...your document is being uploaded'
    }));
    setProgress(25);
    const uploadEmitter = uploadFile(file, {
      studentID: user._id, // Assuming user._id is always defined
      documentID: readableFileName // Assuming readableFileName is the file's name
    });

    uploadEmitter.on('progress', (progress: number) => {
      // Update the progress. Assuming progress is a percentage (0 to 100)
      setProgress(progress);
      setLoading(true);
    });

    uploadEmitter.on('complete', async (uploadFile) => {
      // Assuming uploadFile contains the fileUrl and other necessary details.
      const documentURL = uploadFile.fileUrl;

      setCountdown((prev) => ({
        ...prev,
        message:
          'Processing...this may take a minute (larger documents may take longer)'
      }));

      try {
        const results = await processDocument({
          studentId: user._id,
          documentId: readableFileName,
          documentURL,
          title: readableFileName
        });

        const {
          documentURL: newDocumentURL,
          title,
          documentId,
          keywords
        } = results.data[0];
        setConfirmReady(true);
        setCountdown((prev) => ({
          ...prev,
          message:
            "Your uploaded document is now ready! Click the 'chat' button to start."
        }));
        setDocumentId(documentId);
        setDocumentName(title);
        setDocumentURL(newDocumentURL);
        setDocKeywords(keywords);
        setLoading(false);

        ApiService.saveStudentDocument({
          documentUrl: newDocumentURL,
          title,
          ingestId: documentId
        });
      } catch (e) {
        setCountdown((prev) => ({
          ...prev,
          message: 'Something went wrong. Reload this page and try again.'
        }));
        setLoading(false);
      }
    });

    uploadEmitter.on('error', (error) => {
      setCountdown((prev) => ({
        ...prev,
        active: false,
        message: 'Something went wrong. Please attempt the upload again.'
      }));
      setUploadFailed(true);
    });
  };

  const collectFileInput = async (e) => {
    const inputFile = e.target.files[0];
    // const fileChecked = doesTitleExist(inputFile?.name);
    setProgress(0);
    setConfirmReady(false);

    try {
      setFileName(snip(inputFile.name));
      await handleInputFreshUpload(inputFile, user, inputFile.name);
    } catch (error) {
      // Handle errors
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files[0];
    // Handle dropped files here

    try {
      setFileName(snip(files.name));
      await handleInputFreshUpload(files, user, files.name);
    } catch (error) {
      // Handle errors
    }
  };

  const clickInput = () => {
    if (canUpload) inputRef?.current && inputRef.current.click();
  };
  const goToDocChat = async (
    documentUrl,
    docTitle,
    documentId,
    docKeywords
  ) => {
    const query = encodeQueryParams({
      documentUrl,
      docTitle,
      documentId,
      docKeywords,
      sid: user._id
    });
    navigate(`/dashboard/docchat${query}`);

    handleClose();
  };

  const doNothing = () => {
    return;
  };

  const proceed = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await goToDocChat(documentURL, documentName, documentId, docKeywords);
    } catch (error) {
      // Handle error
    } finally {
      //   setShow(false);
      //   setShowHelp(false);
    }
  };

  const ChatButton = () => {
    if (!chatButton) {
      return <></>;
    }
    return (
      <CustomButton
        type="button"
        active={confirmReady}
        onClick={confirmReady ? proceed : doNothing}
        title={loading ? 'Loading' : 'Chat'}
      />
    );
  };

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

  return (
    <section
      style={{
        margin: '0 auto',
        width: '100%',
        padding: '25px 38px 0'
      }}
    >
      <Center
        w="full"
        minH="65px"
        mt={3}
        p={2}
        border="2px"
        borderColor={isDragOver ? 'gray.600' : 'gray.300'}
        borderStyle="dashed"
        rounded="lg"
        cursor="pointer"
        bg={isDragOver ? 'gray.600' : 'gray.50'}
        color={isDragOver ? 'white' : 'inherit'}
        onDragOver={(e) => handleDragEnter(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onDrop={(e) => handleDrop(e)}
        onClick={clickInput}
      >
        <Box>
          {fileName ? (
            <Flex>
              <AttachmentIcon /> <FileName>{fileName}</FileName>
            </Flex>
          ) : (
            <Box>
              <Center>
                <RiUploadCloud2Fill className="h-8 w-8" color="gray.500" />
              </Center>

              <Text
                mb="2"
                fontSize="sm"
                color={isDragOver ? 'white' : 'gray.500'}
                fontWeight="semibold"
              >
                Click to upload or drag and drop
              </Text>
              <PDFTextContainer>
                <Text fontSize="xs" color={isDragOver ? 'white' : 'gray.500'}>
                  DOC, TXT, or PDF (MAX. 500mb)
                </Text>
              </PDFTextContainer>
            </Box>
          )}
        </Box>

        <input
          type="file"
          accept=".doc, .txt, .pdf"
          // accept="application/pdf"
          className="hidden"
          id="file-upload"
          ref={inputRef}
          onChange={collectFileInput}
        />
      </Center>
      <Box my={2}>
        {countdown.active && (
          <CountdownProgressBar
            confirmReady={confirmReady}
            countdown={countdown}
          />
        )}
      </Box>

      {alreadyExist && (
        <ErrorDiv className="py-1">
          <p>File Already Exists!</p>
          <p>
            The document you're trying to upload already exists. Please choose a
            different document or consider renaming it to avoid duplicates.
          </p>
        </ErrorDiv>
      )}
      {uploadFailed && (
        <ErrorDiv className="py-1">
          <p>Upload Failed!</p>
          <p>Something went wrong. Please attempt the upload again.</p>
        </ErrorDiv>
      )}

      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
          marginTop: '35px'
        }}
      >
        {cancelButton && (
          <CustomButton
            type="button"
            isCancel
            onClick={handleClose}
            title="Cancel"
          />
        )}
        <ChatButton />
        {/* {okayButton && (
          <CustomButton type="button" onClick={handleClose} title="Ok" />
        )} */}
      </div>
    </section>
  );
};

export default ViewUploadDoc;
