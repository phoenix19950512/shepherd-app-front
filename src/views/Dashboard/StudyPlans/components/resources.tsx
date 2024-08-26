import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Flex,
  Text,
  Center,
  VStack,
  SimpleGrid,
  Spacer,
  Spinner,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Input,
  FormLabel
} from '@chakra-ui/react';
import { BiPlayCircle } from 'react-icons/bi';
import ResourceIcon from '../../../../assets/resources-plan.svg';
import { RepeatIcon } from '@chakra-ui/icons';
import { FaPlus, FaTrash, FaTrashAlt, FaVideo } from 'react-icons/fa';
import StudySessionLogger from '../../../../helpers/sessionLogger';
import { SessionType } from '../../../../types';
import theme from '../../../../theme';

const ResourceModal = ({
  isOpen,
  onClose,
  state,
  updateState,

  findVideoDocumentsByTopic,
  getTopicResource
}) => {
  const [topicId, setTopicId] = useState(false);
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);
  const [isLectureStarted, setIsLectureStarted] = useState(false);
  const [isLectureFinished, setIsLectureFinished] = useState(false);
  const [isAddNewOpened, setIsAddNewOpened] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [articles, setArticles] = useState([
    {
      id: 1,
      link: 'https://towardsdatascience.com/e2e-the-every-purpose-ml-method-5d4f20dafee4',
      title: 'the-every-purpose-ml-method'
    },
    {
      id: 2,
      link: 'https://medium.com/decodingml/learn-an-end-to-end-framework-for-production-ready-llm-systems-by-building-your-llm-twin-12bef5551e64',
      title:
        'learn-an-end-to-end-framework-for-production-ready-llm-systems-by-building-your-llm-twin'
    }
  ]);
  const [notebooks, setNotebooks] = useState([
    {
      id: 1,
      link: 'https://colab.research.google.com/drive/1qQ3lrVxf51ZysySpmwXNvLAXxbMHEqhh',
      title: 'Natural Language Processing Concepts'
    },
    {
      id: 2,
      link: 'https://colab.research.google.com/drive/1ptnC0l1hCUqCeidePyogCeOQK0QO6hrE',
      title: ' Building a YouTube Summarizer with LangChain'
    }
  ]);
  let studySessionLogger: StudySessionLogger | undefined = undefined;

  const isTutor = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );
  const startLecture = (id) => {
    setIsLectureStarted(!isLectureStarted);
    studySessionLogger = new StudySessionLogger(SessionType.LECTURES, id);
    studySessionLogger.start();
  };
  const stopLecture = (id) => {
    setIsLectureStarted(!isLectureStarted);
    studySessionLogger = new StudySessionLogger(SessionType.LECTURES, id);
    studySessionLogger.end();
  };
  useEffect(() => {
    return () => {
      if (studySessionLogger && studySessionLogger.currentState !== 'ENDED') {
        studySessionLogger.end();
      }
    };
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center">
            <ResourceIcon />
            <Text fontSize="16px" fontWeight="500">
              Extra Resources
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        {/* <ModalBody overflowY={'auto'} maxH="600px" flexDirection="column"> */}
        <Tabs px={3} onChange={(index) => setTabIndex(index)}>
          <TabList>
            <Flex w="full" alignItems={'center'} color="gray">
              <Tab _selected={{ color: '#207df7', borderColor: '#207df7' }}>
                Lecture
              </Tab>
              <Tab _selected={{ color: '#207df7', borderColor: '#207df7' }}>
                Articles
              </Tab>
              <Tab _selected={{ color: '#207df7', borderColor: '#207df7' }}>
                Notebooks
              </Tab>
              <Spacer />
              {isTutor &&
                (tabIndex === 0 ? (
                  <>
                    <label htmlFor={`videoInput`}>
                      <Box
                        color="gray"
                        _hover={{
                          borderRadius: 4,
                          cursor: 'pointer',
                          bg: '#edf2f7'
                        }}
                        px={3}
                        py={1}
                        float={'right'}
                        fontSize={12}
                      >
                        <Icon as={FaVideo} mr={2} /> Update Video
                      </Box>
                    </label>
                    <input
                      type="file"
                      id={`videoInput`}
                      accept="video/*"
                      style={{ display: 'none' }}
                      // onChange={(e) =>
                      //   handleUploadTopicFile(topicIndex, e.target.files[0])
                      // }
                    />
                  </>
                ) : (
                  <>
                    <Button
                      color="gray"
                      size={'sm'}
                      variant="ghost"
                      float={'right'}
                      fontSize={12}
                      onClick={() => setIsAddNewOpened(true)}
                    >
                      <Icon as={FaPlus} mr={2} /> Add New
                    </Button>
                  </>
                ))}
            </Flex>
          </TabList>

          <TabPanels>
            <TabPanel>
              <>
                <Box
                  w="full"
                  p={4}
                  bg="white"
                  borderRadius={10}
                  borderWidth="1px"
                  borderColor="#EEEFF1"
                  justifyContent="center"
                  alignItems="center"
                  my={4}
                  overflowY={'auto'}
                >
                  <Flex>
                    {' '}
                    <Text
                      color="#6E7682"
                      fontSize="12px"
                      fontWeight="400"
                      wordBreak={'break-word'}
                      textTransform="uppercase"
                    >
                      Lecture
                    </Text>
                    <Spacer />{' '}
                    {/* {isTutor && (
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={1}
                        _hover={{ cursor: 'pointer' }}
                        cursor="pointer"
                      >
                        <label htmlFor={`videoInput`}>
                          <Icon as={FaVideo} boxSize={3} mx={2} />
                          Update Video
                        </label>
                        <input
                          type="file"
                          id={`videoInput`}
                          accept="video/*"
                          style={{ display: 'none' }}
                          // onChange={(e) =>
                          //   handleUploadTopicFile(topicIndex, e.target.files[0])
                          // }
                        />
                      </Box>
                    )} */}
                  </Flex>

                  <Center position="relative" borderRadius={10} my={2}>
                    <Box
                      h={{ base: '350px', md: '350px' }}
                      w={{ base: 'full', md: 'full' }}
                    >
                      <video
                        title="tutor-video"
                        controls
                        onPlay={() => startLecture(topicId)}
                        onEnded={() => {
                          console.log('ended');
                          stopLecture(topicId);
                        }}
                        style={{
                          borderRadius: 10,
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <source
                          src={
                            findVideoDocumentsByTopic(state.selectedTopic)[0]
                              ?.documentUrl
                          }
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </Box>
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
                        <Text display={'inline'}> play video</Text>
                      </VStack>
                    </Center>
                  </Center>
                </Box>
                {!state.isLoading ? (
                  state.topicResource ? (
                    <Box w="full">
                      <Flex alignItems={'center'} my={2}>
                        <Text
                          fontSize={'17px'}
                          fontWeight="500"
                          px={1}
                          color="#000"
                        >
                          Summary
                        </Text>
                      </Flex>

                      <Box
                        p={4}
                        maxH="350px"
                        overflowY="auto"
                        // borderWidth="1px"
                        // borderRadius="md"
                        // borderColor="gray.200"
                        // boxShadow="md"
                        className="custom-scroll"
                      >
                        <Text lineHeight="6">
                          {state.topicResource?.completion.choices[0].message.content.replace(
                            /\[.*?\]/g,
                            ''
                          )}
                        </Text>
                      </Box>
                      <Text
                        fontSize={'17px'}
                        fontWeight="500"
                        px={1}
                        color="#000"
                        my={4}
                      >
                        Sources
                      </Text>
                      <SimpleGrid minChildWidth="150px" spacing="10px">
                        {state.topicResource?.search_results
                          .filter((item) => item.title)
                          .map((source, index) => (
                            <a
                              key={index}
                              href={`${source.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Box
                                bg="#F3F5F6"
                                p={4}
                                borderRadius="md"
                                boxShadow="md"
                                borderWidth="1px"
                                borderColor="gray.200"
                                cursor="pointer"
                                transition="transform 0.3s"
                                _hover={{ transform: 'scale(1.05)' }}
                              >
                                <Flex
                                  direction="column"
                                  textAlign="left"
                                  gap={2}
                                >
                                  <Text fontWeight={600} fontSize="sm">
                                    {source.title?.length > 15
                                      ? source.title?.substring(0, 15) + '...'
                                      : source.title}
                                  </Text>
                                  <Flex alignItems="center">
                                    <Text color="gray.500" fontSize="xs">
                                      {source.link?.length > 19
                                        ? source.link?.substring(0, 19) + '...'
                                        : source.link}
                                    </Text>
                                    <Spacer />
                                    <img
                                      className="h-3 w-3"
                                      alt={source.link}
                                      src={`https://www.google.com/s2/favicons?domain=${
                                        source.link
                                      }&sz=${16}`}
                                    />
                                  </Flex>
                                </Flex>
                              </Box>
                            </a>
                          ))}
                      </SimpleGrid>
                    </Box>
                  ) : (
                    <VStack>
                      <Text>No resource, Please try again</Text>
                      <RepeatIcon
                        boxSize={6}
                        onClick={() => getTopicResource(state.selectedTopic)}
                      />
                    </VStack>
                  )
                ) : (
                  <Spinner />
                )}
              </>
            </TabPanel>
            <TabPanel>
              {isAddNewOpened && (
                <Box
                  w="full"
                  px={2}
                  bg="white"
                  borderRadius={10}
                  borderWidth="1px"
                  borderColor="#EEEFF1"
                  justifyContent="center"
                  alignItems="center"
                  my={4}
                >
                  <VStack alignItems={'left'} spacing={2} p={2}>
                    <FormLabel>Url</FormLabel>
                    <Input />
                    <FormLabel>Title</FormLabel>
                    <Input />
                  </VStack>
                  <Flex justifyContent={'flex-end'} m={1}>
                    <Button
                      variant="ghost"
                      fontSize={'xs'}
                      color="gray"
                      display={'flex'}
                      gap={1}
                    >
                      <Icon as={FaPlus} /> Add
                    </Button>
                    <Button
                      variant="ghost"
                      fontSize={'xs'}
                      color="gray"
                      display={'flex'}
                      gap={1}
                      onClick={() => setIsAddNewOpened(false)}
                    >
                      <Icon as={FaTrashAlt} /> Delete
                    </Button>
                  </Flex>
                </Box>
              )}

              <Box
                w="full"
                p={4}
                bg="white"
                justifyContent="center"
                alignItems="center"
                my={4}
              >
                <SimpleGrid minChildWidth="150px" spacing="10px">
                  {articles.map((source, index) => (
                    <a
                      key={index}
                      href={`${source.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Box
                        bg="#F3F5F6"
                        p={4}
                        borderRadius="md"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor="gray.200"
                        cursor="pointer"
                        transition="transform 0.3s"
                        _hover={{ transform: 'scale(1.05)' }}
                      >
                        <Flex direction="column" textAlign="left" gap={2}>
                          <Text fontWeight={600} fontSize="sm">
                            {source.title?.length > 15
                              ? source.title?.substring(0, 15) + '...'
                              : source.title}
                          </Text>
                          <Flex alignItems="center">
                            <Text color="gray.500" fontSize="xs">
                              {source.link?.length > 19
                                ? source.link?.substring(0, 19) + '...'
                                : source.link}
                            </Text>
                            <Spacer />
                            <img
                              className="h-3 w-3"
                              alt={source.link}
                              src={`https://www.google.com/s2/favicons?domain=${
                                source.link
                              }&sz=${16}`}
                            />
                          </Flex>
                        </Flex>
                      </Box>
                    </a>
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
            <TabPanel>
              {isAddNewOpened && (
                <Box
                  w="full"
                  px={2}
                  bg="white"
                  borderRadius={10}
                  borderWidth="1px"
                  borderColor="#EEEFF1"
                  justifyContent="center"
                  alignItems="center"
                  my={4}
                >
                  <VStack alignItems={'left'} spacing={2} p={2}>
                    <FormLabel>Url</FormLabel>
                    <Input />
                    <FormLabel>Title</FormLabel>
                    <Input />
                  </VStack>
                  <Flex justifyContent={'flex-end'} m={1}>
                    <Button
                      variant="ghost"
                      fontSize={'xs'}
                      color="gray"
                      display={'flex'}
                      gap={1}
                    >
                      <Icon as={FaPlus} /> Add
                    </Button>
                    <Button
                      variant="ghost"
                      fontSize={'xs'}
                      color="gray"
                      display={'flex'}
                      gap={1}
                      onClick={() => setIsAddNewOpened(false)}
                    >
                      <Icon as={FaTrashAlt} /> Delete
                    </Button>
                  </Flex>
                </Box>
              )}

              <Box
                w="full"
                p={4}
                bg="white"
                justifyContent="center"
                alignItems="center"
                my={4}
              >
                <SimpleGrid minChildWidth="150px" spacing="10px">
                  {notebooks.map((source, index) => (
                    <a
                      key={index}
                      href={`${source.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Box
                        bg="#F3F5F6"
                        p={4}
                        borderRadius="md"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor="gray.200"
                        cursor="pointer"
                        transition="transform 0.3s"
                        _hover={{ transform: 'scale(1.05)' }}
                      >
                        <Flex direction="column" textAlign="left" gap={2}>
                          <Text fontWeight={600} fontSize="sm">
                            {source.title?.length > 15
                              ? source.title?.substring(0, 15) + '...'
                              : source.title}
                          </Text>
                          <Flex alignItems="center">
                            <Text color="gray.500" fontSize="xs">
                              {source.link?.length > 19
                                ? source.link?.substring(0, 19) + '...'
                                : source.link}
                            </Text>
                            <Spacer />
                            <img
                              className="h-5 w-5"
                              alt={source.link}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADyElEQVR4nO2YyW5cRRSGP7KIWIQwiDEMQeIJEOIV2DOFAA8ACmzY22k7kqPEU7sb2xBFIQwSKN5gV1kGiSGCgEBAWMASwo4oSIBslG7f67j7oFO+bfdU1fd29yKL+0tHV5ZLp/6/6gx1GnLkyJEjR44cNzlkmdtkhSNi+EAsl8VwVQxbYrkmhl/Fcl4sL8saB/vyZYmT72WxvC+rPK/rBif+KXeJZUoMm2KRnmbYcOvXuGdgX5aqGE7LKnf2R37nlP5NuVm7/SWrPDMUX4Z/xPJceuIF9onhhBjqfZJvWEmEW8QyPrAvQ10MBfXXU0BU5Mu4NBBx3fCqfMbtjvxghyAN234XiYp8HiQfl5itjCKVESQuOyL9Cng2CZv6sMhXlNcoEpeY7kp+8y0erRSoK/mGxfN9bbimiZfE7sDkb7yzx8dZgfrmGR7rDJ0ZfmhZmNjWQsvJfi2GF2SZQ7LEfve1HBXLpeT/12WVw67a9L6lVl+WB1t8KflznXzUomm+a03c89xfOd59sbuJt6mJ4dVg8hteE8Mbrs6HSqXhRgpfx7bOUmuEc4cdR+Qs97XGvoe8U1zio2DyNG+usR8++SD5BqIiF0KcWnIhmuKKb2F1gnUyIOmwPvJfZfFVPcmG91Cn+H1v4QQVr9IyxUwCLD97BaxwJIuvuEw5cLDXdxdWxtj2Cljk8UwCdt403QUscyiLr61FnvCG0RjbewJ8yTKCyDwHMgnQh5lPwBL7M/kqcdArYBTZEzBO7aa8gTM8meoGeuRAOaOAnwJV6GgWX9Eci6lyIDrNH96FJ9kYWhWyXErtp8C+6gT/papCcZmZYB8ociH1xjqMhPvAsTR+4hJLwT4wx1T6TrzgOrF34+TZ/LoYXnGdWIeR7uS1KdZ6HUis5AOFpaMTK6IZvveQbybxjazwoqzxkHu/6Nfwkhi+TQiuyyc84CapLuTjudbQjIu8qYmqlU6/UZn5UNjsRsRs21tIUZ3ncNfXaPYn9YfyMXeI5W8f+YFsjFp1gYd9Vze9Ow/0R75B+CkdA908sOJObDjkR11VPBVMnmiWiwMNMzv2m1zkVlnmRDQzJPIjrph8ESTfNBMXhjBNjWty6xgYTMiRdCev5JVbTwG7QnQsbI7jbHZNLE83heZke36ltgL1nmHjFaHJaDjlLYudsb8ulkkx3N3uqzrHIzpJhcp1pa1UarXxJmwmIUscSJLyPTH8KJY/m36Z+0UM51w5TfPL3CL3arGIJrmizwH3EtYQG2Nb/9YOq02qo87nyJEjR44cOXIwdPwP3P16q2mQhk0AAAAASUVORK5CYII="
                            />
                          </Flex>
                        </Flex>
                      </Box>
                    </a>
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  );
};

export default ResourceModal;
