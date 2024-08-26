import FileAvi2 from '../../assets/file-avi2.svg';
import Star from '../../assets/littleStar.svg';
import Ribbon2 from '../../assets/ribbon-blue.svg';
import Ribbon from '../../assets/ribbon-grey.svg';
import { useCustomToast } from '../../components/CustomComponents/CustomToast/useCustomToast';
import LinedList from '../../components/LinedList';
import ApiService from '../../services/ApiService';
import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import { CustomButton } from './layout';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Avatar
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { BiPlayCircle } from 'react-icons/bi';
import { FiChevronRight } from 'react-icons/fi';
import { RiQuestionFill } from 'react-icons/ri';
import { RxDotFilled } from 'react-icons/rx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Availability from '../../components/Availability';
import ShepherdSpinner from './components/shepherd-spinner';
import useUserStore from '../../state/userStore';
import ShareModal from '../../components/ShareModal';
import { Helmet } from 'react-helmet';
import { IconContext } from 'react-icons';
import { AiFillStar } from 'react-icons/ai';
function removeShareFromURL(baseUrl: string) {
  const url = new URL(baseUrl);
  const existingParams = new URLSearchParams(url.search);

  const paramsToExclude = ['shareable', 'apiKey'];

  paramsToExclude.forEach((param) => {
    existingParams.delete(param);
  });
  url.search = existingParams.toString();

  return url.toString();
}
export default function Tutor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const apiKey = searchParams.get('apiKey');
  const shareable = searchParams.get('shareable');
  const [loadingData, setLoadingData] = useState(false);
  const [tutorData, setTutorData] = useState<any>({});
  const { user } = useUserStore();
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);
  const [switchStyle, setSwitchStyle] = useState<boolean>(false);
  const tutorId: any = searchParams.get('id');

  const navigate = useNavigate();
  const toast = useCustomToast();

  const getData = useCallback(
    async (apiKey: string) => {
      setLoadingData(true);
      if (apiKey) {
        const resp = await ApiService.getTutorForAPIKey(tutorId, apiKey);
        const data = await resp.json();
        setTutorData(data);
      } else {
        const resp = await ApiService.getTutor(tutorId);
        const data = await resp.json();
        setTutorData(data);
      }
      setLoadingData(false);
    },
    [tutorId]
  );

  useEffect(() => {
    getData(apiKey);
  }, [getData, apiKey]);
  // useEffect(() => {
  //   if (Object.keys(tutorData).length > 1) {
  //     document.getElementsByTagName('meta')[
  //       'description'
  //     ].content = `Book a session with ${tutorData.user.name?.first} ${tutorData.user.name?.last}`;
  //   }
  // }, [tutorData]);

  const {
    fetchBookmarkedTutors,
    tutors: bookmarkedTutors,
    fetchTutorReviews,
    tutorReviews
  } = bookmarkedTutorsStore();
  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
  }, [fetchBookmarkedTutors]);
  const checkBookmarks = () => {
    const found = bookmarkedTutors?.some((el) => el.tutor?._id === tutorId);
    if (!found) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (!apiKey && !shareable) {
      doFetchBookmarkedTutors();
    }
  }, [doFetchBookmarkedTutors, apiKey, shareable]);
  useEffect(() => {
    if (tutorId) {
      fetchTutorReviews(tutorId);
    }
  }, [tutorId]);

  const toggleBookmarkTutor = async (id: string) => {
    try {
      const resp = await ApiService.toggleBookmarkedTutor(id);
      if (checkBookmarks()) {
        toast({
          title: 'Tutor removed from Bookmarks successfully',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      } else {
        toast({
          title: 'Tutor saved successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
      }
      fetchBookmarkedTutors();
    } catch (e) {
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IconContext.Provider
          key={i}
          value={{ color: i <= rating ? 'gold' : 'gray', size: '2em' }}
        >
          <AiFillStar size={'14px'} />
        </IconContext.Provider>
      );
    }
    return stars;
  };

  const sendOfferHandler = () => {
    if (user) {
      navigate(`/dashboard/tutor/${tutorId}/offer`);
    } else {
      const url = removeShareFromURL(window.location.href);

      localStorage.setItem('redirLink', url);
      navigate('/signup');
    }
  };
  if (Object.keys(tutorData).length === 0) {
    return (
      <Box p={5} textAlign="center">
        <ShepherdSpinner />
      </Box>
    );
  }

  return (
    <div>
      <Helmet>
        <meta
          name="og:description"
          content={
            tutorData
              ? `Book a session with ${tutorData.user.name?.first} ${tutorData.user.name?.last}`
              : 'Book a session with a tutor!'
          }
        />
        <meta
          name="twitter:description"
          content={
            tutorData
              ? `Book a session with ${tutorData.user.name?.first} ${tutorData.user.name?.last}`
              : 'Book a session with a tutor!'
          }
        />
      </Helmet>
      <Box>
        <Breadcrumb
          spacing="8px"
          separator={<FiChevronRight size={10} color="gray.500" />}
          padding={{ base: '18px' }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/find-tutor">
              Shepherds
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">
              {tutorData.user.name?.first} {tutorData.user.name?.last}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Grid
          display={{ base: 'auto', md: 'grid' }}
          // minHeight="100vh"
          templateRows={{ base: 'repeat(3, 1fr)', sm: 'repeat(2, 1fr)' }}
          templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }}
          gap={4}
          height="120vh"
          padding={{ base: '18px' }}
        >
          <GridItem rowSpan={{ base: 1, sm: 2 }} colSpan={{ base: 1, sm: 2 }}>
            <Center>
              <Box
                maxW={'100%'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}
              >
                <Flex justify={'left'} p={6}>
                  <Box boxSize={106}>
                    <Image src={tutorData.user.avatar} borderRadius={8} />
                  </Box>
                </Flex>

                <Box px={6}>
                  <VStack spacing={0} align={'left'} mb={5} gap={2}>
                    <Flex alignItems="center" gap={1}>
                      <Text fontSize={'16px'} fontWeight={'500'} mb={0}>
                        {`${tutorData.user.name.first} ${tutorData.user.name.last}`}
                      </Text>
                      <RxDotFilled color="#DBDEE1" />
                      <Text fontSize={16} fontWeight={'500'}>
                        ${`${tutorData.rate}.00 / hr`}
                      </Text>
                    </Flex>

                    <Text
                      fontWeight={400}
                      color={'#212224'}
                      fontSize="14px"
                      mb={'2px'}
                    >
                      {tutorData.highestLevelOfEducation}
                    </Text>
                    <Flex>
                      <Box boxSize={4}>
                        {' '}
                        <Star />
                      </Box>

                      <Text fontSize={12} fontWeight={400} color="#6E7682">
                        {` ${tutorData.rating}(${tutorData.reviewCount})`}
                      </Text>
                    </Flex>
                    <Flex alignItems={'center'} gap={2} mt={-20}>
                      <CustomButton
                        buttonText="Send Offer"
                        padding="10px 21px"
                        ml={-2}
                        onClick={sendOfferHandler}
                      />
                      <Button
                        variant="unstyled"
                        color={'#585F68'}
                        bgColor={checkBookmarks() ? '#F0F6FE' : '#fff'}
                        border="1px solid #E7E8E9"
                        borderRadius="6px"
                        fontSize="12px"
                        leftIcon={checkBookmarks() ? <Ribbon2 /> : <Ribbon />}
                        p={'7px 14px'}
                        display="flex"
                        _hover={{
                          boxShadow: 'lg',
                          transform: 'translateY(-2px)'
                        }}
                        my={3}
                        disabled={user === null}
                        style={{ pointerEvents: user ? 'auto' : 'none' }}
                        onClick={() => toggleBookmarkTutor(tutorId)}
                      >
                        {user && checkBookmarks()
                          ? 'Unsave Profile'
                          : 'Save Profile'}
                      </Button>
                      {user && <ShareModal type="tutor" />}
                    </Flex>

                    <Spacer />
                    <Box my={14}>
                      <Text
                        fontSize={'12px'}
                        color="text.400"
                        my={3}
                        fontWeight="semibold"
                      >
                        ABOUT ME
                      </Text>
                      <Text fontSize={'14px'} my={2} whiteSpace="pre-wrap">
                        {tutorData.description}
                      </Text>
                    </Box>

                    <Box my={10} zIndex={2}>
                      <Tabs>
                        <TabList className="tab-list">
                          <Tab>REVIEWS</Tab>
                          <Tab>QUALIFICATIONS</Tab>
                          <Tab>AVAILABILITY</Tab>
                          <Tab>SUBJECT OFFERED</Tab>
                        </TabList>

                        <TabPanels>
                          <TabPanel>
                            {tutorReviews.length > 0 ? (
                              tutorReviews.map((review) => (
                                <Flex
                                  px={3}
                                  gap={0}
                                  direction={'row'}
                                  my={2}
                                  key={review._id}
                                >
                                  <Avatar
                                    name={`${review?.student?.user?.name.first} ${review?.student?.user?.name.last}`}
                                    src={review?.student?.user?.avatar}
                                  />

                                  <Stack
                                    direction={'column'}
                                    px={4}
                                    spacing={1}
                                  >
                                    <Box>
                                      <Flex>{renderStars(review.rating)}</Flex>
                                      <Text
                                        fontSize={'16px'}
                                        fontWeight={'500'}
                                        mb={0}
                                      >
                                        {`${review?.student?.user?.name.first} ${review?.student?.user?.name.last}`}
                                      </Text>
                                      <Text
                                        fontWeight={400}
                                        color={'#585F68'}
                                        fontSize="14px"
                                        mb={'2px'}
                                      >
                                        {review.review}
                                      </Text>
                                    </Box>

                                    <Divider />
                                  </Stack>
                                </Flex>
                              ))
                            ) : (
                              <Text
                                fontWeight={400}
                                color={'#585F68'}
                                fontSize="14px"
                                mb={'2px'}
                              >
                                This tutor has no reviews yet
                              </Text>
                            )}
                          </TabPanel>
                          <TabPanel>
                            {tutorData.qualifications.map((q) => (
                              <>
                                <Flex px={3} gap={0} direction={'row'} my={2}>
                                  <Box mb={4}>
                                    {' '}
                                    <FileAvi2 />
                                  </Box>
                                  <Stack
                                    direction={'column'}
                                    px={4}
                                    spacing={1}
                                  >
                                    <Text
                                      fontSize={'16px'}
                                      fontWeight={'500'}
                                      mb={0}
                                    >
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
                                    <Text
                                      fontSize={12}
                                      fontWeight={400}
                                      color="#6E7682"
                                    >
                                      {new Date(q.startDate).getFullYear()} -{' '}
                                      {new Date(q.endDate).getFullYear()}
                                    </Text>
                                  </Stack>
                                </Flex>
                                <Divider />
                              </>
                            ))}
                          </TabPanel>
                          <TabPanel>
                            {/* <AvailabilityTable data={tutorData} /> */}
                            <Availability
                              schedule={tutorData.schedule}
                              timezone={tutorData.tz}
                              editMode={false}
                            />
                          </TabPanel>
                          <TabPanel>
                            <TableContainer my={4}>
                              <Box
                                border={'1px solid #EEEFF2'}
                                borderRadius={8}
                                py={3}
                              >
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
                                    {tutorData.coursesAndLevels.map((cl) => (
                                      <Tr>
                                        <Td bgColor={'#FAFAFA'}>
                                          {cl.course.label}
                                        </Td>
                                        <Td>{cl.level?.label}</Td>
                                        <Td>${tutorData.rate}/hr</Td>
                                      </Tr>
                                    ))}

                                    {/* <Tr>
                                      <Td bgColor={"#FAFAFA"}>Maths</Td>
                                      <Td>A-level</Td>
                                      <Td>$10.00/hr</Td>
                                    </Tr>
                                    <Tr>
                                      <Td bgColor={"#FAFAFA"}>Yoruba</Td>
                                      <Td>Grade 12</Td>
                                      <Td>$10.00/hr</Td>
                                    </Tr> */}
                                  </Tbody>
                                </Table>
                              </Box>
                            </TableContainer>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </Box>
                  </VStack>
                </Box>
              </Box>
            </Center>
          </GridItem>
          <GridItem h={{ base: 'auto', md: 305 }} position="relative">
            <Center position="relative" borderRadius={10} my={2}>
              {/* <AspectRatio
                h={{ base: '170px', md: '170px' }}
                w={{ base: 'full', md: 'full' }}
                ratio={1}
                objectFit={'cover'}
              > */}
              {/* <iframe
                  title="naruto"
                  // src={'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'}
                  src={tutorData.tutor.introVideo}
                  allowFullScreen
                  style={{ borderRadius: 10 }}
                /> */}
              <Box
                h={{ base: '170px', md: '170px' }}
                w={{ base: 'full', md: 'full' }}
              >
                <video
                  title="tutor-video"
                  controls
                  style={{ borderRadius: 10, width: '100%', height: '100%' }}
                >
                  <source src={tutorData.introVideo} type="video/mp4" />
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
                  <Text display={'inline'}> Play intro video</Text>
                </VStack>
              </Center>
            </Center>
            {/* </Box> */}

            {/* <Stack
                  flex={1}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                  spacing={3}
                  p={1}
                  pt={2}>
                  <img src={FileAvi} alt="send-offer-img" />
                  <Text fontSize={16} fontWeight="semibold">
                    Send an offer to {tutorData.name?.first}
                  </Text>
                  <Text fontSize={14} fontWeight={400} color="#6E7682" maxWidth={'85%'}>
                    You’ll be notified once they respond to your offer
                  </Text>
                  <CustomButton
                    buttonText="Send Offer"
                    padding="9px 105px"
                    onClick={() => navigate(`/dashboard/tutor/${tutorId}/offer`)}
                  />
                </Stack> */}

            {/* <Text fontSize={14} mt={8}>
              <Link
                color="#207DF7"
                href="/dashboard/find-tutor"
                textDecoration="underline"
              >
                More Economics tutors
              </Link>
            </Text> */}
          </GridItem>

          <GridItem>
            <Card>
              <Box
                px={4}
                pt={3}
                fontSize={16}
                fontWeight={'semibold'}
                display="flex"
              >
                <RiQuestionFill color="#969ca6" fontSize={'22px'} />
                <Text mx={2}>How this Works</Text>
              </Box>
              <CardBody>
                <LinedList
                  // mt={"30px"}
                  items={[
                    {
                      title: 'Send a Proposal',
                      subtitle:
                        'Find your desired tutor, set your terms, provide payment details and send your offer to the tutor.'
                    },
                    {
                      title: 'Get a Response',
                      subtitle:
                        'Your offer has been sent! Wait for the tutor to review and accept your offer.'
                    },
                    {
                      title: 'Connect with your tutor',
                      subtitle:
                        'You’ll receive a reminder 1 hour before your session. You can reschedule or cancel up to 24 hours before your session starts.'
                    }
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </div>
  );
}
