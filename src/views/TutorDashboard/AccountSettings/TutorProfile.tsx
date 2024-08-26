import FileAvi2 from '../../../assets/file-avi2.svg';
import AddSubjectLevel from '../../../components/AddSubjectLevel';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import DragAndDrop from '../../../components/DragandDrop';
import { firebaseAuth, updatePassword } from '../../../firebase';
import { storage } from '../../../firebase';
import ApiService from '../../../services/ApiService';
import resourceStore from '../../../state/resourceStore';
import userStore from '../../../state/userStore';
import { Course, LevelType } from '../../../types';
import AvailabilityTable from '../../Dashboard/components/AvailabilityTable';
import AddSubjectForm from '../../OnboardTutor/components/steps/add_subjects';
import AvailabilityEditForm from './AvailabilityEditForm.tsx';
import QualificationsEditForm from './QualificationsEditForm';
import {
  Avatar,
  AspectRatio,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Input,
  InputGroup,
  InputRightElement,
  useEditableControls,
  Switch,
  Spacer,
  Divider,
  Button,
  Box,
  Flex,
  Image,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  Stack,
  useToast,
  useDisclosure,
  VStack,
  Center,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  IconButton,
  Textarea,
  InputLeftElement,
  HStack,
  Link
} from '@chakra-ui/react';
import { ref } from '@firebase/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import moment from 'moment';
// import { updatePassword } from 'firebase/auth';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react';
import { BiPlayCircle } from 'react-icons/bi';
import { IoIosAlert } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';
import Availability from '../../../components/Availability';
import FileUpload from '../../Dashboard/FlashCards/components/fileUploadField';
import uploadFile from '../../../helpers/file.helpers';

interface SubjectLevel {
  subject: string;
  level: string;
}

