import CustomToast from '../../../../components/CustomComponents/CustomToast';
import { storage } from '../../../../firebase';
import {
  MAX_FILE_UPLOAD_LIMIT,
  MAX_FILE_NAME_LENGTH
} from '../../../../helpers/constants';
import { snip, uploadFile } from '../../../../helpers/file.helpers';
import { processDocument } from '../../../../services/AI';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import AutocompleteDropdown from '../../../../components/AutocompleteDropdown';
import CustomButton from '../../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../../components/CustomComponents/CustomModal/index';
import { UploadIcon } from '../../../../components/icons';
import { AttachmentIcon } from '@chakra-ui/icons';
import {
  useToast,
  Center,
  Box,
  Text,
  CircularProgress,
  Flex,
  HStack,
  Icon
} from '@chakra-ui/react';
import {
  CircularProgress as CircularProgressBar,
  CircularProgressLabel,
  Progress
} from '@chakra-ui/react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import React, {
  useRef,
  useState,
  useEffect,
  RefObject,
  useCallback
} from 'react';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PlansModal from '../../../../components/PlansModal';
import documentStore from '../../../../state/documentStore';
import ShepherdSpinner from '../../components/shepherd-spinner';
import {
  isEmpty,
  isNil,
  last,
  replace,
  split,
  toLower,
  trim,
  truncate
} from 'lodash';
import { FaUpload } from 'react-icons/fa';
import { useToggle } from 'usehooks-ts';
import { StudentDocument } from '../../../../types';
import { is } from 'date-fns/locale';

const DocumentListWrapper = styled.div`
  max-height: 200px;
  background-color: 'green';
`;

interface ShowProps {
  show?: boolean;
  acceptString?: string;
  setShow?: (show: boolean) => void;
  setShowHelp?: (showHelp: boolean) => void;
  okayButton?: boolean;
  cancelButton?: boolean;
  FootCustomButton?: React.ReactNode;
  onFileSelect?: (file: File) => void;
  onDocumentSelect?: (
    document: StudentDocument & {
      studentID: string;
      documentID: string;
      fileUrl: string;
    }
  ) => void;
  accept?: DropzoneOptions['accept'];
  showUploadTrigger?: boolean;
  isLoading?: boolean;
  continueButton?: boolean;
  useUploadModal?: boolean;
  onIngestedDocument?: any;
}

interface UiMessage {
  status: 'error' | 'success' | 'info' | 'warning' | 'loading' | undefined;
  heading: string;
  description: string;
}

