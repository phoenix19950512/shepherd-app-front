import React, {
  useRef,
  useState,
  ChangeEvent,
  useEffect,
  RefObject
} from 'react';
import { useNavigate } from 'react-router';
import { database, storage } from '../../../firebase';
import { ref as dbRef, onValue, off, DataSnapshot } from 'firebase/database';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import timezones from '../../OnboardTutor/components/steps/timezones';
import {
  Grid,
  Box,
  Divider,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Flex,
  FormControl,
  Image,
  Text,
  Input,
  Button,
  Heading,
  UnorderedList,
  ListItem,
  Icon,
  useToast,
  useDisclosure,
  Spacer,
  List,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Link,
  HStack
} from '@chakra-ui/react';
import Select from 'react-select';
import { format, isBefore } from 'date-fns';
import { StudyPlanJob, StudyPlanWeek } from '../../../types';
import Logo from '../../../components/Logo';
import {
  FaPlus,
  FaCheckCircle,
  FaPencilAlt,
  FaRocket,
  FaTrashAlt,
  FaFileAlt,
  FaFileMedical,
  FaFileVideo,
  FaVideo
} from 'react-icons/fa';
import SelectComponent, { Option } from '../../../components/Select';
import { MdCancel, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';
import { generateStudyPlan } from '../../../services/AI';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderScreen from '../FlashCards/forms/flashcard_setup/loader_page';
import LoaderPage from '../../../components/LoaderPage';
import DatePicker from '../../../components/DatePicker';
import resourceStore from '../../../state/resourceStore';
import StudyPlans from '.';
import moment from 'moment';
import { GiCancel } from 'react-icons/gi';
import { AttachmentIcon, CloseIcon, SmallCloseIcon } from '@chakra-ui/icons';
import ApiService from '../../../services/ApiService';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import userStore from '../../../state/userStore';
import styled from 'styled-components';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import uploadFile, { snip } from '../../../helpers/file.helpers';
import CalendarDateInput from '../../../components/CalendarDateInput';
import { ReactSortable } from 'react-sortablejs';
import { NullComponent } from 'stream-chat-react';
import CustomSelect from '../../../components/CustomSelect';
import SyllabusForm from './components/studyPlanner';
import StudyPlanner from './components/studyPlanner';
import PlanReviewer from './components/planReviewer';

const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #585f68;
`;

const PDFTextContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;
interface ItemType {
  id: number;
  name: string;
}
function CreateStudyPlans() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [course, setCourse] = useState('');
  const [planName, setPlanName] = useState('');
  const [syllabusUrl, setSyllabusUrl] = useState('');
  const [topicUrls, setTopicUrls] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [testDate, setTestDate] = useState<any[]>([]);
  const [unassignedTopics, setUnassignedTopics] = useState<any[]>([
    // {
    //   mainTopic: 'Introduction to Music Fundamentals',
    //   subTopics: ['Notation', 'Rhythms', 'Scales', 'Intervals']
    // },
    // {
    //   mainTopic: 'Music Theory: Basics',
    //   subTopics: ['Major and Minor Scales', 'Circle of Fifths']
    // },
    // {
    //   mainTopic: 'Ear Training',
    //   subTopics: ['Interval Recognition', 'Solfège']
    // }
  ]);
  const today = moment();

  const [timezone, setTimezone] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syllabusData, setSyllabusData] = useState([]);
  const [studyPlanData, setStudyPlanData] = useState([]);
  const { courses: courseList, levels: levelOptions } = resourceStore();

  const {
    user,
    fetchUserDocuments,
    hasActiveSubscription,
    fileSizeLimitMB,
    fileSizeLimitBytes
  } = userStore();

  const btnRef = useRef();
  const toast = useCustomToast();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard');

  const handleToggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  function createSyllabusWeek() {
    // Find the highest weekNumber currently in syllabusData
    const maxWeekNumber = syllabusData.reduce(
      (max, week) => Math.max(max, week.weekNumber),
      0
    );

    // Auto-increment weekNumber for the new week
    const weekNumber = maxWeekNumber + 1;

    // Create the new week object
    const week = {
      learningObjectives: [],
      readingMaterials: [],
      topics: [
        {
          mainTopic: `Topic ${weekNumber}`,
          subTopics: ['sub-topic']
        }
      ],
      weekNumber: weekNumber
    };
    setSyllabusData([...syllabusData, week]);

    return week;
  }
  //non
  function updateWeekProperties(weekNumber, updatedProperties) {
    const weekIndex = syllabusData.findIndex(
      (week) => week.weekNumber === weekNumber
    );
    if (weekIndex !== -1) {
      const weekToUpdate = syllabusData[weekIndex];
      // Update properties
      Object.keys(updatedProperties).forEach((key) => {
        if (key === 'topics') {
          weekToUpdate.topics[0].mainTopic =
            updatedProperties[key].mainTopic ||
            weekToUpdate.topics[0].mainTopic;
          weekToUpdate.topics[0].subTopics =
            updatedProperties[key].subTopics ||
            weekToUpdate.topics[0].subTopics;
        } else {
          weekToUpdate[key] = updatedProperties[key];
        }
      });
      syllabusData[weekIndex] = weekToUpdate;
    } else {
      // console.log(`Week ${weekNumber} not found.`);
    }
  }
  const updateMainTopic = (index, newMainTopic) => {
    const updatedSyllabusData = [...syllabusData];

    if (index >= 0 && index < updatedSyllabusData.length) {
      updatedSyllabusData[index] = {
        ...updatedSyllabusData[index],
        topics: [
          {
            ...updatedSyllabusData[index].topics[0],
            mainTopic: newMainTopic
          }
        ]
      };

      setSyllabusData(updatedSyllabusData);
    }
  };
  const deleteMainTopic = (index) => {
    // Delete the topic at the specified index
    const updatedSyllabusData = syllabusData.filter((_, i) => i !== index);

    // Reorder the week numbers
    const reorderedSyllabusData = updatedSyllabusData.map((week, i) => {
      // Increment the weekNumber for weeks after the deleted index
      if (week.weekNumber > index + 1) {
        return { ...week, weekNumber: i + 1 };
      }
      return week;
    });

    setSyllabusData(reorderedSyllabusData);
  };

  const addSubTopic = (weekIndex, newSubTopic) => {
    const updatedSyllabusData = [...syllabusData];
    if (weekIndex >= 0 && weekIndex <= updatedSyllabusData.length) {
      const mainTopic = updatedSyllabusData[weekIndex].topics[0];
      mainTopic.subTopics.push(newSubTopic);
      setSyllabusData(updatedSyllabusData);
    }
  };
  const updateSubTopic = (weekIndex, subTopicIndex, newSubTopic) => {
    const updatedSyllabusData = [...syllabusData];

    if (weekIndex >= 0 && weekIndex <= updatedSyllabusData.length) {
      const mainTopic = updatedSyllabusData[weekIndex].topics[0];

      if (subTopicIndex >= 0 && subTopicIndex < mainTopic.subTopics.length) {
        mainTopic.subTopics[subTopicIndex] = newSubTopic;
        setSyllabusData(updatedSyllabusData);
      }
    }
  };

  const deleteSubTopic = (weekIndex, subTopicIndex) => {
    const updatedSyllabusData = [...syllabusData];
    if (weekIndex >= 0 && weekIndex <= updatedSyllabusData.length) {
      const mainTopic = updatedSyllabusData[weekIndex].topics[0];

      if (subTopicIndex >= 0 && subTopicIndex < mainTopic.subTopics.length) {
        mainTopic.subTopics.splice(subTopicIndex, 1);
        setSyllabusData(updatedSyllabusData);
      }
    }
  };

  const moveTopic = (fromIndex, toIndex) => {
    const copiedSyllabusData = [...syllabusData];
    const [movedTopic] = copiedSyllabusData.splice(fromIndex, 1);
    copiedSyllabusData.splice(toIndex, 0, movedTopic);
    // Update the state with the new order
    setSyllabusData(copiedSyllabusData);
  };
  const topicRef = useRef(null);

  const updateTopicOrder = (weekIndex, newTopicOrder) => {
    // Create a copy of the studyPlanData array
    const updatedStudyPlanData = [...studyPlanData];
    // Update the order of topics within the specified week
    updatedStudyPlanData[weekIndex].topics = newTopicOrder;
    // Update the state with the new study plan data
    setStudyPlanData(updatedStudyPlanData);
  };
  const saveStudyPlan = async () => {
    setLoading(true);
    const convertedArr = await convertArrays(studyPlanData);

    const payload = {
      course: course,
      title: planName,
      tz: timezone,
      // resourceCount: resourceCount,
      scheduleItems: convertedArr
    };

    try {
      const resp = await ApiService.createStudyPlan(payload);
      if (resp) {
        const response = await resp.json();
        if (resp.status === 201) {
          // setIsCompleted(true);
          setLoading(false);
          toast({
            title: 'Study Plan Created Successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
          const baseUrl = isTutor ? '/dashboard/tutordashboard' : '/dashboard';
          navigate(`${baseUrl}/study-plans/planId=${response.studyPlan.id}  `);
        } else {
          setLoading(false);
          toast({
            title: 'Failed to create study plan, try again',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error: any) {
      setLoading(false);
      return { error: error.message, message: error.message };
    }
  };
  const addTopicToWeek = (weekIndex, newTopic) => {
    const updatedStudyPlan = [...studyPlanData];
    if (weekIndex >= 0 && weekIndex < updatedStudyPlan.length) {
      updatedStudyPlan[weekIndex].topics.push(newTopic);

      setStudyPlanData(updatedStudyPlan); // Update studyPlanData state

      // Remove the added topic from unassignedTopics state, if present
      setUnassignedTopics((prevUnassignedTopics) => {
        const updatedUnassignedTopics = prevUnassignedTopics.filter((topic) => {
          // Your logic to compare the added topic and remove it if found
          // This comparison logic should depend on your topic structure and what uniquely identifies a topic
          // For example, assuming 'mainTopic' is unique, you can compare it:
          return topic.mainTopic !== newTopic.mainTopic;
        });

        return updatedUnassignedTopics;
      });
    }
  };

  const deleteTopicFromWeek = (weekIndex, topicIndex) => {
    const updatedStudyPlan = [...studyPlanData];
    if (
      weekIndex >= 0 &&
      weekIndex < updatedStudyPlan.length &&
      topicIndex >= 0 &&
      topicIndex < updatedStudyPlan[weekIndex].topics.length
    ) {
      const deletedTopic = updatedStudyPlan[weekIndex].topics.splice(
        topicIndex,
        1
      )[0]; // Extract deleted topic

      setStudyPlanData(updatedStudyPlan); // Update studyPlanData state

      setUnassignedTopics((prevUnassignedTopics) => [
        ...prevUnassignedTopics,
        deletedTopic
      ]); // Add deleted topic to unassignedTopics state
    }
  };

  const uploadFilesAndGetUrls = async (files) => {
    const downloadUrls = [];

    // Create an array to hold upload promises
    const uploadPromises = [];

    // Iterate through the array of files
    for (const file of files) {
      if (!file) continue;

      // Check if the file size exceeds the limit
      if (file.size > fileSizeLimitBytes * 3) {
        toast({
          title: 'Please upload a file under 10MB',
          status: 'error',
          position: 'top',
          isClosable: true
        });
        continue;
      }

      const readableFileName = file.name
        .toLowerCase()
        .replace(/\.pdf$/, '')
        .replace(/_/g, ' ');

      // Create a promise for each file upload
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadEmitter = uploadFile(file, {
          studentID: user._id,
          documentID: readableFileName
        });

        uploadEmitter.on('complete', (uploadFile) => {
          // Assuming uploadFile contains the fileUrl and other necessary details.
          const documentURL = uploadFile.fileUrl;

          downloadUrls.push(documentURL);
          resolve(null); // Resolve the promise once the upload is complete
        });

        uploadEmitter.on('error', (error) => {
          reject(error); // Reject the promise if there is an error
        });
      });

      // Add the promise to the array
      uploadPromises.push(uploadPromise);
    }

    // Wait for all upload promises to resolve
    try {
      await Promise.all(uploadPromises);
      return downloadUrls;
    } catch (error) {
      // Handle any errors that occurred during uploads
      toast({ title: error.message + error.cause, status: 'error' });
      return []; // Return an empty array in case of errors
    }
  };

  const convertArrays = async (A) => {
    function formatDate(dateString) {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }

    const convertedTopics = await Promise.all(
      A.map(async (week, index) => {
        const dates = week.weekRange.split(' - ');
        const startDate = formatDate(dates[0]);
        const endDate = formatDate(dates[1]);
        const testDate = endDate;

        const topics = await Promise.all(
          week.topics.map(async (topic) => {
            const { mainTopic, subTopics, topicUrls } = topic;

            let subTopicDetails = [];
            if (subTopics) {
              subTopicDetails = subTopics.map((subTopic) => ({
                label: subTopic,
                description: `Description for ${subTopic}`
              }));
            } else {
              subTopicDetails.push({
                label: mainTopic,
                description: `Description for ${mainTopic}`
              });
            }

            const documentUrls = await uploadFilesAndGetUrls(topicUrls);

            return {
              topic: {
                label: mainTopic,
                subTopics: subTopicDetails,
                documentUrls,
                testDate
              },
              startDate,
              endDate,
              weekIndex: index + 1,
              status: 'notStarted'
            };
          })
        );

        return topics;
      })
    );

    return convertedTopics.flat();
  };

  const handleUploadTopicFile = (topicIndex, files) => {
    const updatedSyllabusData = [...syllabusData];

    // Check if the topic at the specified indices exists
    if (topicIndex >= 0 && topicIndex < updatedSyllabusData.length) {
      updatedSyllabusData[topicIndex] = {
        ...updatedSyllabusData[topicIndex],
        topics: [
          {
            ...updatedSyllabusData[topicIndex].topics[0],
            topicUrls: updatedSyllabusData[topicIndex].topics[0].topicUrls
              ? [...updatedSyllabusData[topicIndex].topics[0].topicUrls, files]
              : [files]
          }
        ]
      };

      // Update the state with the modified data
      setSyllabusData(updatedSyllabusData);
    }
  };

  const handleRemoveFile = (topicIndex, fileIndex) => {
    const updatedSyllabusData = [...syllabusData];

    // Check if the topic at the specified indices exists
    if (
      topicIndex >= 0 &&
      topicIndex < updatedSyllabusData.length &&
      updatedSyllabusData[topicIndex].topics[0].topicUrls &&
      fileIndex >= 0 &&
      fileIndex < updatedSyllabusData[topicIndex].topics[0].topicUrls.length
    ) {
      // Remove the file at the specified index from the 'topicUrls' array
      updatedSyllabusData[topicIndex].topics[0].topicUrls.splice(fileIndex, 1);

      // Update the state with the modified data
      setSyllabusData(updatedSyllabusData);
    }
  };

  useEffect(() => {
    const item = localStorage.getItem('create course');

    if (item) {
      setCourse(item);
      localStorage.removeItem('create course');
    }
  }, []);

  return (
    <Grid
      templateColumns={[
        '35% 45% 20%',
        '35% 45% 20%',
        '35% 45% 20%',
        '35% 45% 20%'
      ]}
      h="90vh"
      w="100%"
      maxW="100vw"
      overflowX="hidden"
      //   p={10}
    >
      <StudyPlanner
        activeTab={activeTab}
        course={course}
        setCourse={setCourse}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        planName={planName}
        setPlanName={setPlanName}
        testDate={testDate}
        setTestDate={setTestDate}
        syllabusData={syllabusData}
        setSyllabusData={setSyllabusData}
        setStudyPlanData={setStudyPlanData}
        timezone={timezone}
        setTimezone={setTimezone}
      />
      {/* <DndProvider backend={HTML5Backend}> */}{' '}
      <PlanReviewer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        syllabusData={syllabusData}
        studyPlanData={studyPlanData}
        saveStudyPlan={saveStudyPlan}
        loading={loading}
        setLoading={setLoading}
        course={course}
        setSyllabusData={setSyllabusData}
        setStudyPlanData={setStudyPlanData}
      />
      {/* </DndProvider> */}
      <Box py={8} className="select-syllabus" bg="white" overflowY="auto">
        <Flex
          align="center"
          mb={2}
          onClick={handleToggleSubjects}
          color="text.400"
          cursor="pointer"
          py={2}
          px={5}
          _hover={{ bg: 'gray.100' }}
        >
          <Text fontSize={'16px'} fontWeight="500">
            {planName}
          </Text>
          {/* <Spacer />
          <FiChevronDown /> */}
        </Flex>
        {/* <List spacing={3}>
          {showSubjects &&
            subjectOptions.map((subject, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setSelectedSubject(subject.value);
                  onClose();
                }}
                cursor="pointer"
                py={2}
                fontSize="14px"
                color="text.400"
                _hover={{ bg: '#F2F2F3', color: 'text.200' }}
                bg={selectedSubject === subject.value ? 'gray.200' : 'inherit'}
              >
                <Text px={5}>{subject.value}</Text>
              </ListItem>
            ))}
        </List> */}
      </Box>
    </Grid>
  );
}

export default CreateStudyPlans;
