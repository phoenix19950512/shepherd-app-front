import Star5 from '../../assets/5star.svg';
import Sally from '../../assets/saly.svg';
import CustomButton2 from '../../components/CustomComponents/CustomButton/index';
import CustomModal from '../../components/CustomComponents/CustomModal';
import CustomToast from '../../components/CustomComponents/CustomToast';
import { useCustomToast } from '../../components/CustomComponents/CustomToast/useCustomToast';
import PaymentDialog, {
  PaymentDialogRef
} from '../../components/PaymentDialog';
import CustomSelect from '../../components/Select';
import Select, { components } from 'react-select';
import TimePicker from '../../components/TimePicker';
import ApiService from '../../services/ApiService';
import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import resourceStore from '../../state/resourceStore';
import userStore from '../../state/userStore';
import theme from '../../theme';
import { numberToDayOfWeekName } from '../../util';
import Banner from './components/Banner';
import BountyOfferModal from './components/BountyOfferModal';
import Pagination from './components/Pagination';
import TutorCard from './components/TutorCard';
import { CustomButton } from './layout';
import { CloseIcon, EmailIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  Select as SingleSelect,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
  RadioGroup,
  IconButton
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { loadStripe } from '@stripe/stripe-js';
import { Select as MultiSelect } from 'chakra-react-select';
import { useFormik } from 'formik';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  useMemo
} from 'react';
import { BsStarFill } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import { GiTakeMyMoney } from 'react-icons/gi';
import { IoIosAlert } from 'react-icons/io';
import { MdInfo } from 'react-icons/md';
import { MdTune } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

type PaginationType = {
  page: number;
  limit: number;
  count: number;
};

const priceOptions = [
  { value: '10-12', label: '$10.00 - $12.00', id: 1 },
  { value: '12-15', label: '$12.00 - $15.00', id: 2 },
  { value: '15-20', label: '$15.00 - $20.00', id: 3 },
  { value: '20-25', label: '$20.00 - $25.00', id: 4 }
];
const timezoneOffset = new Date().getTimezoneOffset();

const ratingOptions = [
  { value: 1.0, label: '⭐', id: 1 },
  { value: 2.0, label: '⭐⭐', id: 2 },
  { value: 3.0, label: '⭐⭐⭐', id: 3 },
  { value: 4.0, label: '⭐⭐⭐⭐', id: 4 },
  { value: 5.0, label: '⭐⭐⭐⭐⭐', id: 5 }
];

const dayOptions = [...new Array(7)].map((_, i) => {
  return { label: numberToDayOfWeekName(i), value: i };
});
const defaultTime = '';

