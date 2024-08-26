import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Flex,
  Button,
  Icon,
  Divider,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
  ListItem,
  UnorderedList,
  HStack
} from '@chakra-ui/react';
import {
  FaFileAlt,
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaVideo
} from 'react-icons/fa';
import { CloseIcon, SmallCloseIcon } from '@chakra-ui/icons';
import LoaderPage from '../../../../components/LoaderPage';
import userStore from '../../../../state/userStore';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import uploadFile from '../../../../helpers/file.helpers';
import ApiService from '../../../../services/ApiService';
import { ReactSortable } from 'react-sortablejs';
import { Link, useNavigate } from 'react-router-dom';

const PlanReviewer = ({
  activeTab,
  setActiveTab,
  syllabusData,
  setSyllabusData,
  studyPlanData,
  setStudyPlanData,
  course,
  saveStudyPlan,
  loading,
  setLoading,
  isLoading,
  setIsLoading
}) => {
  const [unassignedTopics, setUnassignedTopics] = useState<any[]>([]);
  const [topicUrls, setTopicUrls] = useState([]);

  const { hasActiveSubscription, fileSizeLimitMB, fileSizeLimitBytes } =
    userStore.getState();
  const { user } = userStore();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard');
  const toast = useCustomToast();

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
  const updateTopicOrder = (weekIndex, newTopicOrder) => {
    // Create a copy of the studyPlanData array
    const updatedStudyPlanData = [...studyPlanData];
    // Update the order of topics within the specified week
    updatedStudyPlanData[weekIndex].topics = newTopicOrder;
    // Update the state with the new study plan data
    setStudyPlanData(updatedStudyPlanData);
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

  //   const saveStudyPlan = async () => {
  //     setLoading(true);
  //     const convertedArr = await convertArrays(studyPlanData);

  //     const payload = {
  //       course: course,
  //       title: planName,
  //       tz: timezone,
  //       // resourceCount: resourceCount,
  //       scheduleItems: convertedArr
  //     };

  //     try {
  //       const resp = await ApiService.createStudyPlan(payload);
  //       if (resp) {
  //         const response = await resp.json();
  //         if (resp.status === 201) {
  //           // setIsCompleted(true);
  //           setLoading(false);
  //           toast({
  //             title: 'Study Plan Created Successfully',
  //             position: 'top-right',
  //             status: 'success',
  //             isClosable: true
  //           });
  //           const baseUrl = isTutor ? '/dashboard/tutordashboard' : '/dashboard';
  //           navigate(`${baseUrl}/study-plans/planId=${response.studyPlan.id}  `);
  //         } else {
  //           setLoading(false);
  //           toast({
  //             title: 'Failed to create study plan, try again',
  //             position: 'top-right',
  //             status: 'error',
  //             isClosable: true
  //           });
  //         }
  //       }
  //     } catch (error: any) {
  //       setLoading(false);
  //       return { error: error.message, message: error.message };
  //     }
  //   };
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
  return (
    <Box p={10} className="review-syllabus" bg="#F9F9FB" overflowY="scroll">
      <Tabs
        variant="soft-rounded"
        color="#F9F9FB"
        index={activeTab}
        onChange={(index) => setActiveTab(index)}
      >
        <TabList mb="1em">
          <Tab>Syllabus</Tab>
          <Tab>Study Plan</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box>
              {isLoading ? (
                <LoaderPage
                  module={'Syllabus'}
                  handleCancel={() => setIsLoading(false)}
                />
              ) : syllabusData.length > 0 ? (
                <Box mb={6} position="relative">
                  <Text
                    fontSize="16px"
                    fontWeight="semibold"
                    mb={2}
                    color="text.200"
                  >
                    Review {course} syllabus
                  </Text>
                  <ReactSortable
                    filter=".addImageButtonContainer"
                    dragClass="sortableDrag"
                    ghostClass="draggedGhost"
                    list={syllabusData}
                    setList={setSyllabusData}
                    animation="500"
                    easing="ease-out"
                  >
                    {syllabusData.map((topic, topicIndex) => (
                      <Box
                        key={topicIndex}
                        bg="white"
                        p={4}
                        my={2}
                        rounded="md"
                        shadow="md"
                        className="draggableItem"
                      >
                        {topic.topics && (
                          <>
                            <Editable
                              value={topic?.topics[0]?.mainTopic}
                              fontSize="16px"
                              fontWeight="500"
                              mb={2}
                              color="text.300"
                              // onBlur={(e) => {
                              //   console.log(e);
                              //   updateMainTopic(index, e);
                              // }}

                              onChange={(e) => updateMainTopic(topicIndex, e)}
                            >
                              <EditablePreview />
                              <Input py={2} px={4} as={EditableInput} />
                            </Editable>
                            <UnorderedList
                              listStyleType="disc"
                              color="gray.700"
                              fontSize={14}
                            >
                              {topic?.topics[0]?.subTopics?.map(
                                (item, subtopicindex) => (
                                  <>
                                    <Flex key={subtopicindex}>
                                      <ListItem>
                                        <Editable
                                          value={item}
                                          // onBlur={(e) => {
                                          //   console.log(e);
                                          //   updateMainTopic(index, e);
                                          // }}

                                          onChange={(e) => {
                                            updateSubTopic(
                                              topicIndex,
                                              subtopicindex,
                                              e
                                            );
                                          }}
                                        >
                                          <EditablePreview />
                                          <Input
                                            as={EditableInput}
                                            size="xs"
                                            // onBlur={(e) => {
                                            //   updateSubTopic(
                                            //     topicIndex,
                                            //     subtopicindex,
                                            //     e.target.value
                                            //   );
                                            //   // updateWeekProperties(topic.weekNumber, {
                                            //   //   topics: e.target.value
                                            //   // });
                                            // }}
                                          />
                                        </Editable>
                                      </ListItem>{' '}
                                      <Spacer />{' '}
                                      <SmallCloseIcon
                                        color={'gray.500'}
                                        onClick={() =>
                                          deleteSubTopic(
                                            topicIndex,
                                            subtopicindex
                                          )
                                        }
                                      />
                                    </Flex>
                                  </>
                                )
                              )}
                            </UnorderedList>
                            <Flex justifyContent={'end'}>
                              <Button
                                colorScheme="blue"
                                variant="link"
                                display="flex"
                                alignItems="center"
                                onClick={() =>
                                  addSubTopic(topicIndex, 'new sub topic')
                                }
                                my={2}
                                fontSize={12}
                              >
                                <Icon as={FaPlus} mr={2} />
                                Add Subtopic
                              </Button>
                            </Flex>{' '}
                            <Divider my={2} />
                            <Flex justify="space-between" gap={1}>
                              {/* <Box color="green.500">
                              <Icon as={FaCheckCircle} />
                            </Box> */}
                              <Flex
                                direction="row"
                                overflowX={'scroll'}
                                className=""
                                mr={'auto'}
                              >
                                {topic?.topics[0]?.topicUrls &&
                                  topic?.topics[0]?.topicUrls.map(
                                    (file, index) => (
                                      <>
                                        <Flex
                                          fontSize={10}
                                          color="gray.700"
                                          alignItems={'center'}
                                          gap={1}
                                          whiteSpace="nowrap"
                                        >
                                          <Text>{`${
                                            file.name?.length > 10
                                              ? `${file.name.slice(0, 10)}...`
                                              : file.name
                                          } `}</Text>
                                          <CloseIcon
                                            boxSize={1.5}
                                            onClick={(e) =>
                                              handleRemoveFile(index, index)
                                            }
                                          />
                                          {index !== topicUrls.length - 1 &&
                                            `,`}
                                        </Flex>
                                      </>
                                    )
                                  )}
                              </Flex>
                              <HStack color="gray.500" spacing={3}>
                                <label htmlFor={`videoInput-${topicIndex}`}>
                                  <Icon as={FaVideo} boxSize={3} />
                                </label>
                                <input
                                  type="file"
                                  id={`videoInput-${topicIndex}`}
                                  accept="video/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) =>
                                    handleUploadTopicFile(
                                      topicIndex,
                                      e.target.files[0]
                                    )
                                  }
                                />
                                <label htmlFor={`fileInput-${topicIndex}`}>
                                  <Icon as={FaFileAlt} boxSize={3} />
                                </label>
                                <input
                                  type="file"
                                  id={`fileInput-${topicIndex}`}
                                  style={{ display: 'none' }}
                                  onChange={(e) =>
                                    handleUploadTopicFile(
                                      topicIndex,
                                      e.target.files[0]
                                    )
                                  }
                                />

                                <Icon
                                  as={FaTrashAlt}
                                  boxSize={3}
                                  onClick={() => deleteMainTopic(topicIndex)}
                                />
                              </HStack>
                            </Flex>
                          </>
                        )}
                      </Box>
                    ))}
                  </ReactSortable>

                  <Flex alignItems={'center'} mt={7}>
                    <Button
                      color="gray"
                      variant="link"
                      display="flex"
                      alignItems="center"
                      onClick={() => createSyllabusWeek()}
                    >
                      <Icon as={FaPlus} mr={2} />
                      Add Topic
                    </Button>{' '}
                    <Spacer />
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      display="flex"
                      justifyContent={'space-between'}
                      py={2}
                      px={14}
                      rounded="md"
                      alignItems="center"
                      textAlign={'center'}
                      ml={'auto'}
                      onClick={() => setActiveTab(1)}
                    >
                      Proceed
                    </Button>
                  </Flex>
                </Box>
              ) : (
                <section className="flex justify-center items-center mt-28 w-full">
                  <div className="text-center">
                    <img src="/images/notes.png" alt="" />
                    <Text color="#000000" fontSize={12}>
                      Looks like you haven't created a syllabus yet
                    </Text>
                  </div>
                </section>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Flex direction="column" gap={2}>
                {studyPlanData.length > 0 ? (
                  <>
                    {' '}
                    {studyPlanData.map((topic, weekindex) => (
                      <>
                        <Box bg="white" p={4} rounded="md" shadow="md">
                          <Text
                            fontSize="14px"
                            fontWeight="500"
                            mb={2}
                            color="text.300"
                          >
                            {topic.weekRange}
                          </Text>

                          <ReactSortable
                            list={topic.topics}
                            setList={(newList) =>
                              updateTopicOrder(weekindex, newList)
                            }
                            animation="500"
                            easing="ease-out"
                          >
                            {/* <UnorderedList
                              listStyleType="circle"
                              listStylePosition="inside"
                              color="gray.700"
                              fontSize={14}
                              // h={'100px'}
                            > */}
                            {topic.topics.map((item, index) => (
                              <Flex key={index} color="#585f68">
                                <Text fontSize={14}>{item.mainTopic}</Text>
                                <Spacer />
                                <SmallCloseIcon
                                  color={'gray.500'}
                                  onClick={() =>
                                    deleteTopicFromWeek(weekindex, index)
                                  }
                                />
                              </Flex>
                            ))}
                            {/* </UnorderedList> */}
                          </ReactSortable>
                          <Divider my={2} />
                          <Flex>
                            <Menu>
                              <MenuButton
                                as={Link}
                                color="gray.500"
                                _hover={{ textDecoration: 'none' }}
                                fontSize={14}
                              >
                                <Icon as={FaPlus} mr={2} />
                                Add Topic
                              </MenuButton>
                              <MenuList color={'gray.500'}>
                                {unassignedTopics.map((item, index) => (
                                  <MenuItem
                                    onClick={() =>
                                      addTopicToWeek(weekindex, item)
                                    }
                                  >
                                    {item.mainTopic}
                                  </MenuItem>
                                ))}
                              </MenuList>
                            </Menu>
                            <Spacer />
                            <Box color="gray.500">
                              <Icon as={FaPencilAlt} />
                            </Box>
                          </Flex>
                        </Box>{' '}
                      </>
                    ))}
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      display="flex"
                      justifyContent={'space-between'}
                      py={2}
                      px={14}
                      rounded="md"
                      alignItems="center"
                      textAlign={'center'}
                      mt={3}
                      ml={'auto'}
                      onClick={() => saveStudyPlan()}
                      isLoading={loading}
                    >
                      Save & Proceed
                    </Button>
                  </>
                ) : (
                  <section className="flex justify-center items-center mt-28 w-full">
                    <div className="text-center">
                      <img src="/images/notes.png" alt="" />
                      <Text color="#000000" fontSize={12}>
                        Enter your test dates to generate a study plan!
                      </Text>
                    </div>
                  </section>
                )}
              </Flex>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PlanReviewer;
