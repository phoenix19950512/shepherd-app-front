import CustomModal from '../CustomComponents/CustomModal';
import { DownloadIcon, FlashCardsIcon } from '../icons';
import { DeleteNoteModal } from '../index';
import SelectableTable, { TableColumn } from '../table';
import { useDisclosure } from '@chakra-ui/hooks';
import { GrDocumentPerformance } from 'react-icons/gr';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Menu,
  MenuList,
  MenuButton,
  Button,
  MenuItem,
  Box,
  Text,
  Flex,
  Divider,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Spinner,
  Center,
  Badge
} from '@chakra-ui/react';
import {
  FlexContainer,
  NotesWrapper,
  StyledHeader
} from '../../views/Dashboard/Notes/styles';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { IconContext } from 'react-icons';
import { AiFillStar } from 'react-icons/ai';
import { FaCalendarAlt, FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Select } from 'chakra-react-select';
import studyPlanStore from '../../state/studyPlanStore';
import clientStore from '../../state/clientStore';
import userStore from '../../state/userStore';
import ShareModal from '../ShareModal';
import useSchoolStudents from '../../views/Dashboard/StudyPlans/hooks/useSchoolStudents';
import { RiUserAddLine } from 'react-icons/ri';
import { useCustomToast } from '../CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../services/ApiService';
import { RiUploadCloud2Fill } from '@remixicon/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import uploadFile from '../../helpers/file.helpers';
import styled from 'styled-components';
const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #585f68;
`;

const PDFTextContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;
interface Client {
  id: number;
  name: string;
  subject: string;
  start_date: string;
  end_date: string;
  status: string;
  amount_earned: string;
  classes: string;
  rating: number;
}

const getNotes = JSON.parse(localStorage.getItem('notes') as string) || [];

const clients: Client[] = getNotes;

type DataSourceItem = {
  id: number;
  name: string;
  subject: string;
  title: string;
  readinessScore: any;
  email: string;
};

const AllSchoolStudentsTab = (props) => {
  //   const { allSchoolTutorStudents, setAllSchoolTutorStudents }: any = props;

  const { fetchPlans, studyPlans, pagination } = studyPlanStore();
  const { user } = userStore();
  const {
    fetchSchoolTutorStudents,
    schoolStudents,
    isLoading: studentListLoading
  } = clientStore();
  const [allSchoolTutorStudents, setAllSchoolTutorStudents] =
    useState<any>(schoolStudents);
  console.log(schoolStudents);
  const planOptions: any =
    studyPlans?.map((item, index) => ({
      value: item._id,
      label: item.title,
      id: item._id
    })) || [];
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const [, setDeleteAllNotesModal] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [clientsDetails, setClientDetails] = useState('');
  const [clientName, setClientName] = useState('');
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(planOptions[0]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(40);
  const [tzOptions, setTzOptions] = useState([]);

  const {
    isOpen: isOpenInvite,
    onOpen: onOpenInvite,
    onClose: onCloseInvite
  } = useDisclosure();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [timezone, setTimezone] = useState('');

  const [csvFile, setCsvFile] = useState(null);
  const { hasActiveSubscription, fileSizeLimitMB, fileSizeLimitBytes } =
    userStore.getState();
  const toast = useCustomToast();

  const handleSubmitInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload, successMessage, errorMessage;
      if (!csvFile) {
        payload = [
          {
            email,
            firstName,
            lastName,
            tz: timezone
          }
        ];
        successMessage = 'Student';
        errorMessage = 'Error inviting student.';
      } else {
        payload = {
          studentCSV: csvFile
        };
        successMessage = 'Students';
        errorMessage = 'Error inviting students.';
      }

      const response = await (csvFile
        ? ApiService.inviteSchoolStudentsWithCSV(payload)
        : ApiService.inviteSchoolStudents(payload));
      const resp = await response.json();

      if (response.ok) {
        toast({
          title: `${successMessage} invited successfully!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      } else {
        toast({
          title: resp.message,
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      }
    } catch (error) {
      console.error(
        `Error inviting ${csvFile ? 'students' : 'student'}:`,
        error
      );
      toast({
        title: 'An error occurred.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setIsLoading(false);
      //   onCloseInvite();
    }
  };

  console.log(allSchoolTutorStudents);

  const navigate = useNavigate();
  //   const dataSource: DataSourceItem[] = Array.from(
  //     { length: performanceReport?.data?.length },
  //     (_, i) => {
  //       // Define variables for background color and text color
  //       let bgColor = '';
  //       let textColor = '';
  //       let text = '';

  //       // Set background color and text color based on status
  //       switch (performanceReport.data[i]?.status) {
  //         case 'notStarted':
  //           bgColor = '#FEF0F0';
  //           textColor = '#F53535';
  //           text = 'NOT STARTED';
  //           break;
  //         case 'inProgress':
  //           bgColor = '#FFF2EB';
  //           textColor = '#FB8441';
  //           text = 'IN PROGRESS';

  //           break;
  //         default:
  //           bgColor = '#F1F9F1';
  //           textColor = '#66BD6A';
  //           text = 'COMPLETE';

  //           break;
  //       }

  //       return {
  //         key: i,
  //         id: performanceReport.data[i]?._id,
  //         name: `${performanceReport.data[i]?.studyPlan.title} `,
  //         subject: performanceReport.data[i]?.studyPlan?.course?.label,
  //         topic: performanceReport.data[i]?.topic?.label,
  //         status: (
  //           <Badge bg={bgColor} color={textColor} p={1} fontWeight="500">
  //             {text}
  //           </Badge>
  //         ),
  //         quizScore: `${performanceReport.data[i]?.quizReadinessScore}%`,
  //         flashcardScore: `${performanceReport.data[i]?.flashcardReadinessScore}%`,
  //         timeSpent: `${performanceReport.data[i]?.aggregateStudyTime.replace(
  //           'Minutes',
  //           'min'
  //         )}`
  //       };
  //     }
  //   );

  const dataSource: DataSourceItem[] =
    allSchoolTutorStudents?.map((student, i) => {
      let textColor = '';

      switch (true) {
        case student.studyPlan?.readinessScore < 50:
          textColor = '#F53535';
          break;
        case student.studyPlan?.readinessScore > 50 &&
          student.studyPlan?.readinessScore < 85:
          textColor = '#FB8441';
          break;
        case student.studyPlan?.readinessScore > 85:
          textColor = '#66BD6A';
          break;
        default:
          textColor = 'grey';
          break;
      }

      return {
        key: i,
        readinessScore: (
          <Text color={textColor} p={1} fontWeight="500">
            {` ${student.studyPlan?.readinessScore}%`}
          </Text>
        ),
        title: student.studyPlan?.title,
        id: student.user.id,
        name: `${student.user.name.first} ${student.user.name.last}`,
        subject: student.courses[0]?.label,
        email: student.user?.email
      };
    }) || [];

  useEffect(() => {
    const getTimeZoneOptions = () => {
      const timezones = moment.tz.names();
      const formattedOptions = timezones.map((timezone) => ({
        value: timezone,
        label: timezone
      }));
      setTzOptions(formattedOptions);
    };

    getTimeZoneOptions();
  }, []);
  useEffect(() => {
    setAllSchoolTutorStudents(schoolStudents);
  }, [schoolStudents]);
  useEffect(() => {
    // Fetch plans when component mounts
    fetchPlans(page, limit);
  }, []);

  useEffect(() => {
    if (studyPlans && studyPlans.length > 0) {
      fetchSchoolTutorStudents(page, limit, planOptions[0]?.id);
      setSelectedPlan(planOptions[0]);
    }
  }, [studyPlans]);
  useEffect(() => {
    if (selectedPlan) {
      fetchSchoolTutorStudents(page, limit, selectedPlan.id);
    }
  }, [selectedPlan]);
  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < clients.length;
    setChecked(selectedPeople.length === clients.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : clients);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const onDeleteNote = (isOpenDeleteModal: boolean, noteDetails: string) => {
    setDeleteNoteModal(isOpenDeleteModal);
    setClientDetails(noteDetails);
  };

  const sortByStudentName = (direction) => {
    const sortedClients = [...allSchoolTutorStudents].sort((a: any, b: any) => {
      const nameA = a.user?.name?.first.toLowerCase();
      const nameB = b.user?.name?.first.toLowerCase();

      if (direction === 'DESC') {
        return nameB?.localeCompare(nameA);
      } else {
        return nameA?.localeCompare(nameB);
      }
    });

    setAllSchoolTutorStudents(sortedClients);
  };
  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: 'name',
      title: 'Student Name',
      dataIndex: 'name',
      align: 'left'
    },
    {
      key: 'Plan Title',
      title: 'title',
      dataIndex: 'title'
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      align: 'left',
      id: 2
    },

    {
      key: 'Readiness Score',
      title: 'Readiness Score',
      dataIndex: 'readinessScore',
      align: 'center'
    },
    {
      key: 'actions',
      title: '',
      render: ({ name, id }) => (
        <Menu>
          <MenuButton
            as={Button}
            variant="unstyled"
            borderRadius="full"
            p={0}
            minW="auto"
            height="auto"
          >
            <FaEllipsisH fontSize={'12px'} />
          </MenuButton>
          <MenuList
            fontSize="14px"
            minWidth={'185px'}
            borderRadius="8px"
            backgroundColor="#FFFFFF"
            boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
          >
            <section className="space-y-2 border-b pb-2">
              <button
                onClick={() => navigate(`performance/${id}`)}
                className="w-full bg-gray-100 rounded-md flex items-center justify-between p-2"
              >
                <div className=" flex items-center space-x-1">
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <GrDocumentPerformance
                      className="w-4 h-4 text-primaryGray"
                      onClick={undefined}
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    View Performance
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
            </section>
            <div
              onClick={() => onDeleteNote(true, name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px'
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
                  fill="#F53535"
                />
              </svg>
              <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                Delete
              </Text>
            </div>
          </MenuList>
        </Menu>
      )
    }
  ];
  console.log(planOptions, studyPlans);
  const { data: studentList } = useSchoolStudents();

  const shareList = useMemo(() => {
    if (studentList) {
      const shareable = studentList.map((item) => ({
        id: item.user?._id,
        name: `${item.user?.name?.first} ${item.user?.name?.last} `
      }));
      return shareable;
    }
  }, [studentList]);

  const [docLoading, setDocLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files[0];
    handleUploadInput(files);
  };

  const handleUploadInput = (file: File | null) => {
    if (!file) return;
    if (file?.size > 10000000) {
      toast({
        title: 'Please upload a file under 10MB',
        status: 'error',
        position: 'top',
        isClosable: true
      });
      return;
    } else {
      setDocLoading(true);
      const readableFileName = file.name
        .toLowerCase()
        .replace(/\.pdf$/, '')
        .replace(/_/g, ' ');
      const uploadEmitter = uploadFile(file, {
        studentID: user._id, // Assuming user._id is always defined
        documentID: readableFileName // Assuming readableFileName is the file's name
      });

      uploadEmitter.on('progress', (progress: number) => {
        // Update the progress. Assuming progress is a percentage (0 to 100)

        setDocLoading(true);
      });

      uploadEmitter.on('complete', async (uploadFile) => {
        // Assuming uploadFile contains the fileUrl and other necessary details.
        const documentURL = uploadFile.fileUrl;
        setDocLoading(false);
        setFileName(readableFileName);
        setCsvFile(documentURL);
      });
      uploadEmitter.on('error', (error) => {
        setDocLoading(false);
        // setCvUploadPercent(0);
        toast({ title: error.message + error.cause, status: 'error' });
      });
    }
  };

  return (
    <div>
      <header className="flex m-4 justify-between">
        <StyledHeader>
          <span className="font-bold"> Students</span>
          <span className="count-badge">{allSchoolTutorStudents?.length}</span>
        </StyledHeader>
        {planOptions.length > 0 && (
          <FlexContainer>
            <Menu>
              <MenuButton>
                <Flex
                  cursor="pointer"
                  border="1px solid #E5E6E6"
                  padding="5px 10px"
                  borderRadius="6px"
                  alignItems="center"
                  mb={{ base: '10px', md: '0' }}
                  width={{ base: '-webkit-fill-available', md: 'auto' }}
                >
                  <Text
                    fontWeight="400"
                    fontSize={{ base: '12px', md: '14px' }}
                    marginRight="5px"
                    color="#5E6164"
                    width={{ base: '100%', md: 'auto' }}
                  >
                    Sort By
                  </Text>
                  <FaCalendarAlt color="#96999C" size="12px" />
                </Flex>
              </MenuButton>
              <MenuList
                fontSize="14px"
                minWidth={'185px'}
                borderRadius="8px"
                backgroundColor="#FFFFFF"
                boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
              >
                <MenuItem
                  _hover={{ bgColor: '#F2F4F7' }}
                  color="#212224"
                  fontSize="14px"
                  onClick={() => sortByStudentName('ASC')}
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Student name (A-Z)
                </MenuItem>
                <MenuItem
                  _hover={{ bgColor: '#F2F4F7' }}
                  color="#212224"
                  fontSize="14px"
                  onClick={() => sortByStudentName('DESC')}
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Student name (Z-A)
                </MenuItem>
              </MenuList>
            </Menu>
            <Select
              className="basic-single"
              placeholder="search by plan"
              defaultValue={planOptions[0]}
              // value={selectedPlan}
              onChange={(option) => setSelectedPlan(option)}
              // isDisabled={isDisabled}
              // isLoading={isLoading}
              isClearable={false}
              isSearchable={true}
              name="color"
              options={planOptions}
              size="sm"
            />

            <Button
              size="sm"
              leftIcon={<Icon as={RiUserAddLine} />}
              onClick={onOpenInvite}
              {...props}
            >
              Invite Student
            </Button>

            <Modal isOpen={isOpenInvite} onClose={onCloseInvite}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Invite Student</ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmitInvite} className="w-[100%]">
                    <FormControl id="email" isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                    <FormControl id="firstName" mt={4} isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl id="lastName" mt={4} isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl id="lastName" mt={4} isRequired>
                      <FormLabel>Timezone</FormLabel>
                      <Select
                        value={tzOptions.find(
                          (option) => option.value === timezone
                        )}
                        onChange={(selectedOption) =>
                          setTimezone(selectedOption.value)
                        }
                        options={tzOptions}
                        placeholder={'Select Timezone'}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        className="my-4"
                        // styles={customStyles}
                      />
                    </FormControl>
                    <Center mt={4} flexDirection={'column'}>
                      <Text>or</Text>
                      <Text fontWeight={'semibold'}>
                        Invite Multiple students by uploading a csv file
                      </Text>
                    </Center>

                    <FormControl id="lastName" mt={4} isRequired>
                      <Center
                        w="full"
                        minH="65px"
                        my={3}
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
                          <Center mt={'10px'} flexDirection="column">
                            {docLoading ? (
                              <Spinner />
                            ) : fileName ? (
                              <Flex>
                                <AttachmentIcon />{' '}
                                <FileName>{fileName}</FileName>
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
                                    CSV only (MAX: {fileSizeLimitMB}MB)
                                  </Text>
                                </PDFTextContainer>
                              </Flex>
                            )}
                          </Center>
                        </label>
                        <input
                          type="file"
                          accept=".csv"
                          // accept="application/pdf"
                          className="hidden"
                          id="file-upload"
                          ref={inputRef}
                          onChange={(e) => handleUploadInput(e.target.files[0])}
                        />
                      </Center>
                    </FormControl>
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleSubmitInvite}
                    isLoading={isLoading}
                  >
                    Invite
                  </Button>
                  <Button onClick={onCloseInvite}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </FlexContainer>
        )}
      </header>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle h-screen sm:px-6 lg:px-12 z-10">
            <div className="relative">
              {planOptions?.length > 0 ? (
                studentListLoading ? (
                  <>
                    <Center my="auto">
                      <Spinner></Spinner>
                    </Center>
                  </>
                ) : allSchoolTutorStudents?.length > 0 ? (
                  <SelectableTable
                    columns={clientColumn}
                    dataSource={dataSource}
                    isSelectable
                    fileImage
                    onSelect={(e) => setSelectedPeople(e)}
                  />
                ) : (
                  <Text>You have no students enlisted in this plan</Text>
                )
              ) : (
                <Text>You are yet to create a plan</Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSchoolStudentsTab;
