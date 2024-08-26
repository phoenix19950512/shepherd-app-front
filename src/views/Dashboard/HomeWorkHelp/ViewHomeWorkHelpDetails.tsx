import CustomButton from '../../../components/CustomComponents/CustomButton/index';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import SelectComponent, { Option } from '../../../components/Select';
import { uid } from '../../../helpers';
import resourceStore from '../../../state/resourceStore';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
  extendTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Center,
  Text,
  useToast,
  Flex,
  Progress
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  useCallback,
  useState,
  useMemo,
  useEffect,
  RefObject,
  useRef
} from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import styled from 'styled-components';
import uploadFile, { snip } from '../../../helpers/file.helpers';
import {
  MAX_FILE_NAME_LENGTH,
  MAX_FILE_UPLOAD_LIMIT
} from '../../../helpers/constants';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { processDocument } from '../../../services/AI';
import ApiService from '../../../services/ApiService';
import { AttachmentIcon } from '@chakra-ui/icons';
import userStore from '../../../state/userStore';

const PDFTextContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #585f68;
`;
interface FlashcardData {
  level?: string;
  topic: string;
  subject?: string;
}
interface UiMessage {
  status: 'error' | 'success' | 'info' | 'warning' | 'loading' | undefined;
  heading: string;
  description: string;
}
const ViewHomeWorkHelpDetails = ({
  openAceHomework,
  handleAceHomeWorkHelp,
  setSubject,
  subjectId,
  setLocalData,
  setLevel,
  localData,
  level,
  onRouteHomeWorkHelp,
  setDocumentId,
  documentId
}: {
  openAceHomework: boolean;
  handleClose: () => void;
  handleAceHomeWorkHelp: () => void;
  isHomeWorkHelp?: boolean;
  setMessages?: any;
  setSubject?: any;
  subjectId?: any;
  setLocalData?: any;
  setLevel?: any;
  localData?: any;
  level?: any;
  onRouteHomeWorkHelp?: any;
  setDocumentId?: any;
  documentId?: string;
}) => {
  const { courses: courseListRaw, levels: levelOptions } = resourceStore();
  const [searchValue, setSearchValue] = useState('');
  const [isShowInput, setShowInput] = useState('');
  const courseList = [...courseListRaw];
  const searchQuery = useCallback((searchValue: string, courseList: any[]) => {
    return courseList.filter((course) =>
      course.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, []);
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const filteredOptions = searchQuery(searchValue, courseList);
  const [countdown, setCountdown] = useState({
    active: false,
    message: ''
  });
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const toast = useToast();
  const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [confirmReady, setConfirmReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentURL, setDocumentURL] = useState('');
  const [documentName, setDocumentName] = useState('');
  // const [documentId, setDocumentId] = useState('');
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;
  const { user } = userStore();
  const [canUpload, setCanUpload] = useState(true);

  const handleOnChange = (newValue) => {
    setSelectedOption(newValue);

    setLocalData((prevState: any) => ({
      ...prevState,
      subject: newValue?.label,
      subjectId: newValue?._id
    }));
  };

  const handleOnCreateOption = (inputValue) => {
    // Create a new option
    const newOption = {
      value: inputValue,
      label: inputValue
    };

    // Set the new option as the selected value
    setSelectedOption(newOption as any);

    setLocalData((prevState: any) => ({
      ...prevState,
      subject: newOption.value
    }));
  };

  const navigate = useNavigate();

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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocalData((prevState: any) => ({
        ...prevState,
        [name]: value
      }));
    },
    [setLocalData]
  );

  const isDisabledBtn = useMemo(() => {
    const hasEmptyValue = Object.values(localData).some(
      (value) => value === ''
    );
    return hasEmptyValue;
  }, [localData, confirmReady]);

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      // Adjust the height as needed
      maxHeight: '150px' // Example height
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '150px'
    })
    // Add other style customizations if needed
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
    // const customFirestorePath = `${user._id}/${readableFileName}`;
    // const storageRef = ref(storage, customFirestorePath);

    // const task = uploadBytesResumable(storageRef, file);

    // task.on(
    //   'state_changed',
    //   (snapshot) => {
    //     const progress = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 10
    //     );
    //     switch (snapshot.state) {
    //       case 'running':
    //         setProgress(progress);
    //         break;
    //     }
    //   },
    //   (error) => {
    //     setCountdown((prev) => ({
    //       active: false,
    //       message: 'Something went wrong. Please attempt the upload again.'
    //     }));
    //     setUploadFailed(true);
    //   },
    //   async () => {
    //     const documentURL = await getDownloadURL(task.snapshot.ref);
    //     setCountdown((prev) => ({
    //       ...prev,
    //       message:
    //         'Processing...this may take a minute (larger documents may take longer)'
    //     }));

    //     await processDocument({
    //       studentId: user._id,
    //       documentId: readableFileName,
    //       documentURL,
    //       title: readableFileName
    //     })
    //       .then((results) => {
    //         const { documentURL, title, documentId, keywords } =
    //           results.data[0];
    //         setConfirmReady(true);
    //         setCountdown((prev) => ({
    //           ...prev,
    //           active: false,
    //           message:
    //             "Your uploaded document is now ready! Click the 'confirm' button to start."
    //         }));
    //         setDocumentId(() => documentId);
    //         setDocumentName(() => title);
    //         setDocumentURL(() => documentURL);
    //         // setDocKeywords(() => keywords);
    //         setLoading(false);

    //         ApiService.saveStudentDocument({
    //           documentUrl: documentURL,
    //           title,
    //           ingestId: documentId
    //         });
    //       })
    //       .catch(async (e: any) => {
    //         setCountdown((prev) => ({
    //           ...prev,
    //           message: 'Something went wrong. Reload this page and try again.'
    //         }));
    //       });

    //     setConfirmReady(true);
    //   }
    // );
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
        // setDocKeywords(keywords);
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
    <CustomModal
      isOpen={openAceHomework}
      modalTitle="Provide more details"
      isModalCloseButton
      style={{
        maxWidth: '400px',
        height: 'auto'
      }}
      footerContent={
        <div style={{ display: 'flex', gap: '8px' }}>
          <CustomButton
            type="button"
            isCancel
            onClick={handleAceHomeWorkHelp}
            title="Cancel"
          />
          <CustomButton
            type="button"
            onClick={onRouteHomeWorkHelp}
            active={confirmReady || !isDisabledBtn}
            title={loading ? 'Loading' : 'Chat'}
            disabled={isDisabledBtn}
          />
        </div>
      }
      onClose={handleAceHomeWorkHelp}
    >
      <Box bg="white" width="100%" mt="30px" padding="0 28px">
        <FormControl mb={6}>
          <FormLabel
            fontSize="0.75rem"
            lineHeight="17px"
            color="#5C5F64"
            mb={3}
          >
            Subject
          </FormLabel>
          {/* <CreatableSelect
            isClearable
            onChange={handleOnChange}
            onCreateOption={handleOnCreateOption}
            options={courseList}
            value={selectedOption}
            // styles={{
            //   control: (base) => ({
            //     ...base,
            //     fontSize: '0.875rem'
            //   })
            // }}
            classNames={{ control: () => 'text-[0.875rem]' }}
            placeholder="Search or select an option..."
          /> */}
          <CreatableSelect
            isClearable
            onChange={handleOnChange}
            onCreateOption={handleOnCreateOption}
            options={courseList}
            value={selectedOption}
            placeholder="Search or select an option..."
            styles={customStyles}
          />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel
            fontSize="0.75rem"
            lineHeight="17px"
            color="#5C5F64"
            mb={3}
          >
            Topic
          </FormLabel>
          <Input
            type="text"
            name="topic"
            placeholder="e.g genetics"
            value={localData.topic}
            onChange={handleChange}
            _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
            style={{ fontSize: '0.875rem' }}
          />
        </FormControl>
        {/* <FormControl mb={6}>
          <FormLabel
            fontSize="0.75rem"
            lineHeight="17px"
            color="#5C5F64"
            mb={3}
          >
            Level
          </FormLabel>
          <Input
            type="text"
            name="deckName"
            placeholder="Level"
            value={localData.deckName}
            onChange={handleChange}
            _placeholder={{ fontSize: '0.8756rem', color: '#9A9DA2' }}
          />
        </FormControl> */}
        {/* <FormControl mb={8}>
          <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
            Level (optional)
          </FormLabel>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<FiChevronDown />}
              borderRadius="8px"
              fontWeight={400}
              width="100%"
              height="42px"
              textAlign="left"
              fontSize="0.875rem"
              fontFamily="Inter"
              color=" #212224"
            >
              {level === '' ? 'Level' : level.label}
            </MenuButton>
            <MenuList minWidth={'auto'}>
              {levelOptions.map((level) => (
                <MenuItem
                  key={level._id}
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={() => setLevel(level)}
                >
                  {level.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </FormControl> */}

        {/* <Box>
          <Center>
            <RiUploadCloud2Fill className="h-8 w-8" color="gray.500" />
          </Center>

          <Text
            mb="2"
            fontSize="sm"
            color={isDragOver ? 'white' : 'gray.500'}
            fontWeight="semibold"
            textAlign="center"
          >
            Click to upload or drag and drop
          </Text>
          <PDFTextContainer>
            <Text fontSize="xs" color={isDragOver ? 'white' : 'gray.500'}>
              DOC, TXT, or PDF (MAX. 500mb)
            </Text>
          </PDFTextContainer>
        </Box> */}
        {/* <FormLabel fontSize="0.75rem" lineHeight="17px" color="#5C5F64" mb={3}>
          Attach a file{' '}
          <span
            style={{
              fontStyle: 'italic'
            }}
          >
            (optional)
          </span>
        </FormLabel> */}
        {/* <Center
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
        </Center> */}
        <Box my={2}>
          {countdown.active && (
            <CountdownProgressBar
              confirmReady={confirmReady}
              countdown={countdown}
            />
          )}
        </Box>
      </Box>
    </CustomModal>
  );
};

export default ViewHomeWorkHelpDetails;
