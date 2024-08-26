import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Divider,
  Center,
  Spacer,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormLabel
} from '@chakra-ui/react';
import Select from 'react-select';

import { FaFileMedical, FaRocket, FaPlus } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import CalendarDateInput from '../../../../components/CalendarDateInput';
import { FiChevronDown } from 'react-icons/fi';
import { AttachmentIcon } from '@chakra-ui/icons';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import moment from 'moment';
import styled from 'styled-components';
import userStore from '../../../../state/userStore';
import resourceStore from '../../../../state/resourceStore';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import uploadFile from '../../../../helpers/file.helpers';
import { StudyPlanJob, StudyPlanWeek } from '../../../../types';
import { ref as dbRef, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from '../../../../firebase';
import { generateStudyPlan } from '../../../../services/AI';
const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #585f68;
`;

const PDFTextContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;
const StudyPlanner = ({
  activeTab,
  course,
  setCourse,
  timezone,
  setTimezone,
  isLoading,
  setIsLoading,
  planName,
  setPlanName,
  testDate,
  setTestDate,
  setStudyPlanData,
  syllabusData,
  setSyllabusData
}) => {
  const [tzOptions, setTzOptions] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [syllabusUrl, setSyllabusUrl] = useState('');

  const [resourceCount, setResourceCount] = useState<any>(10);
  const [gradeLevel, setGradeLevel] = useState('');
  const { courses: courseList, levels: levelOptions } = resourceStore();
  const { user, fetchUserDocuments } = userStore();
  const [fileName, setFileName] = useState('');
  const { hasActiveSubscription, fileSizeLimitMB, fileSizeLimitBytes } =
    userStore.getState();
  const toast = useCustomToast();
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
        setSyllabusUrl(documentURL);
      });
      uploadEmitter.on('error', (error) => {
        setDocLoading(false);
        // setCvUploadPercent(0);
        toast({ title: error.message + error.cause, status: 'error' });
      });
    }
  };

  const addTestDate = () => {
    const lastTestDate = testDate[testDate.length - 1];

    const today = moment().startOf('day');

    const newTestDate = lastTestDate
      ? moment(lastTestDate).add(1, 'days')
      : today;
    setTestDate([...testDate, '']);
  };
  const removeTestDate = (indexToRemove) => {
    const updatedTestDates = [...testDate];
    updatedTestDates.splice(indexToRemove, 1);
    setTestDate(updatedTestDates);
  };

  const getStudyPlan = async (startDate, testDates, syllabusData) => {
    const studyPlan = [];
    let currentStartDate = moment(startDate, 'MM/DD/YYYY');
    let topicsRemaining = syllabusData.slice();
    let i = 0;

    const getLastMoment = (date) =>
      moment.max(moment(date, 'MM/DD/YYYY'), moment());

    while (i < testDates.length) {
      const currentEndDate =
        i === testDates.length - 1
          ? getLastMoment(testDates[i])
          : moment(testDates[i], 'MM/DD/YYYY');

      const daysAvailable = currentEndDate.diff(currentStartDate, 'days') + 1;
      const daysUntilNextTest =
        i < testDates.length - 1
          ? moment(testDates[i + 1], 'MM/DD/YYYY').diff(currentEndDate, 'days')
          : 0;

      let topicsThisPeriod = Math.floor(
        (daysAvailable / (daysAvailable + daysUntilNextTest)) *
          topicsRemaining.length
      );
      topicsThisPeriod = Math.max(topicsThisPeriod, 1); // Ensure at least 1 topic per period

      if (topicsRemaining.length === 0 && i < testDates.length - 1) {
        // If no more topics and still have test dates, create an empty study week
        const studyWeek = {
          weekRange: `${currentStartDate.format(
            'MM/DD/YYYY'
          )} - ${currentEndDate.format('MM/DD/YYYY')}`,
          topics: []
        };

        studyPlan.push(studyWeek);
      } else if (topicsRemaining.length > 0) {
        const topics = topicsRemaining.slice(0, topicsThisPeriod);
        topicsRemaining = topicsRemaining.slice(topicsThisPeriod);

        const studyWeek = {
          weekRange: `${currentStartDate.format(
            'MM/DD/YYYY'
          )} - ${currentEndDate.format('MM/DD/YYYY')}`,
          topics: topics.map((topic) => ({
            mainTopic: topic.topics[0].mainTopic,
            subTopics: topic.topics[0].subTopics,
            topicUrls: topic.topics[0].topicUrls
              ? topic.topics[0].topicUrls
              : []
          }))
        };

        studyPlan.push(studyWeek);
      }

      currentStartDate = currentEndDate.clone().add(1, 'day');
      i++;
    }

    setStudyPlanData(studyPlan);
    return studyPlan;
  };
  const getStudyPlanJob = (
    jobId: string,
    callback: (error: Error | null, studyPlan?: StudyPlanWeek[]) => void
  ) => {
    const jobRef = dbRef(database, `/syllabus-process-job/${jobId}`);

    const unsubscribe = onValue(
      jobRef,
      (snapshot: DataSnapshot) => {
        const job: StudyPlanJob | null = snapshot.val();

        // If the job exists and its status is 'success', pass the study plan to the callback.
        if (job && job.status === 'success' && job.studyPlan) {
          callback(null, job.studyPlan);
          off(jobRef); // Stop listening for changes once the job is successfully retrieved.
        } else if (job && job.status === 'failed') {
          callback(new Error('Job failed'));
          off(jobRef);
        }
      },
      (error) => {
        callback(error);
      }
    );

    return unsubscribe;
  };

  const handleGenerateSyllabus = async () => {
    setIsLoading(true);

    try {
      const payload = {};

      if (syllabusUrl && syllabusUrl.trim() !== '') {
        payload['syllabusUrl'] = syllabusUrl;
      } else {
        payload['syllabusData'] = {
          course: course,
          gradeLevel: gradeLevel,
          weekCount: 15
        };
      }

      const response = await generateStudyPlan(payload);

      if (response) {
        const jobId = response.jobId;

        getStudyPlanJob(jobId, (error, studyPlan) => {
          if (error) {
            toast({
              title: `Error fetching study plan: ${error.message}`,
              position: 'top-right',
              status: 'error',
              isClosable: true
            });
          } else if (studyPlan) {
            setSyllabusData(studyPlan);
            // setSelectedSubject(course);
          } else {
            toast({
              title: 'No study plan available yet. Please try again later.',
              position: 'top-right',
              status: 'warning',
              isClosable: true
            });
          }
          setIsLoading(false);
        });
      } else {
        toast({
          title: 'Unable to process this request. Please try again later.',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: `${error}`,
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };
  const handleCreateSyllabus = () => {
    createSyllabusWeek();
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
  return (
    <Box
      py={2}
      px={4}
      className="create-syllabus custom-scroll"
      bg="white"
      overflowY="auto"
    >
      <Box borderRadius={8} bg="#F7F7F7" p={18} mb={3}>
        {' '}
        <Flex alignItems="center" gap={1}>
          <Box boxSize={12} rounded="full" overflow="hidden" bg="#287ce6">
            {/* <Logo /> */}
          </Box>
          <Box>
            <Text fontWeight="500" fontSize={'16px'}>
              Shepherd
            </Text>
            <Text fontSize="sm" color="gray.600">
              Study Planner
            </Text>
          </Box>
        </Flex>
        <Text fontSize="13px" my={2}>
          {user.school
            ? `Let's get you ready for your learning journey. Just provide a subject or syllabus, and we'll create a tailored study schedule with resources and reminders to make your learning efficient and effective. provide checkpoint dates so we can use that to structure your schedule.`
            : ` Let's get you ready for test day. Just provide a subject or
        syllabus, and we'll create a tailored study schedule with resources
        and reminders to make your learning efficient and effective.`}
        </Text>
      </Box>
      {activeTab === 0 ? (
        <Box py={2}>
          <Box>
            <Text as="label" htmlFor="planName" mb={2} display="block">
              Name your Study Plan
            </Text>
            <Input
              type="text"
              id="planName"
              placeholder={'e.g. Chemistry, Spring 2023'}
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              borderWidth="1px"
              rounded="md"
              py={2}
              px={3}
              mb={2}
            />
          </Box>
          <Box my={2}>
            <Text as="label" htmlFor="gradeLevel" mb={2} display="block">
              Enter your grade level
            </Text>

            <FormControl mb={4}>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  borderRadius="8px"
                  fontSize="0.875rem"
                  fontFamily="Inter"
                  color="#212224"
                  fontWeight="400"
                  width="100%"
                  height="42px"
                  textAlign="left"
                >
                  {gradeLevel}
                </MenuButton>
                <MenuList minWidth={'auto'}>
                  {levelOptions.map((level) => (
                    <MenuItem
                      fontSize="0.875rem"
                      key={level._id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setGradeLevel(level.label)}
                    >
                      {level.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
          </Box>
          <Box>
            <Text as="label" htmlFor="subjects" mb={2} display="block">
              What subject would you like to generate a plan for
            </Text>
            <Input
              type="text"
              id="subjects"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              borderWidth="1px"
              rounded="md"
              py={2}
              px={3}
              mb={2}
            />
          </Box>
          {/* <Center my={2}>or</Center> */}
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
              <Center flexDirection="column">
                {fileName ? (
                  <Flex>
                    <AttachmentIcon /> <FileName>{fileName}</FileName>
                  </Flex>
                ) : (
                  <Flex direction={'column'} alignItems={'center'}>
                    <RiUploadCloud2Fill className="h-8 w-8" color="gray.500" />
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
              onChange={(e) => handleUploadInput(e.target.files[0])}
            />
          </Center>
          <Flex direction={'row'} gap={1}>
            <Button
              color="#207df7"
              variant="outline"
              borderColor={'#207df7'}
              py={2}
              px={4}
              mb={2}
              fontSize={13}
              rounded="md"
              display="inline-flex"
              alignItems="center"
              onClick={handleCreateSyllabus}
              isDisabled={!planName || !gradeLevel || !course || isLoading}
            >
              <Icon as={FaFileMedical} mr={2} />
              Manually Create Syllabus
            </Button>
            <Spacer />{' '}
            <Button
              colorScheme="blue"
              variant="solid"
              py={2}
              px={4}
              mb={2}
              fontSize={13}
              rounded="md"
              display="inline-flex"
              alignItems="center"
              onClick={handleGenerateSyllabus}
              isDisabled={!planName || !gradeLevel || !course || isLoading}
            >
              <Icon as={FaRocket} mr={2} />
              Auto-generate Syllabus
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box>
          {' '}
          <Text
            as="label"
            htmlFor="subjects"
            mb={2}
            display="block"
            fontWeight={'semibold'}
          >
            {user.school ? 'Enter Checkpoint dates' : 'Enter your test dates'}
          </Text>
          <Flex direction={'column'} gap={2}>
            {testDate &&
              testDate.map((date, index) => (
                <Box key={index}>
                  <Text
                    as="label"
                    htmlFor="subjects"
                    mb={1}
                    display="block"
                    fontWeight={'semibold'}
                    color="#207df7"
                  >
                    {`${user.school ? 'Checkpoint' : 'Test'}  ${index + 1}`}
                  </Text>
                  <Flex align={'center'} gap={2}>
                    {/* <DatePicker
                    name={`testDate-${index}`}
                    placeholder="Select Test Date"
                    value={format(date, 'MM-dd-yyyy')}
                    onChange={(newDate) => {
                      const updatedTestDates = [...testDate];
                      updatedTestDates[index] = newDate;
                      setTestDate(updatedTestDates);
                    }}
                  /> */}
                    <CalendarDateInput
                      // disabledDate={{ before: today }}
                      inputProps={{
                        placeholder: `Select ${
                          user.school ? 'Checkpoint' : 'Test Date'
                        } 
                   `
                      }}
                      value={date}
                      onChange={(value) => {
                        const updatedTestDates = [...testDate];
                        updatedTestDates[index] = value;

                        if (
                          index > 0 &&
                          moment(value).isBefore(testDate[index - 1])
                        ) {
                          toast({
                            title:
                              'Test date cannot be before the previous test date',
                            status: 'error',
                            position: 'top',
                            isClosable: true
                          });

                          return;
                        }

                        setTestDate(updatedTestDates);
                      }}
                    />{' '}
                    <MdCancel
                      onClick={() => removeTestDate(index)}
                      color={'gray'}
                    />
                  </Flex>
                </Box>
              ))}
          </Flex>
          <Button
            colorScheme="blue"
            variant="link"
            display="flex"
            alignItems="center"
            onClick={addTestDate}
            my={2}
          >
            <Icon as={FaPlus} mr={2} />
            Add Date
          </Button>{' '}
          <Select
            value={tzOptions.find((option) => option.value === timezone)}
            onChange={(selectedOption) => setTimezone(selectedOption.value)}
            options={tzOptions}
            placeholder={'Select Timezone'}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            className="my-4"
            // styles={customStyles}
          />
          <FormLabel>Number of resources to generate per topic</FormLabel>
          <NumberInput
            defaultValue={resourceCount}
            min={10}
            max={20}
            onChange={(e) => setResourceCount(e)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button
            colorScheme="blue"
            variant="solid"
            py={2}
            px={4}
            rounded="md"
            // display="inline-flex"
            float={'right'}
            alignItems="center"
            onClick={() =>
              getStudyPlan(
                moment().format('MM/DD/YYYY'),
                testDate.map((date) => moment(date).format('MM/DD/YYYY')),
                syllabusData
              )
            }
            my={4}
            isDisabled={
              testDate.length < 1 ||
              !testDate.every((date) =>
                moment(date, 'MM/DD/YYYY', true).isValid()
              ) ||
              !timezone
            }
          >
            <Icon as={FaRocket} mr={2} />
            Generate Study Plan
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default StudyPlanner;
