import CustomToast from '../components/CustomComponents/CustomToast';
import { storage } from '../firebase';
import {
  MAX_FILE_UPLOAD_LIMIT,
  MAX_FILE_NAME_LENGTH
} from '../helpers/constants';
import { snip, uploadFile } from '../helpers/file.helpers';
import { processDocument } from '../services/AI';
import ApiService from '../services/ApiService';
import userStore from '../state/userStore';
import AutocompleteDropdown from './AutocompleteDropdown';
import CustomButton from './CustomComponents/CustomButton';
import CustomModal from './CustomComponents/CustomModal/index';
import { UploadIcon } from './icons';
import { AttachmentIcon } from '@chakra-ui/icons';
import {
  useToast,
  Center,
  Box,
  Text,
  Select as ChakraSelect,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import {
  CircularProgress as CircularProgressBar,
  CircularProgressLabel,
  Progress
} from '@chakra-ui/react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState, useEffect, RefObject } from 'react';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PlansModal from './PlansModal';
import documentStore from '../state/documentStore';

import { useCustomToast } from './CustomComponents/CustomToast/useCustomToast';

import { encodeQueryParams, languages } from '../helpers';

const DocumentListWrapper = styled.div`
  max-height: 200px;
  background-color: 'green';
`;

// const Text = styled.p`
//   font-size: 0.8rem;
//   text-align: left;
//   line-height: 1.5;
//   color: var(--gray-600);
// `;
interface ShowProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setShowHelp?: (showHelp: boolean) => void;
  chatButton?: boolean;
  okayButton?: boolean;
  cancelButton?: boolean;
  studyPlanId?: string;
  topicId?: string;
}

interface UiMessage {
  status: 'error' | 'success' | 'info' | 'warning' | 'loading' | undefined;
  heading: string;
  description: string;
}