export default function Marketplace() {
  const { courses: courseList, levels: levelOptions } = resourceStore();
  const { user, fetchUser } = userStore();
  const [allTutors, setAllTutors] = useState<any>([]);
  const [pagination, setPagination] = useState<PaginationType>();
  const subjectOptions: any = courseList.map((item, index) => ({
    value: item._id,
    label: item.label,
    id: item._id
  }));

  const [loadingData, setLoadingData] = useState(false);
  //   const [tz, setTz] = useState<any>(() => moment.tz.guess());
  const [subject, setSubject] = useState<string>('Subject');

  const [level, setLevel] = useState<any>('');
  const [price, setPrice] = useState<any>('');
  const [rating, setRating] = useState<any>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [days, setDays] = useState<Array<any>>([]);

  const [settingUpPaymentMethod, setSettingUpPaymentMethod] = useState(false);

  //Payment Method Handlers
  const paymentDialogRef = useRef<PaymentDialogRef>(null);
  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
  );

  const [onlineTutorsId, setOnlineTutorsId] = useState<string[]>([]);

  const [isShowInput, setShowInput] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [showOnHover, setShowOnHover] = useState(false);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const [tutorGrid] = useAutoAnimate();
  const toast = useCustomToast();
  const navigate = useNavigate();
  const getData = async () => {
    setLoadingData(true);

    const formData = {
      courses: subject === 'Subject' ? '' : subject.toLowerCase(),
      levels: level === '' ? '' : level._id,
      availability: '',
      tz: moment.tz.guess(),
      days: days,
      price: price === '' ? '' : price.value,
      rating: rating === '' ? '' : rating.value,
      startTime: toTime,
      endTime: fromTime,
      page: page,
      limit: limit
    };

    const resp = await ApiService.getAllTutors(formData);
    const data = await resp.json();

    setPagination(data.meta.pagination);

    setAllTutors(data.tutors);
    setLoadingData(false);
  };
  const subjectId: any = searchParams.get('subjectId');
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <Box as={FiChevronDown} color={'text.400'} />
      </components.DropdownIndicator>
    );
  };
  // useEffect(() => {
  //   getData();

  //   /* eslint-disable */
  // }, [subject, level, price, rating, days, page]);

  useEffect(() => {
    const fetchSubjectFromParams = async () => {
      if (subjectId) {
        setSubject(subjectId);

        // await getData(); // Assuming you want to fetch data after setting the subject
        navigate('.', { replace: true });
      } else {
        getData();
      }
    };

    fetchSubjectFromParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, level, price, rating, days, page]);

  const handleSelectedCourse = (selectedcourse) => {
    let selectedID = '';
    for (let i = 0; i < courseList.length; i++) {
      if (courseList[i].label === selectedcourse) {
        selectedID = courseList[i]._id;
        // return courseList[i].label;
      }
    }
    setSubject(selectedID);
  };

  const { fetchBookmarkedTutors, tutors: bookmarkedTutors } =
    bookmarkedTutorsStore();

  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
  }, []);

  const checkBookmarks = (id: string) => {
    const found = bookmarkedTutors?.some((tutor) => tutor._id === id);
    if (!found) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    doFetchBookmarkedTutors();
  }, [doFetchBookmarkedTutors]);

  const resetForm = useCallback(() => {
    setSubject('Subject');
    setLevel('');
    setPrice('');
    setRating('');
    setDays([]);
    setFromTime('');
    setToTime('');
    getData();
    /* eslint-disable */
  }, []);

  const setupPaymentMethod = async () => {
    try {
      setSettingUpPaymentMethod(true);
      const paymentIntent = await ApiService.createStripeSetupPaymentIntent();

      const { data } = await paymentIntent.json();

      paymentDialogRef.current?.startPayment(
        data.clientSecret,
        `${window.location.href}`
      );

      setSettingUpPaymentMethod(false);
    } catch (error) {
      // console.log(error);
    }
  };
  const {
    isOpen: isBountyModalOpen,
    onOpen: openBountyModal,
    onClose: closeBountyModal
  } = useDisclosure();

  useEffect(() => {
    if (clientSecret) {
      (async () => {
        setSettingUpPaymentMethod(true);
        const stripe = await stripePromise;
        const setupIntent = await stripe?.retrieveSetupIntent(clientSecret);
        await ApiService.addPaymentMethod(
          setupIntent?.setupIntent?.payment_method as string
        );
        await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            openBountyModal();
            break;
          case 'processing':
            toast({
              title:
                "Processing payment details. We'll update you when processing is complete.",
              status: 'loading',
              position: 'top',
              isClosable: true
            });
            break;
          case 'requires_payment_method':
            toast({
              title:
                'Failed to process payment details. Please try another payment method.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
          default:
            toast({
              title: 'Something went wrong.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
        }
        setSettingUpPaymentMethod(false);
        navigate('/dashboard/find-tutor');
      })();
    }
    /* eslint-disable */
  }, [clientSecret]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const resp = await ApiService.getOnlineTutors();

        const response = await resp.json();
        setOnlineTutorsId(response?.data);
      } catch (error: any) {
        toast({
          render: () => (
            <CustomToast
              title="Failed to fetch chat history..."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    };
    getNotes();
  }, []);

  const handleBlur = () => {
    setShowOnHover(false);
  };

  return (
    <>
      <Box p={5}>
        <Box
          bgColor={'transparent'}
          borderRadius={'14px'}
          border="1px solid #E2E8F0"
          height={'200px'}
        >
          <Banner />
        </Box>
        <Box textAlign="center">
          <Flex
            direction={{ base: 'column', md: 'row' }} // Stack elements vertically on small screens, horizontally on medium and up
            alignItems="center"
            gap="2"
            mt={2}
            textColor="text.400"
            justifyContent={{ base: 'center', md: 'space-between' }} // Center on small screens, space-between on medium and up
            px={{ base: 4, md: 8 }} // Adjust padding for responsiveness
            overflow={{ base: 'scroll', sm: 'hidden' }} // Enable scroll on base, hide on small and up
            // Optionally set specific overflow directions:
            overflowX={{ base: 'auto', sm: 'scroll' }} // Horizontal scroll on base, none on small and up
            overflowY="hidden"
            sx={{ '&::-webkit-scrollbar': { display: 'none' } }} // Hides scrollbar for a cleaner look, specific to WebKit browsers
          >
            <HStack
              direction={{ base: 'column', md: 'row' }} // Stack elements vertically on small screens, horizontally on medium and up
              spacing={{ base: 3, md: 4 }} // Adjust spacing for responsiveness
              alignItems="center"
              sx={{ width: '900px' }}
              margin={{ base: 'auto', sm: '0 auto' }}
              width="100%" // Ensure it takes the full width
              // overflow={{ base: 'scroll', sm: 'hidden' }} // Enable scroll on base, hide on small and up
              // // Optionally set specific overflow directions:
              // overflowX={{ base: 'auto', sm: 'hidden' }} // Horizontal scroll on base, none on small and up
              // overflowY="hidden" // Generally keep vertical overflow hidden
            >
              <Flex
                alignItems={'center'}
                justifySelf={{ base: 'normal', sm: 'center' }}
              >
                <Text>
                  <MdTune />
                </Text>
                <Text>Filter</Text>
              </Flex>
              <div></div>
              {/* <Menu>
                <MenuButton
                  as={Button}
                  // variant="outline"
                  // rightIcon={<FiChevronDown />}
                  // fontSize={14}
                  // borderRadius="40px"
                  // fontWeight={400}
                  // width={{ sm: '400px', lg: 'auto' }}
                  // height="36px"
                  // color="text.400"
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={{ base: 'sm', md: 'md' }} // Adjust font size for responsiveness
                  borderRadius="40px"
                  height={{ base: '32px', md: '36px' }} // Adjust height for responsiveness
                  fontWeight={400}
                  color="text.400"
                  width={{ base: 'full', sm: '400px', lg: 'auto' }}
                >
                  {subject !== 'Subject'
                    ? courseList.map((course) => {
                        if (course._id === subject) {
                          return course.label;
                        }
                      })
                    : subject}
                </MenuButton>
                <MenuList zIndex={3}>
                  {courseList.map((course) => (
                    <MenuItem
                      key={course._id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setSubject(course._id)}
                    >
                      {course.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu> */}
              <Box fontSize={{ base: 'sm', md: 'md' }}>
                <Select
                  value={subject}
                  onChange={(option: any) => setSubject(option.id)}
                  options={subjectOptions}
                  placeholder={
                    subject !== 'Subject'
                      ? courseList.map((course) => {
                          if (course._id === subject) {
                            return course.label;
                          }
                        })
                      : subject
                  }
                  components={{ DropdownIndicator }}
                  isSearchable
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: '150px',
                      position: 'relative',
                      zIndex: '99999'
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: '40px',
                      fontSize: '14px',
                      fontWeight: '400',
                      textAlign: 'left',
                      borderColor: '#E2E8F0'
                    }),
                    menu: (provided) => ({
                      ...provided,
                      marginTop: '2px'
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused
                        ? '#F2F4F7'
                        : 'transparent',
                      ':active': {
                        backgroundColor: '#F2F4F7'
                      }
                    })
                  }}
                />
              </Box>

              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  borderRadius="40px"
                  height="36px"
                  fontWeight={400}
                  color="text.400"
                  width={{ sm: '100%', base: 'auto' }}
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

              <Box>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="outline"
                    rightIcon={<FiChevronDown />}
                    fontSize={14}
                    borderRadius="40px"
                    height="36px"
                    width={{ sm: '100%', base: 'auto' }}
                    fontWeight={400}
                    color="text.400"
                  >
                    Availability
                  </MenuButton>
                  <MenuList p={5}>
                    <Box>
                      <Box fontSize={14} mb={2} color="#5C5F64">
                        Days
                      </Box>

                      <CustomSelect
                        value={days}
                        isMulti
                        onChange={(v) => setDays(v as Array<any>)}
                        tagVariant="solid"
                        options={dayOptions}
                        size={'md'}
                      />
                    </Box>

                    <Box my={3}>
                      <FormControl>
                        <Box>
                          <Box fontSize={14} my={2} color="#5C5F64">
                            Start Time
                          </Box>
                          <TimePicker
                            inputGroupProps={{
                              size: 'lg'
                            }}
                            inputProps={{
                              size: 'md',
                              placeholder: '01:00 PM'
                            }}
                            value={fromTime}
                            onChange={(v: string) => {
                              setFromTime(v);
                            }}
                          />
                        </Box>

                        <Box>
                          <Box fontSize={14} my={2} color="#5C5F64">
                            End Time
                          </Box>

                          <TimePicker
                            inputGroupProps={{
                              size: 'md'
                            }}
                            inputProps={{
                              placeholder: '06:00 PM'
                            }}
                            value={toTime}
                            onChange={(v: string) => {
                              setToTime(v);
                            }}
                          />
                        </Box>
                      </FormControl>
                    </Box>
                  </MenuList>
                </Menu>
              </Box>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  borderRadius="40px"
                  height="36px"
                  fontWeight={400}
                  color="text.400"
                  width={{ sm: '100%', base: 'auto' }}
                >
                  {price === '' ? 'Price' : price.label}
                </MenuButton>
                <MenuList minWidth={'auto'}>
                  {priceOptions.map((price) => (
                    <MenuItem
                      key={price.id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setPrice(price)}
                    >
                      {price.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  borderRadius="40px"
                  height="36px"
                  fontWeight={400}
                  color="text.400"
                  width={{ sm: '100%', base: 'auto' }}
                >
                  {rating === '' ? 'Rating' : rating.label}
                </MenuButton>
                <MenuList minWidth={'auto'}>
                  {ratingOptions.map((rating) => (
                    <MenuItem
                      key={rating.id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setRating(rating)}
                    >
                      {rating.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </HStack>
            <Spacer />
            <Box
              display={{ base: 'none', md: 'block' }} // Hide on base (mobile) and show from md (medium screens) upwards
            >
              <CustomButton
                buttonText="Clear Filters"
                buttonType="outlined"
                fontStyle={{ fontSize: '12px', fontWeight: 500 }}
                onClick={resetForm}
              />
            </Box>
          </Flex>
        </Box>
        <Box
          display={{
            base: 'block',
            md: 'none'
          }}
          width="100%"
          textAlign="center"
          // width= {{'100%'}},
          // textAlign= {'center'},
          // mt={20}
        >
          <CustomButton
            buttonText="Clear Filters"
            buttonType="outlined"
            fontStyle={{ fontSize: '12px', fontWeight: 500 }}
            onClick={resetForm}
          />
        </Box>
        <Box my={45} py={2} minHeight="750px">
          {!loadingData && allTutors.length > 0 ? (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing="20px"
                ref={tutorGrid}
              >
                {allTutors?.map((tutor: any) => (
                  <TutorCard
                    key={tutor?._id}
                    id={tutor?._id}
                    name={`${tutor?.user?.name?.first} ${tutor?.user?.name?.last} `}
                    levelOfEducation={tutor?.highestLevelOfEducation}
                    avatar={tutor?.user?.avatar}
                    rate={tutor?.rate}
                    description={tutor?.description}
                    rating={tutor?.rating}
                    reviewCount={tutor?.reviewCount}
                    saved={checkBookmarks(tutor?._id)}
                    courses={tutor?.coursesAndLevels?.map((course) => course)}
                    handleSelectedCourse={handleSelectedCourse}
                    isTutorOnline={onlineTutorsId?.includes(tutor?._id)}
                  />
                ))}
              </SimpleGrid>{' '}
              <Pagination
                page={pagination ? pagination.page : 0}
                count={pagination ? pagination.count : 0}
                limit={pagination ? pagination.limit : 0}
                handlePagination={(nextPage) => setPage(nextPage)}
              />
            </>
          ) : (
            !loadingData && (
              <>
                <section className="flex justify-center items-center mt-28 w-full">
                  <div className="text-center">
                    <Image src="/images/notes.png" alt="empty" m="auto" />
                    <Text textAlign={'center'}>No Tutors Found!</Text>
                  </div>
                </section>
              </>
            )
          )}
        </Box>
      </Box>
      <Box position="fixed" bottom={3} right={3}>
        {showOnHover ? (
          <SmallCloseIcon onClick={() => setShowOnHover(false)} />
        ) : (
          <IconButton
            variant="outline"
            color="#207df7"
            borderColor="#207df7"
            p={1}
            aria-label="Send email"
            icon={
              <svg
                fill="#207df7"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 37.273 37.273"
                xmlSpace="preserve"
                stroke="#207df7"
                stroke-width="0.00037273000000000004"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <g>
                    {' '}
                    <path d="M29.643,7.973L27.444,9.41l-6.371-5.219l-1.177,1.436l-6.391-3.526L0,26.358l12.182,6.782l1.327,2.032l0.872-0.569 l0.062,0.052l0.16-0.195l22.67-14.791L29.643,7.973z M1.36,25.97L13.894,3.456l5.36,2.955L3.479,25.675l5.625,4.605L1.36,25.97z M4.887,25.534l1.298-1.586l3.712,5.688L4.887,25.534z M24.189,25.577c-2.213,1.44-5.176,0.819-6.618-1.392 c-1.442-2.214-0.82-5.174,1.394-6.617c2.21-1.444,5.173-0.82,6.616,1.39C27.024,21.171,26.401,24.134,24.189,25.577z M7.362,22.514 L21.215,5.599l5.354,4.383L7.362,22.514z M20.75,19.633l0.896,1.374l0.211-0.124c0.715-0.415,1.262-0.599,1.635-0.554 s0.736,0.334,1.088,0.877c0.379,0.58,0.516,1.072,0.402,1.479c-0.109,0.403-0.492,0.823-1.15,1.25l-0.189,0.129l0.402,0.615 l-0.627,0.408l-0.4-0.615l-0.18,0.111c-0.652,0.426-1.186,0.612-1.6,0.563c-0.41-0.05-0.797-0.354-1.16-0.908l-0.119-0.188 l0.928-0.604l0.062,0.097c0.223,0.337,0.418,0.521,0.59,0.548c0.172,0.029,0.445-0.081,0.82-0.324l0.139-0.085l-0.971-1.489 c-0.73,0.477-1.299,0.695-1.703,0.659c-0.406-0.034-0.799-0.347-1.179-0.927c-0.366-0.561-0.481-1.037-0.35-1.419 c0.133-0.382,0.563-0.812,1.291-1.286l-0.349-0.535l0.625-0.408l0.351,0.533c0.694-0.451,1.235-0.665,1.623-0.632 c0.385,0.031,0.752,0.317,1.104,0.858l0.081,0.123l-0.896,0.586l-0.067-0.094c-0.267-0.408-0.652-0.447-1.162-0.115L20.75,19.633z M20.121,20.036l-0.131,0.092c-0.553,0.359-0.686,0.756-0.398,1.191c0.297,0.455,0.721,0.504,1.269,0.146 c0.004-0.002,0.053-0.029,0.141-0.081L20.121,20.036z M23.123,23.271l0.137-0.086c0.597-0.391,0.728-0.839,0.394-1.354 c-0.183-0.278-0.369-0.418-0.562-0.422c-0.19-0.002-0.496,0.133-0.914,0.405L23.123,23.271z"></path>{' '}
                  </g>{' '}
                </g>
              </svg>
            }
            onMouseEnter={() => setShowOnHover(true)}
            // onMouseLeave={() => setShowOnHover(false)}
            // onFocus={() => setShowOnHover(true)}
          />
        )}

        {showOnHover && (
          <Box
            bg={'white'}
            borderRadius={'10px'}
            width="328px"
            borderColor="grey"
            textAlign="center"
            boxShadow="0px 4px 20px 0px rgba(115, 126, 140, 0.25)"
          >
            <Box borderTopLeftRadius={'10px'} borderTopRightRadius={'10px'}>
              <Sally />
            </Box>
            <VStack p={3} gap={2}>
              <Text>Need Instant Tutoring?</Text>
              <Button
                onClick={
                  user && user.paymentMethods?.length > 0
                    ? openBountyModal
                    : setupPaymentMethod
                }
              >
                Place Bounty
              </Button>
            </VStack>
          </Box>
        )}
      </Box>
      <BountyOfferModal
        isBountyModalOpen={isBountyModalOpen}
        closeBountyModal={closeBountyModal}
      />
      <PaymentDialog
        ref={paymentDialogRef}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={theme.colors.primary[500]} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until one hour before your session.
              You will not be charged if you cancel 24 or more hours before your
              session.
            </AlertDescription>
          </Alert>
        }
      />
    </>
  );
}