const Wrapper = styled.div`
  display: block;
  width: 100%;
  .error-message {
    text-align: center !important;
    color: red;
  }
  .drop-down-container {
    max-height: 150px;
    max-width: 100%;
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

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

const FileUploadModal = ({
  show,
  setShow,
  cancelButton = true,
  okayButton,
  acceptString,
  FootCustomButton,
  continueButton = true,
  onFileSelect = () => null,
  accept,
  isLoading,
  useUploadModal = false,
  onDocumentSelect = () => null,
  onIngestedDocument = () => null
}: ShowProps) => {
  const { user, hasActiveSubscription, fileSizeLimitMB, fileSizeLimitBytes } =
    userStore();
  const { fetchStudentDocuments, studentDocuments: userDocuments } =
    documentStore();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({
    active: false,
    message: ''
  });
  const [progress, setProgress] = useState(0);
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [confirmReady, setConfirmReady] = useState(false);
  const [loadedStudentDocs, setLoadedStudentDocs] = useState(false);
  const [studentDocuments, setStudentDocuments] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadDocumentFile, setUploadDocumentFile] = useState(null);
  const [showSelect, setShowSelected] = useState(true);

  const [ingestedDocument, setIngestedDocument] = useState(null);

  const toast = useToast();

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
    if (isNil(user?._id) || isNil(readableFileName)) {
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

    setCountdown(() => ({
      active: true,
      message: 'Uploading... your document is being uploaded'
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

    uploadEmitter.on('complete', async (uploadedFile) => {
      // Assuming uploadFile contains the fileUrl and other necessary details.
      // const documentURL = uploadedFile.fileUrl;

      setCountdown((prev) => ({
        ...prev,
        message:
          'Processing...this may take a minute (larger documents may take longer)'
      }));

      try {
        setConfirmReady(true);
        setCountdown((prev) => ({
          ...prev,
          message:
            "Your uploaded document is now ready! Click the 'Continue' button to start."
        }));

        setLoading(false);
        setSelectedFile(file);
        setUploadDocumentFile(uploadedFile);
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

  function doesTitleExist(title: string) {
    const readableFileName = title
      .toLowerCase()
      .replace(/\.pdf$/, '')
      .replace(/_/g, ' ');

    // Check if the modified title exists in the array
    const exists = studentDocuments.some(
      (item) => item.title === readableFileName
    );

    return exists;
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];

      const fileChecked = doesTitleExist(file?.name);
      setProgress(0);
      setConfirmReady(false);

      if (fileChecked) {
        setAlreadyExist(true);
      }

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
        return;
      } else {
        setAlreadyExist(false);
        setLoading(true);
        setIngestedDocument(null);
        await handleInputFreshUpload(file, user, file.name);
      }
    } catch (error) {
      // console.log('onDrop ===========>>> error ----------->>>', error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: accept
      ? accept
      : {
          'text/plain': ['.txt'],
          'application/pdf': ['.pdf'],
          'image/jpeg': ['.jpeg', '.jpg'],
          'application/vnd.ms-powerpoint': ['.ppt']
        },
    onDragEnter: () => {
      setIsDragOver(true);
    },
    onDragLeave: () => {
      setIsDragOver(false);
    }
  });

  useEffect(() => {
    setLoadedStudentDocs(true);
    setStudentDocuments(userDocuments);
  }, [userDocuments]);

  useEffect(() => {
    fetchStudentDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleClear = () => {
    onFileSelect(null);
    onDocumentSelect(null);
    setSelectedFile(null);
    setUploadDocumentFile(null);
    onIngestedDocument(null);
    setConfirmReady(false);
    setCountdown(() => ({
      active: false,
      message: ''
    }));
    setShowSelected(false);
    setTimeout(() => {
      setShowSelected(true);
    });
    // handleClose();
  };

  const CountdownProgressBar = ({
    confirmReady,
    countdown
  }: {
    confirmReady: boolean;
    countdown: { active: boolean; message: string };
  }) => {
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
          size="sm"
          hasStripe
          value={progress}
          max={500}
          colorScheme="green"
        />
        {/* <CircularProgress
          value={progress}
          size="50px"
          thickness="4px"
          color="#207df7"
          max={500}
        /> */}
        <Text>{countdown.message}</Text>
      </div>
    );
  };

  const handleSelected = async (e) => {
    setAlreadyExist(false);
    setUploadFailed(false);

    setConfirmReady(true);

    // console.log('handleSelected ========>>> ', e);

    const pattern = '%20',
      re = new RegExp(pattern, 'g');

    setIngestedDocument({ ...e, value: toLower(replace(e.keywords, re, ' ')) });

    setSelectedFile(null);
    setUploadDocumentFile(null);
  };

  function getFileNameFromUrl(url) {
    // Use the URL constructor for parsing the URL if it's an absolute URL
    try {
      const pathname = new URL(url).pathname;
      return pathname.split('/').pop(); // Get the last part of the path
    } catch (error) {
      // If the URL is not absolute, fallback to a simple string manipulation approach
      return url.substring(url.lastIndexOf('/') + 1);
    }
  }

  // const doNothing = () => {
  //   return;
  // };

  const proceed = async () => {
    try {
      onFileSelect(selectedFile);
      onDocumentSelect(uploadDocumentFile);
      onIngestedDocument(ingestedDocument);
    } catch (error) {
      // Handle error
    } finally {
      setShow(false);
    }
  };

  const ContinueButton = () => {
    if (!continueButton) {
      return <></>;
    }
    return (
      <CustomButton
        type="button"
        active={confirmReady}
        onClick={proceed}
        title={loading ? 'Loading' : 'Continue'}
        disabled={!confirmReady}
      />
    );
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="between"
        bg="white"
        borderRadius="6px"
        border="1px solid #E4E6E7"
        _hover={{ bg: '' }}
        cursor="pointer"
        w={'100%'}
      >
        {useUploadModal ? (
          <HStack
            w={'100%'}
            alignItems={'center'}
            p={'14px 16px'}
            textColor={'text-200'}
            fontSize={'14px'}
            fontFamily={'Inter'}
            fontWeight={'500'}
            cursor={'pointer'}
            onClick={() => {
              if (show) {
                handleClose();
              } else {
                handleOpen();
              }
            }}
          >
            {isLoading ? (
              <ShepherdSpinner />
            ) : (
              <Icon color="#9A9DA2" as={FaUpload} />
            )}

            {isNil(selectedFile) && isNil(ingestedDocument) && (
              <Text>Upload doc</Text>
            )}

            {!isNil(selectedFile) && (
              <Box>
                {isNil(selectedFile) ? (
                  <Text>Upload doc</Text>
                ) : (
                  <Text>
                    {truncate(selectedFile?.name, {
                      length: 25
                    })}{' '}
                    - .{last(split(selectedFile?.name, '.'))}
                  </Text>
                )}
              </Box>
            )}

            {!isNil(ingestedDocument) && (
              <Box>
                {isNil(ingestedDocument) ? (
                  <Text>Upload doc</Text>
                ) : (
                  <Text>
                    {truncate(ingestedDocument?.value, {
                      length: 45
                    })}
                  </Text>
                )}
              </Box>
            )}
          </HStack>
        ) : (
          <HStack
            w={'100%'}
            alignItems={'center'}
            p={'14px 16px'}
            textColor={'text-200'}
            fontSize={'14px'}
            fontFamily={'Inter'}
            fontWeight={'500'}
            cursor={'pointer'}
            {...getRootProps()}
          >
            {isLoading ? (
              <ShepherdSpinner />
            ) : (
              <Icon color="#9A9DA2" as={FaUpload} />
            )}
            {!isNil(selectedFile) && (
              <Box>
                {isNil(selectedFile) ? (
                  <Text>Upload doc</Text>
                ) : (
                  <Text>
                    {truncate(selectedFile?.name, {
                      length: 25
                    })}{' '}
                    - .{last(split(selectedFile?.name, '.'))}
                  </Text>
                )}
              </Box>
            )}

            {!isNil(ingestedDocument) && (
              <Box>
                {isNil(ingestedDocument) ? (
                  <Text>Upload doc</Text>
                ) : (
                  <Text>
                    {truncate(ingestedDocument?.value, {
                      length: 25
                    })}{' '}
                  </Text>
                )}
              </Box>
            )}
          </HStack>
        )}
      </Box>

      <input id="upload" name="upload" type="file" {...getInputProps()} />
      {useUploadModal && (
        <CustomModal
          isOpen={show}
          onClose={handleClose}
          modalTitle="Upload or Select a Document"
          style={{
            maxWidth: '400px',
            height: 'auto'
          }}
          modalTitleStyle={{
            textAlign: 'center',
            borderBottom: '1px solid #EEEFF2'
          }}
          footerContent={
            <div style={{ display: 'flex', gap: '8px' }}>
              {(!isNil(ingestedDocument) || !isNil(selectedFile)) && (
                <CustomButton
                  isDelete
                  type="button"
                  onClick={handleClear}
                  title="Clear"
                />
              )}
              {cancelButton && (
                <CustomButton
                  type="button"
                  isCancel
                  onClick={handleClose}
                  title="Cancel"
                />
              )}
              <ContinueButton />
              {okayButton && (
                <CustomButton type="button" onClick={handleClose} title="Ok" />
              )}
              {FootCustomButton}
            </div>
          }
        >
          <Wrapper>
            <div className="p-4" style={{ width: '100%' }}>
              <div style={{ width: '-webkit-fill-available' }}>
                <Text>
                  To proceed, please upload a document or select from the
                  existing list
                </Text>
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
                >
                  <Center flexDirection="column" {...getRootProps()}>
                    {!isNil(selectedFile) ? (
                      <Flex>
                        <AttachmentIcon />{' '}
                        <FileName>
                          {truncate(selectedFile?.name, {
                            length: 25
                          })}{' '}
                          - .{last(split(selectedFile?.name, '.'))}
                        </FileName>
                      </Flex>
                    ) : (
                      <Flex direction={'column'} alignItems={'center'}>
                        <RiUploadCloud2Fill
                          className="h-8 w-8"
                          color="gray.500"
                        />
                        <Text
                          mb="2"
                          fontSize="sm"
                          color={isDragOver ? 'white' : 'gray.500'}
                          fontWeight="semibold"
                        >
                          Click to upload or drag and drop
                        </Text>
                        <PDFTextContainer>
                          <Text
                            fontSize="xs"
                            color={isDragOver ? 'white' : 'gray.500'}
                          >
                            {acceptString ? acceptString : 'DOC, TXT, or PDF'}{' '}
                            (MAX: {fileSizeLimitMB}MB)
                          </Text>
                        </PDFTextContainer>
                      </Flex>
                    )}
                  </Center>
                </Center>

                {studentDocuments && <Center my={3}>Or</Center>}
                {studentDocuments && showSelect && (
                  <DocumentListWrapper>
                    <AutocompleteDropdown
                      studentDocuments={studentDocuments}
                      placeholder="Select a Document"
                      selectedOption={selectedOption}
                      handleSelected={handleSelected}
                    ></AutocompleteDropdown>
                  </DocumentListWrapper>
                )}
              </div>
              {/* countdown.active */}
              <Box my={2}>
                {countdown.active && (
                  <CountdownProgressBar
                    confirmReady={confirmReady}
                    countdown={countdown}
                  />
                )}
              </Box>
              {/* alreadyExist */}
              {alreadyExist && (
                <ErrorDiv className="py-1 my-1">
                  <p>File Already Exists!</p>
                  <p>
                    The document you're trying to upload already exists. Please
                    choose a different document or consider renaming it to avoid
                    duplicates.
                  </p>
                </ErrorDiv>
              )}

              {/* uploadFailed */}
              {uploadFailed && (
                <ErrorDiv className="py-1 my-1">
                  <p>Upload Failed!</p>
                  <p>Something went wrong. Please attempt the upload again.</p>
                </ErrorDiv>
              )}
            </div>
          </Wrapper>
        </CustomModal>
      )}

      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
          message={plansModalMessage} // Pass the message to the modal
          subMessage={plansModalSubMessage}
        />
      )}
    </>
  );
};

export default FileUploadModal;