const SelectedModal = ({
  show,
  setShow,
  setShowHelp,
  chatButton = true,
  cancelButton = true,
  okayButton,
  studyPlanId,
  topicId
}: ShowProps) => {
  const {
    user,
    fetchUserDocuments,
    hasActiveSubscription,
    fileSizeLimitMB,
    fileSizeLimitBytes
  } = userStore();
  const [preferredLanguage, setPreferredLanguage] = useState<
    (typeof languages)[number]
  >(languages[0]);
  const { fetchStudentDocuments, studentDocuments: userDocuments } =
    documentStore();
  const navigate = useNavigate();
  const toast = useCustomToast();
  const [fileName, setFileName] = useState('');
  const [countdown, setCountdown] = useState({
    active: false,
    message: ''
  });
  const [progress, setProgress] = useState(0);
  const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [canUpload, setCanUpload] = useState(true);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [confirmReady, setConfirmReady] = useState(false);
  const [loadedStudentDocs, setLoadedStudentDocs] = useState(false);
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;
  const [studentDocuments, setStudentDocuments] = useState<Array<any>>([]);
  const [documentURL, setDocumentURL] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [docKeywords, setDocKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
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

  const Label = styled.label`
    display: block;
    font-size: 0.875rem;
    font-weight: medium;
    color: var(--gray-500);
  `;

  const Select = styled.select`
    margin-top: 0.5rem;
    display: block;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #e4e5e7;
    padding: 0.5rem 0.75rem;
    color: #e4e5e7;
    background-color: #ffffff;
    outline: none;
    cursor: pointer;

    &:valid {
      color: #000;
      background-color: #c9fcff;
    }
  `;

  const OrText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    font-weight: medium;
    color: var(--gray-400);
  `;

  const FileUploadButton = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.375rem;
    background-color: ${canUpload ? '#fff' : '#e4e5e7'};
    border: 1px solid var(--primaryBlue);
    padding: 0.375rem 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: medium;
    color: var(--text-color);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background-color 0.03s;
    height: 40px;

    &:hover {
      background-color: ${(!fileName || canUpload) && '#f0fff3'};
    }
  `;

  const FileUploadIcon = styled(UploadIcon)`
    width: 1.25rem;
    height: 1.25rem;
    color: #e4e5e7;
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

  const Format = styled.span`
    font-weight: bold;
    color: var(--secondaryGray);
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

  useEffect(() => {
    setLoadedStudentDocs(true);
    setStudentDocuments(userDocuments);
  }, [userDocuments]);
  useEffect(() => {
    fetchStudentDocuments();
  }, []);

  const clickInput = () => {
    if (canUpload) inputRef?.current && inputRef.current.click();
  };

  const handleClose = () => {
    setShow(false);
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
          documentId: ingestId,
          keywords
        } = results.data[0];
        setConfirmReady(true);
        setCountdown((prev) => ({
          ...prev,
          message:
            "Your uploaded document is now ready! Click the 'chat' button to start."
        }));
        setDocumentId(ingestId);
        setDocumentName(title);
        setDocumentURL(newDocumentURL);
        setDocKeywords(keywords);
        setLoading(false);

        const response = await ApiService.saveStudentDocument({
          documentUrl: newDocumentURL,
          title,
          ingestId: ingestId
        });

        if (response.status === 200) {
          const docDetails = await response.json();
          if (studyPlanId && topicId) {
            storeStudyPlanTopicDoc(studyPlanId, topicId, docDetails.data.id);
          }
        }
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

  function handleFileSizeExceed() {
    const modalMessage = !hasActiveSubscription
      ? `Let's get you on a plan so you can upload larger files!`
      : `Oops! Your file is too big. Your current plan allows for files up to ${fileSizeLimitMB} MB.`;
    const modalSubMessage = !hasActiveSubscription
      ? `You're currently limited to files under ${fileSizeLimitMB} MB.`
      : 'Consider upgrading to upload larger files.';

    setPlansModalMessage(modalMessage);
    setPlansModalSubMessage(modalSubMessage);
    setTogglePlansModal(true);
  }

  const collectFileInput = async (event) => {
    const inputFile = event.target.files[0];

    // Early return if no file is selected
    if (!inputFile) {
      console.error('No file selected.');
      return;
    }

    setProgress(0);
    setConfirmReady(false);
    setAlreadyExist(false); // Default assumption

    const fileChecked = doesTitleExist(inputFile.name);
    if (fileChecked) {
      setAlreadyExist(true);
      return; // Stop further processing if file already exists
    }
    // Check file size limit
    if (inputFile.size > fileSizeLimitBytes) {
      handleFileSizeExceed();
      return;
    }

    // Proceed with file processing
    setLoading(true);
    try {
      const fileNameSnippet = snip(inputFile.name);
      setFileName(fileNameSnippet);
      await handleInputFreshUpload(inputFile, user, inputFile.name);
    } catch (error) {
      console.error('Error handling file upload:', error);
      // Optionally, update the UI or state to reflect the error
    } finally {
      setLoading(false); // Ensure loading is false after operation completes or fails
    }
  };

  // Function to handle actions when file size exceeds limi

  const handleSelected = async (e) => {
    setAlreadyExist(false);
    setUploadFailed(false);

    const docId = studentDocuments.find((item) => item.ingestId === e.id)?._id;

    if (e.value && e.label && e.id) {
      if (studyPlanId && topicId) {
        storeStudyPlanTopicDoc(studyPlanId, topicId, docId);
      }

      setDocumentURL(() => e.value);
      setDocumentName(() => e.label);
      setDocumentId(() => e.id);
      setDocKeywords(() => e.keywords);
      setSelectedOption(e.label);
      setCanUpload(false);
      setConfirmReady(true);
    }
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
      sid: user._id,
      language: preferredLanguage
    });
    navigate(`/dashboard/docchat${query}`);
    if (setShowHelp) {
      setShowHelp(false);
    }

    setShow(false);

    user && fetchStudentDocuments();
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
      setShow(false);
      setShowHelp(false);
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

  const storeStudyPlanTopicDoc = async (studyPlanId, topicId, documentId) => {
    try {
      const payload = {
        studyPlanId: studyPlanId,
        topicId: topicId,
        documentId: documentId
      };
      await ApiService.storeStudyPlanTopicDocument(payload);
      toast({
        title: 'Document stored successfully',
        position: 'top-right',
        status: 'success',
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Failed to store document. Please try again later.',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });

      // console.error('Error storing document:', error);
    }
  };

  const [isDragOver, setIsDragOver] = useState(false);

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

    const fileChecked = doesTitleExist(files?.name);

    if (fileChecked) {
      setAlreadyExist(true);
    } else {
      setAlreadyExist(false);
      setLoading(true);
      try {
        setFileName(snip(files.name));
        await handleInputFreshUpload(files, user, files.name);
      } catch (error) {
        // Handle errors
      }
    }
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
            {cancelButton && (
              <CustomButton
                type="button"
                isCancel
                onClick={handleClose}
                title="Cancel"
              />
            )}
            <ChatButton />
            {okayButton && (
              <CustomButton type="button" onClick={handleClose} title="Ok" />
            )}
          </div>
        }
      >
        <Wrapper>
          <div className="p-4" style={{ width: '100%' }}>
            <div style={{ width: '-webkit-fill-available' }}>
              <Text>
                To proceed, please upload a document or select from the existing
                list
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
                onDragOver={(e) => handleDragEnter(e)}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
                // onClick={clickInput}
              >
                <label htmlFor="file-upload">
                  <Center flexDirection="column">
                    {fileName ? (
                      <Flex>
                        <AttachmentIcon /> <FileName>{fileName}</FileName>
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
                            DOC, TXT, or PDF (MAX: {fileSizeLimitMB}MB)
                          </Text>
                        </PDFTextContainer>
                      </Flex>
                    )}
                  </Center>
                </label>
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
              {studentDocuments && <Center my={3}>Or</Center>}
              {studentDocuments && (
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
            <FormControl my={4}>
              <FormLabel textColor={'text.600'}>Preferred Language</FormLabel>
              <ChakraSelect
                isRequired
                name="language_select"
                value={preferredLanguage}
                onChange={(e) => {
                  setPreferredLanguage(
                    e.target.value as (typeof languages)[number]
                  );
                }}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>

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
                  The document you're trying to upload already exists. Please
                  choose a different document or consider renaming it to avoid
                  duplicates.
                </p>
              </ErrorDiv>
            )}
            {uploadFailed && (
              <ErrorDiv className="py-1">
                <p>Upload Failed!</p>
                <p>Something went wrong. Please attempt the upload again.</p>
              </ErrorDiv>
            )}
          </div>
        </Wrapper>
      </CustomModal>
    );
  }
};

export default SelectedModal;