function MyProfile(props) {
  const { tutorData } = props;
  const { user, fetchUser } = userStore();
  const { courses: courseList, levels, rate } = resourceStore();

  const toast = useToast();
  const [newEmail, setNewEmail] = useState<string>(tutorData.email);

  const [isUpdating, setIsUpdating] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const handleClickOld = () => setShowOldPassword(!showOldPassword);
  const handleClickNew = () => setShowNewPassword(!showNewPassword);
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);
  const [description, setDescription] = useState(tutorData.tutor.description);
  const [schedule, setSchedule] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [subjectLevel, setSubjectLevel] = useState<any>(
    tutorData.tutor.coursesAndLevels.map((item) => ({
      course: {
        label: item.course && item.course.label ? item.course.label : ''
      },
      level: { label: item.level && item.level.label ? item.level.label : '' }
    }))
  );

  const [hourlyRate, setHourlyRate] = useState(tutorData.tutor.rate);
  const [isLoading, setIsLoading] = useState(false);
  const [icsFile, setIcsFile] = useState(null);
  const [introVideo, setIntroVideo] = useState<any>(null);
  const [introVideoLink, setIntroVideoLink] = useState<any>(null);

  const [fields, setFields] = useState({
    calendlyLink: tutorData.tutor.calendlyLink
  });
  const {
    isOpen: isUpdateHourlyRateModalOpen,
    onOpen: openUpdateHourlyRateModal,
    onClose: closeUpdateHourlyRateModal
  } = useDisclosure();

  const {
    isOpen: isUpdateAvailabilityModalOpen,
    onOpen: openUpdateAvailabilityModal,
    onClose: closeUpdateAvailabilityModal
  } = useDisclosure();
  const {
    isOpen: isUpdateQualificationsModalOpen,
    onOpen: openUpdateQualificationsModal,
    onClose: closeUpdateQualificationsModal
  } = useDisclosure();
  const {
    isOpen: isUpdateSubjectModalOpen,
    onOpen: openUpdateSubjectModal,
    onClose: closeUpdateSubjectModal
  } = useDisclosure();
  const {
    isOpen: isUpdateDescriptionModalOpen,
    onOpen: openUpdateDescriptionModal,
    onClose: closeUpdateDescriptionModal
  } = useDisclosure();
  const {
    isOpen: isUpdateVideoModalOpen,
    onOpen: openUpdateVideoModal,
    onClose: closeUpdateVideoModal
  } = useDisclosure();

  const handleIntroVideoUpload = (file: File) => {
    if (!file) return;

    if (file?.size > 10000000) {
      setIsLoading(true);
      toast({
        title: 'Please upload a file under 10MB',
        status: 'error',
        position: 'top',
        isClosable: true
      });
      return;
    } else {
      // const storageRef = ref(storage, `files/${introVideo.name}`);
      // const uploadTask = uploadBytesResumable(storageRef, introVideo);
      setIntroVideo(file);
    }
  };

  useEffect(() => {
    if (!introVideo) return;
    else {
      const storageRef = ref(storage, `files/${introVideo.name}`);
      const uploadTask = uploadBytesResumable(storageRef, introVideo);

      setIsLoading(true);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // setCvUploadPercent(progress);
        },
        (error) => {
          setIsLoading(false);
          // setCvUploadPercent(0);
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIntroVideoLink(downloadURL);
            setIsLoading(false);
          });
        }
      );
    }
    /* eslint-disable */
  }, [introVideo]);

  useEffect(() => {
    if (tutorData.tutor.intro && !introVideo) {
      fetch(tutorData.tutor.intro)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], 'intro_video', { type: blob.type }); // replace 'filename' with your desired filename
          setIntroVideo(file);
        });
    }
  }, [tutorData.tutor.intro, introVideo]);

  const hasAnyEmptyArray = (obj) => {
    for (const key in obj) {
      if (obj[key] && Array.isArray(obj[key]) && obj[key].length === 0) {
        return true;
      }
    }
    return false;
  };
  const isScheduleValid = useMemo(() => {
    if (!schedule || !Object.keys(schedule).length) {
      return false;
    }
    const sch: any = schedule;

    let hasNonEmptyBlock = false; // Flag to check for at least one non-empty block

    for (const key in sch) {
      if (!Array.isArray(sch[key])) {
        return false;
      }

      if (sch[key].length > 0) {
        hasNonEmptyBlock = true; // Update flag if the array has non-empty blocks

        for (let i = 0; i < sch[key].length; i++) {
          if (
            !sch[key][i].begin ||
            !sch[key][i].end ||
            sch[key][i].begin.trim() === '' ||
            sch[key][i].end.trim() === ''
          ) {
            return false;
          }
        }
      }
    }

    return hasNonEmptyBlock; // Return whether at least one non-empty block exists
  }, [schedule]);

  const handleHourlyRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rate = event.target.value;
    // onboardTutorStore.set.rate(parseInt(rate));
  };

  const tutorEarnings = useMemo(() => {
    const baseEarning = 0;
    if (!hourlyRate) return baseEarning.toFixed(2);
    const rateNumber = hourlyRate;
    const earnings = rateNumber - rate * 0.01 * rateNumber;

    return earnings.toFixed(2);
  }, [hourlyRate, rate]);

  const cost = useMemo(() => rate * 0.01 * hourlyRate, [hourlyRate, rate]);

  const updateSchedule = (value) => {
    setSchedule(value);
  };
  const updateTimezone = (value) => {
    handleUpdateTutor('tz', value);
    // setSchedule(value);
  };
  const updateQualifications = (qualifications) => {
    setQualifications(qualifications);
  };

  const handleUpdateTutor = async (updateField, value) => {
    const formData = {};
    setIsUpdating(true);
    formData[updateField] = value;

    const response = await ApiService.updateTutor(formData);
    const resp: any = await response.json();
    if (response.status === 200) {
      toast({
        render: () => (
          <CustomToast title=" Updated successfully" status="success" />
        ),
        position: 'top-right',
        isClosable: true
      });
      fetchUser();
    } else {
      toast({
        render: () => (
          <CustomToast title="Something went wrong.." status="error" />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
    setIsUpdating(false);
    closeUpdateAvailabilityModal();
    closeUpdateDescriptionModal();
    closeUpdateHourlyRateModal();
    closeUpdateSubjectModal();
    closeUpdateVideoModal();
    closeUpdateQualificationsModal();
  };

  const handleSubjectLevelChange = (f: (d: typeof subjectLevel) => any) => {
    const data: any = f(subjectLevel);
    setSubjectLevel(data);
  };

  useEffect(() => {
    if (!subjectLevel.length) {
      addSubject();
    }
    /* eslint-disable */
  }, [subjectLevel.length]);

  const [loadingCourses, setLoadingCourses] = useState(false);

  const handleSubjectChange = (index: number, value: string) => {
    handleSubjectLevelChange((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels[index].course.label = value;
      return updatedSubjectLevels;
    });
  };

  const handleLevelChange = (index: number, value: string) => {
    handleSubjectLevelChange((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels[index].level.label = value;
      return updatedSubjectLevels;
    });
  };

  const addSubject = () => {
    handleSubjectLevelChange((prevSubjectLevels) => [
      ...prevSubjectLevels,
      { course: {} as Course, level: {} as LevelType }
    ]);
  };

  const removeSubject = (index: number) => {
    handleSubjectLevelChange((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels.splice(index, 1);
      return updatedSubjectLevels;
    });
  };
  const onHandleFile = (file: File) => {
    const uploadEmitter = uploadFile(file, {
      studentID: user?._id as string,
      documentID: file.name
    });

    uploadEmitter.on('progress', (progress: number) => {
      if (progress && progress < 99 && !isLoading) {
        setIsLoading(true);
      }
    });

    uploadEmitter.on('complete', (uploadFile) => {
      setIcsFile((prev) => ({ ...prev, documentId: uploadFile.fileUrl }));
      setIsLoading(false);
    });
    uploadEmitter.on('error', (error) => {
      setIsLoading(false);
    });
  };

  const disallowAvailabilityUpdate = useMemo(() => {
    if (user.school) {
      return Boolean((fields.calendlyLink?.length || 0) === 0);
    }
    return !isScheduleValid || !schedule || isUpdating;
  }, [fields.calendlyLink, isScheduleValid, schedule, isUpdating, user.school]);
  const calendlyUrl = 'https://calendly.com/';
  return (
    <Box>
      {tutorData && (
        <>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
            mt={2}
            mb={4}
          >
            {' '}
            <Flex gap={3} py={2}>
              <Avatar
                boxSize="64px"
                color="white"
                name={`${tutorData.name?.first} ${tutorData.name?.last}`}
                bg="#4CAF50;"
              />
              <Stack spacing={'2px'}>
                <Text
                  fontSize="16px"
                  fontWeight={500}
                  color="text.200"
                  display={{ base: 'block', sm: 'none', md: 'block' }}
                >
                  {`${tutorData.name?.first} ${tutorData.name?.last}`}
                </Text>{' '}
                <Text fontSize={14} color="text.400">
                  {tutorData.email}
                </Text>
              </Stack>
            </Flex>
            {!user.school && (
              <>
                <Divider />
                <Flex alignItems="center" gap={2} py={4}>
                  <Text
                    color="#6E7682"
                    fontSize="12px"
                    fontWeight="400"
                    wordBreak={'break-word'}
                    textTransform="uppercase"
                  >
                    Hourly Rate
                  </Text>
                  <Text
                    color="neutral.800"
                    fontSize="base"
                    fontWeight="medium"
                    fontFamily="Inter"
                    lineHeight="21px"
                    letterSpacing="tight"
                  >
                    {`$${tutorData.tutor.rate}.00/hr`}
                  </Text>
                  <Spacer />
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="gray.200"
                    position="relative"
                    cursor={'pointer'}
                    onClick={openUpdateHourlyRateModal}
                  >
                    <Center w="100%" h="100%" position="absolute">
                      <MdEdit />
                    </Center>
                  </Box>
                </Flex>
              </>
            )}
          </Box>
          {!user.school && (
            <>
              {' '}
              <Box
                p={4}
                bg="white"
                borderRadius={10}
                borderWidth="1px"
                borderColor="#EEEFF1"
                justifyContent="center"
                alignItems="center"
                my={4}
              >
                <Flex alignItems="center">
                  <Text
                    color="#6E7682"
                    fontSize="12px"
                    fontWeight="400"
                    wordBreak={'break-word'}
                    textTransform="uppercase"
                  >
                    Intro Video
                  </Text>
                  <Spacer />
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="gray.200"
                    position="relative"
                    cursor={'pointer'}
                    onClick={openUpdateVideoModal}
                  >
                    <Center w="100%" h="100%" position="absolute">
                      <MdEdit />
                    </Center>
                  </Box>
                </Flex>
                <Center position="relative" borderRadius={10} my={2}>
                  <Box
                    h={{ base: '170px', md: '170px' }}
                    w={{ base: 'full', md: 'full' }}
                  >
                    <video
                      title="tutor-video"
                      controls
                      style={{
                        borderRadius: 10,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <source
                        src={tutorData.tutor.introVideo}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </Box>{' '}
                  {/* </AspectRatio> */}
                  <Center
                    color="white"
                    display={vidOverlay ? 'flex' : 'none'}
                    position={'absolute'}
                    bg="#0D1926"
                    opacity={'75%'}
                    boxSize="full"
                  >
                    <VStack>
                      <BiPlayCircle
                        onClick={() => setVidOverlay(false)}
                        size={'50px'}
                      />
                      <Text display={'inline'}> play intro video</Text>
                    </VStack>
                  </Center>
                </Center>
              </Box>
            </>
          )}

          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            <Flex alignItems="center">
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                About Me
              </Text>
              <Spacer />
              <Box
                w="30px"
                h="30px"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
                cursor={'pointer'}
                onClick={openUpdateDescriptionModal}
              >
                <Center w="100%" h="100%" position="absolute">
                  <MdEdit />
                </Center>
              </Box>
            </Flex>
            <Text
              whiteSpace="pre-wrap"
              color="#212224"
              fontSize="14px"
              fontWeight="400"
              // lineHeight="24"
              my={2}
              wordBreak={'break-word'}
            >
              {tutorData.tutor?.description}
            </Text>
          </Box>
          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            <Flex>
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                Subject Offered
              </Text>
              <Spacer />
              <Box
                w="30px"
                h="30px"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
                cursor={'pointer'}
                onClick={openUpdateSubjectModal}
              >
                <Center w="100%" h="100%" position="absolute">
                  <MdEdit />
                </Center>
              </Box>
            </Flex>
            <TableContainer my={4}>
              <Box border={'1px solid #EEEFF2'} borderRadius={8} py={3}>
                <Table variant="simple">
                  {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>Level</Th>
                      <Th>Price</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tutorData.tutor.coursesAndLevels.map((cl) => (
                      <Tr>
                        <Td bgColor={'#FAFAFA'}>{cl.course.label}</Td>
                        <Td>{cl.level?.label}</Td>
                        <Td>${tutorData.tutor.rate}/hr</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TableContainer>
          </Box>
          {!user.school && (
            <>
              <Box
                p={4}
                bg="white"
                borderRadius={10}
                borderWidth="1px"
                borderColor="#EEEFF1"
                justifyContent="center"
                alignItems="center"
                my={4}
              >
                <Flex alignItems="center">
                  <Text
                    color="#6E7682"
                    fontSize="12px"
                    fontWeight="400"
                    wordBreak={'break-word'}
                    textTransform="uppercase"
                  >
                    Qualifications
                  </Text>
                  <Spacer />
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="gray.200"
                    position="relative"
                    cursor={'pointer'}
                    onClick={openUpdateQualificationsModal}
                  >
                    <Center w="100%" h="100%" position="absolute">
                      <MdEdit />
                    </Center>
                  </Box>
                </Flex>
                {tutorData.tutor?.qualifications?.map((q) => (
                  <>
                    <Flex px={3} gap={0} direction={'row'} my={2}>
                      <Box mb={4}>
                        <FileAvi2 />
                      </Box>
                      <Stack direction={'column'} px={4} spacing={1}>
                        <Text fontSize={'16px'} fontWeight={'500'} mb={0}>
                          {q.institution}
                        </Text>
                        <Text
                          fontWeight={400}
                          color={'#585F68'}
                          fontSize="14px"
                          mb={'2px'}
                        >
                          {q.degree}
                        </Text>

                        <Spacer />
                        <Text fontSize={12} fontWeight={400} color="#6E7682">
                          {new Date(q.startDate).getFullYear()} -{' '}
                          {new Date(q.endDate).getFullYear()}
                        </Text>
                      </Stack>
                    </Flex>
                    <Divider />
                  </>
                ))}
              </Box>
            </>
          )}

          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            {' '}
            <Flex alignItems="center">
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                Availability
              </Text>
              <Spacer />
              <Box
                w="30px"
                h="30px"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
                cursor={'pointer'}
                onClick={openUpdateAvailabilityModal}
              >
                <Center w="100%" h="100%" position="absolute">
                  <MdEdit />
                </Center>
              </Box>
            </Flex>
            {!user.school ? (
              <>
                {/* <AvailabilityTable data={tutorData.tutor} /> */}
                <Availability
                  schedule={tutorData.tutor.schedule}
                  timezone={tutorData.tutor.tz}
                  // handleUpdateSchedule={handleUpdateTutor}
                  // handleUpdateTimezone={handleUpdateTutor}
                  editMode={false}
                />
              </>
            ) : (
              <>
                {/* <FormLabel>Calendly Url</FormLabel>{' '} */}
                {/* <Input
                  onChange={(e) => {
                    setFields({ calendlyLink: e.target.value });
                  }}
                  defaultValue={}
                /> */}

                <Link
                  href={tutorData.tutor.calendlyLink}
                  color="#207df7"
                  textDecoration="none"
                  _hover={{ color: 'blue.600' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tutorData.tutor.calendlyLink}
                </Link>
              </>
            )}
          </Box>
        </>
      )}

      <CustomModal
        isOpen={isUpdateAvailabilityModalOpen}
        modalTitle="Update Availability"
        isModalCloseButton
        style={{
          maxWidth: '700px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            {user.school ? (
              <Button
                isDisabled={disallowAvailabilityUpdate}
                onClick={() =>
                  handleUpdateTutor('calendlyLink', fields.calendlyLink)
                }
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            ) : (
              <Button
                color="red"
                onClick={() => handleUpdateTutor('schedule', schedule)}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            )}
          </div>
        }
        onClose={closeUpdateAvailabilityModal}
      >
        <Box overflowY={'scroll'} px={6} w={'100%'}>
          {user.school ? (
            <>
              <FormLabel>calendly.com/</FormLabel>
              <Input
                onChange={(e) => {
                  setFields({
                    calendlyLink: `${calendlyUrl}${e.target.value}`
                  });
                }}
                defaultValue={tutorData.tutor.calendlyLink.replace(
                  `${calendlyUrl}`,
                  ''
                )}
              />
            </>
          ) : (
            <Availability
              schedule={tutorData.tutor.schedule}
              timezone={tutorData.tutor.tz}
              handleUpdateSchedule={updateSchedule}
              handleUpdateTimezone={updateTimezone}
              editMode={true}
            />
          )}
        </Box>
      </CustomModal>
      <CustomModal
        isOpen={isUpdateVideoModalOpen}
        modalTitle="Update Intro Video"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              isDisabled={!introVideoLink || introVideo === null || isLoading}
              onClick={() => handleUpdateTutor('introVideo', introVideoLink)}
            >
              Update
            </Button>
          </div>
        }
        onClose={closeUpdateVideoModal}
      >
        <Box width="100%" p={2}>
          <Box marginTop="10px">
            <DragAndDrop
              isLoading={isLoading}
              supportingText="Click to upload a video"
              accept="video/*"
              onDelete={() => setIntroVideo(null)}
              onFileUpload={handleIntroVideoUpload}
              boxStyles={{ width: '250px', marginTop: '10px', height: '50px' }}
            />
            {introVideo && (
              <Text marginTop="1rem">Selected file: {introVideo.name}</Text>
            )}
          </Box>
        </Box>
      </CustomModal>
      <CustomModal
        isOpen={isUpdateDescriptionModalOpen}
        modalTitle="Update Description"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              isDisabled={description === tutorData.tutor.description}
              onClick={() => handleUpdateTutor('description', description)}
            >
              Update
            </Button>
          </div>
        }
        onClose={closeUpdateDescriptionModal}
      >
        {' '}
        <FormControl p={3} alignItems="center">
          <FormLabel fontSize="14px" fontWeight="medium" htmlFor="description">
            Description
          </FormLabel>
          <Textarea
            id="description"
            placeholder="Enter description"
            defaultValue={description}
            // value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="sm" // Adjust the size as needed
            borderRadius="8px"
            borderColor="gray.300"
            _hover={{ borderColor: 'gray.400' }}
            _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
            h="200px"
          />
        </FormControl>
      </CustomModal>
      <CustomModal
        isOpen={isUpdateHourlyRateModalOpen}
        modalTitle="Update Hourly Rate"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              isDisabled={hourlyRate === tutorData.tutor.rate}
              onClick={() => handleUpdateTutor('rate', parseInt(hourlyRate))}
            >
              Update
            </Button>
          </div>
        }
        onClose={closeUpdateHourlyRateModal}
      >
        <Box p={4} alignContent="center" alignItems={'center'} w="full">
          {' '}
          <Stack spacing={4}>
            <FormControl>
              <FormLabel
                fontStyle="normal"
                fontWeight={500}
                fontSize={14}
                lineHeight="20px"
                letterSpacing="-0.001em"
                color="#5C5F64"
              >
                Hourly Rate
              </FormLabel>
              <InputGroup
                bg="#FFFFFF"
                _active={{
                  border: '1px solid #207df7'
                }}
                border="1px solid #E4E5E7"
                boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                borderRadius="6px"
              >
                <InputLeftElement
                  pointerEvents="none"
                  color="black"
                  fontSize="14px"
                  children="$"
                />
                <Input
                  type="number"
                  value={hourlyRate}
                  marginLeft={'30px'}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  placeholder="0.00"
                  bg="transparent"
                  border="none"
                  boxShadow="none"
                  borderRadius="none"
                  _active={{
                    border: 'none'
                  }}
                  _placeholder={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: '20px',
                    letterSpacing: '-0.003em',
                    color: '#9A9DA2'
                  }}
                />{' '}
                <InputRightElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  <Box
                    fontSize={'sm'}
                    color={'black'}
                    padding="2px 6px"
                    background="#F1F2F3"
                    borderRadius="5px"
                  >
                    /hr
                  </Box>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <HStack
              display={'flex'}
              fontSize="sm"
              alignItems="baseline"
              fontWeight="500"
            >
              <Text color={'#6E7682'}>Shepherd charges a</Text>
              <Text color="#207DF7">
                {rate}% service fee (-${cost.toFixed(2)}/hr)
              </Text>
            </HStack>
            <FormControl>
              <FormLabel
                fontStyle="normal"
                fontWeight={500}
                fontSize={14}
                lineHeight="20px"
                letterSpacing="-0.001em"
                color="#5C5F64"
              >
                You'll get
              </FormLabel>
              <InputGroup
                bg="#F1F2F3"
                _active={{
                  border: '1px solid #207df7'
                }}
                border="1px solid #E4E5E7"
                boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                borderRadius="6px"
              >
                <InputLeftElement
                  pointerEvents="none"
                  color="black"
                  fontSize="14px"
                  children="$"
                />
                <Input
                  type="text"
                  value={tutorEarnings}
                  isDisabled
                  bg="#F5F6F7"
                  marginLeft={'30px'}
                  border="1px solid #E4E5E7"
                  borderRadius="6px"
                  _placeholder={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: '20px',
                    letterSpacing: '-0.003em',
                    color: '#9A9DA2'
                  }}
                />
                <InputRightElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  <Box
                    fontSize={'sm'}
                    color={'black'}
                    padding="2px 6px"
                    background="#F1F2F3"
                    borderRadius="5px"
                  >
                    /hr
                  </Box>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
        </Box>
      </CustomModal>
      <CustomModal
        isOpen={isUpdateSubjectModalOpen}
        modalTitle="Update Subject"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              onClick={() => {
                const coursesAndLevels = subjectLevel.map((courseLevel) => ({
                  course: courseList.find(
                    (course) => course.label === courseLevel.course.label
                  )?._id,
                  level: levels.find(
                    (level) => level.label === courseLevel.level.label
                  )?._id
                }));
                handleUpdateTutor('coursesAndLevels', coursesAndLevels);
              }}
            >
              Update
            </Button>
          </div>
        }
        onClose={closeUpdateSubjectModal}
      >
        <Box overflowY={'scroll'} p={3}>
          <AddSubjectLevel
            subjectLevels={subjectLevel}
            addSubject={addSubject}
            removeSubject={removeSubject}
            handleLevelChange={handleLevelChange}
            handleSubjectChange={handleSubjectChange}
          />
        </Box>
      </CustomModal>
      <CustomModal
        isOpen={isUpdateQualificationsModalOpen}
        modalTitle="Update Qualifications"
        isModalCloseButton
        style={{
          maxWidth: '600px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              onClick={() =>
                handleUpdateTutor('qualifications', qualifications)
              }
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>
        }
        onClose={closeUpdateQualificationsModal}
      >
        <Box overflowY={'scroll'} p={3} w="full">
          {' '}
          <QualificationsEditForm updateQualifications={updateQualifications} />
        </Box>
      </CustomModal>
    </Box>
  );
}

export default MyProfile;
