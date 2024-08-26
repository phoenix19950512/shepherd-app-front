import Star from '../../../assets/littleStar.svg';
import Ribbon2 from '../../../assets/ribbon-blue.svg';
import Ribbon from '../../../assets/ribbon-grey.svg';
import TutorAvi from '../../../assets/tutoravi.svg';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../../services/ApiService';
import offerStore from '../../../state/offerStore';
import bookmarkedTutorsStore from '../../../state/bookmarkedTutorsStore';
import userStore from '../../../state/userStore';
import { textTruncate } from '../../../util';
import AcceptBountyModal from './AcceptBounty';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Divider,
  Textarea,
  NumberInput,
  NumberInputField,
  useDisclosure
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { AiFillStar } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export default function TutorCard(props: any) {
  const {
    id,
    bidId,
    name,
    levelOfEducation,
    avatar,
    use,
    rate,
    description,
    courses,
    rating,
    reviewCount,
    saved,
    offerStatus,
    offerId,
    handleSelectedCourse
  } = props;
  const toast = useCustomToast();
  const { fetchBookmarkedTutors } = bookmarkedTutorsStore();
  const { user } = userStore();
  const { fetchOffers } = offerStore();

  const [ribbonClicked, setRibbonClicked] = useState(false);
  const [reviewRate, setReviewRate] = useState<any>(1);
  const [review, setReview] = useState('');
  const [isLoading, setLoading] = useState(false);

  const toggleBookmarkTutor = async (id: string) => {
    setRibbonClicked(!ribbonClicked);
    try {
      const resp = await ApiService.toggleBookmarkedTutor(id);

      if (saved && resp.status === 200) {
        setRibbonClicked(false);
        toast({
          render: () => (
            <CustomToast
              title="Tutor removed from Bookmarks successfully"
              status="success"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      } else {
        setRibbonClicked(true);
        toast({
          render: () => (
            <CustomToast title="Tutor saved successfully" status="success" />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
      fetchBookmarkedTutors();
    } catch (e) {
      setRibbonClicked(false);
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };
  const tutorSubjects = [
    { id: 1, label: 'English' },
    { id: 2, label: 'Literature' },
    { id: 3, label: 'Maths' },
    { id: 4, label: 'English' },
    { id: 5, label: 'Literature' },
    { id: 6, label: 'English' },
    { id: 7, label: 'Literature' }
  ];
  const navigate = useNavigate();
  const {
    isOpen: isAcceptBountyOpen,
    onOpen: openAcceptBounty,
    onClose: closeAcceptBounty
  } = useDisclosure();

  const {
    isOpen: isReviewModalOpen,
    onOpen: openReviewModal,
    onClose: closeReviewModal
  } = useDisclosure();

  const handleBountyClick = () => {
    openAcceptBounty();
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    const formData = {
      reviewerId: user?._id,
      entityType: 'student',
      rating: reviewRate,
      review: review,
      offerId
    };

    try {
      const resp = await ApiService.submitReview(id, formData);

      if (resp.status === 201) {
        fetchOffers(1, 20, 'tutor');
        closeReviewModal();
        toast({
          render: () => (
            <CustomToast
              title="Review Submitted successfully"
              status="success"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      } else {
        toast({
          render: () => (
            <CustomToast title="Something went wrong" status="error" />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    } catch (e) {
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (selectedRating) => {
    setReviewRate(selectedRating);
  };

  const renderStars = () => {
    const stars: any = [];
    for (let i = 1; i <= 5; i++) {
      const starColor = i <= reviewRate ? 'gold' : 'gray';
      stars.push(
        <IconContext.Provider key={i} value={{ color: starColor, size: '2em' }}>
          <AiFillStar onClick={() => setReviewRate(i)} />
        </IconContext.Provider>
      );
    }
    return stars;
  };

  return (
    <>
      <LinkBox as="article">
        <Center>
          {' '}
          <Box
            bg={'white'}
            w={{ sm: '100%', md: '100%', lg: '100%', base: '100%' }}
            height={{
              base: '40vh', // Sets height to 40% of the viewport height on the smallest screens
              sm: '285px', // Sets a fixed height for sm screens and larger
              md: '285px', // Continues the fixed height for md screens
              lg: '325px' // Adjusts the height for lg screens and larger
            }}
            borderRadius="12px"
            border="1px solid #EBEDEF"
            _hover={{
              boxShadow: 'xl',
              transition: 'box-shadow 0.3s ease-in-out'
            }}
            padding={'20px'}
            position="relative"
            onClick={() => navigate(`/dashboard/find-tutor/tutor/?id=${id}`)}
          >
            <Box>
              <Flex gap={2} alignItems="center" position="relative">
                <Avatar size="lg" name={name} src={avatar} />
                {/* <div>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: 'linear-gradient(0deg, #66BD6A, #66BD6A)',
                  border: '2.5px solid #FFFFFF',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '46px',
                  left: '50px'
                }}
              ></div>
            </div> */}
                <Box>
                  <Flex pt={1} direction={'column'}>
                    <Text fontSize={'16px'} fontWeight={'semibold'} mb={0}>
                      {name}
                      <Text
                        fontWeight={400}
                        color={'#212224'}
                        fontSize="14px"
                        mb={'2px'}
                      >
                        {levelOfEducation}
                      </Text>
                    </Text>
                  </Flex>{' '}
                </Box>
              </Flex>
              <Box my={2}>
                <Flex alignItems="center">
                  <Text fontSize={16} fontWeight={'semibold'}>
                    ${`${rate}.00 / hr`}
                  </Text>

                  <Spacer />
                  <Flex>
                    <Box boxSize={4}>
                      <Star />
                    </Box>
                    <Text fontSize={12} fontWeight={400} color="#6E7682">
                      {`${rating}(${reviewCount})`}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>

            <Divider />
            <Flex direction="column">
              {' '}
              <Box my={2}>
                <Text
                  fontSize={['10px', '12px']}
                  lineHeight={{ base: 3, md: 1.3 }}
                  color={useColorModeValue('gray.700', 'gray.400')}
                  whiteSpace="pre-wrap"
                >
                  {description ? textTruncate(description, 200) : ''}
                </Text>
              </Box>
              <Flex>
                {' '}
                {use === 'my tutors' ? (
                  <Text
                    width="fit-content"
                    bg={offerStatus === 'accepted' ? '#F1F9F1' : '#FFF2EB'}
                    py={2}
                    px={5}
                    borderRadius={6}
                    fontSize="12px"
                    fontWeight={500}
                    color={offerStatus === 'accepted' ? 'green' : '#FB8441'}
                    position={'absolute'}
                    bottom={5}
                  >
                    {offerStatus === 'accepted' ? 'Active' : 'Pending'}
                  </Text>
                ) : (
                  courses && (
                    <Box my={1}>
                      <Flex
                        gap={{ sm: 1, md: 1, lg: 2 }}
                        position="absolute"
                        bottom={5}
                        flexWrap="wrap"
                        fontSize={10}
                        fontWeight={500}
                      >
                        {courses.length < 6
                          ? courses.map((subject, index) => (
                              <Text
                                key={index}
                                py={1}
                                px={4}
                                bgColor="#F1F2F3"
                                borderRadius={4}
                                _hover={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectedCourse(subject.course.label);
                                }}
                              >
                                {subject.course.label}
                              </Text>
                            ))
                          : courses.slice(0, 5).map((subject, index) => (
                              <>
                                <Text
                                  key={index}
                                  py={1}
                                  px={4}
                                  bgColor="#F1F2F3"
                                  borderRadius={4}
                                  _hover={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectedCourse(subject.course.label);
                                  }}
                                >
                                  {subject.course.label}
                                </Text>
                                {index === 4 && (
                                  <Link
                                    color="#207DF7"
                                    href={`/dashboard/find-tutor/tutor/?id=${id}`}
                                    fontSize={12}
                                    alignSelf="center"
                                  >
                                    + {courses.length - 5} more
                                  </Link>
                                )}
                              </>
                            ))}
                      </Flex>
                    </Box>
                  )
                )}
                <Spacer />
                <Box position={'absolute'} bottom={5} right={3}>
                  {' '}
                  {use === 'bounty' && (
                    <Button
                      fontSize={12}
                      fontWeight={500}
                      borderRadius={4}
                      // position="absolute"
                      zIndex={1}
                      color="#fff"
                      // bottom={4}
                      right={0}
                      px={2}
                      py={'1px'}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card onClick from firing
                        handleBountyClick();
                      }}
                    >
                      Accept Bid
                    </Button>
                  )}
                  {use === 'my tutors' && offerStatus === 'accepted' && (
                    <Button
                      variant={'unstyled'}
                      fontSize={12}
                      fontWeight={500}
                      borderRadius={4}
                      border="1px solid grey"
                      zIndex={1}
                      color="grey"
                      px={2}
                      onClick={(e) => {
                        e.stopPropagation();
                        openReviewModal();
                      }}
                    >
                      Review
                    </Button>
                  )}
                </Box>
              </Flex>
              {use !== 'my tutors' && (
                <Box
                  position="absolute"
                  top={4}
                  right={5}
                  width={saved || ribbonClicked ? 5 : 4}
                  _hover={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmarkTutor(id);
                  }}
                >
                  {saved || ribbonClicked ? <Ribbon2 /> : <Ribbon />}
                </Box>
              )}
            </Flex>
          </Box>
        </Center>
      </LinkBox>
      <AcceptBountyModal
        isAcceptBountyOpen={isAcceptBountyOpen}
        closeAcceptBounty={closeAcceptBounty}
        bounty={bidId}
      />
      <CustomModal
        isOpen={isReviewModalOpen}
        modalTitle="Drop a Review"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              isDisabled={!reviewRate || !review}
              isLoading={isLoading}
              onClick={() => handleSubmitReview()}
            >
              Update
            </Button>
          </div>
        }
        onClose={closeReviewModal}
      >
        <VStack p={5} width="100%">
          <Box mb={4} justifyContent="center">
            {/* <label>Rating:</label> */}
            <Flex gap={2}> {renderStars()}</Flex>
          </Box>
          <Box width="100%">
            {/* <label>Review:</label> */}
            <Textarea
              placeholder="Enter your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              size="sm"
            />
          </Box>
        </VStack>
      </CustomModal>
    </>
  );
}
