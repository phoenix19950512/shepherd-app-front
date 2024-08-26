import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  ChangeEvent
} from 'react';
import {
  Grid,
  Box,
  Center,
  Divider,
  Flex,
  Image,
  Text,
  Input,
  Button,
  Spacer,
  SimpleGrid,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';

import { useNavigate } from 'react-router';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import SubjectCard from '../../../components/SubjectCard';
import studyPlanStore from '../../../state/studyPlanStore';
import resourceStore from '../../../state/resourceStore';
import userStore from '../../../state/userStore';
import moment from 'moment';
import Pagination from '../components/Pagination';
import ShepherdSpinner from '../components/shepherd-spinner';
import ApiService from '../../../services/ApiService';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import { MdCancel, MdGraphicEq } from 'react-icons/md';
import Select, { components } from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
import { GiCancel } from 'react-icons/gi';
import { MultiSelect } from 'react-multi-select-component';
import { ChevronDownIcon } from '@chakra-ui/icons';

function StudyPlans() {
  const { fetchPlans, studyPlans, pagination, isLoading, deleteStudyPlan } =
    studyPlanStore();
  const { user } = userStore();

  const { courses: courseList, studyPlanCourses } = resourceStore();
  const [selectedPlan, setSelectedPlan] = useState<string>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tutorGrid] = useAutoAnimate();
  const navigate = useNavigate();
  const toast = useCustomToast();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [subject, setSubject] = useState<any>([]);

  const {
    isOpen: isConfirmDeleteOpen,
    onOpen: openConfirmDelete,
    onClose: closeConfirmDelete
  } = useDisclosure();

  const isTutor = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <Box as={FiChevronDown} color={'text.400'} />
      </components.DropdownIndicator>
    );
  };
  const doFetchStudyPlans = useCallback(async () => {
    await fetchPlans(page, limit);
  }, [fetchPlans, page, limit]);

  useEffect(() => {
    doFetchStudyPlans();
  }, [doFetchStudyPlans]);

  const handlePagination = (nextPage: number) => {
    fetchPlans(nextPage, limit);
  };

  const handleDeletePlan = async (id: string) => {
    try {
      const resp: any = await deleteStudyPlan(id);
      closeConfirmDelete();
      if (resp.status === 200) {
        toast({
          title: 'Plan Deleted Successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
        // fetchPlans(page, limit);
      } else {
        // setLoading(false);
        toast({
          title: 'Failed to delete, try again',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (error: any) {
      // setLoading(false);
    }
  };
  function getSubject(id) {
    const labelFromCourseList = courseList
      .map((course) => (course._id === id ? course.label : null))
      .filter((label) => label !== null);

    const labelFromStudyPlanCourses = studyPlanCourses
      .map((course) => (course._id === id ? course.label : null))
      .filter((label) => label !== null);

    const allLabels = [...labelFromCourseList, ...labelFromStudyPlanCourses];

    return allLabels.length > 0 ? allLabels[0] : null;
  }
  const handleScoreChange = (newMinScore, newMaxScore) => {
    setMinScore(newMinScore);
    setMaxScore(newMaxScore);
    fetchPlans(page, limit, newMinScore, newMaxScore, searchTerm, subject);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    fetchPlans(page, limit, minScore, maxScore, newSearchTerm, subject);
  };

  const handleSubjectChange = (selectedOptions) => {
    setSubject(selectedOptions);
    const selectedSubjects = selectedOptions
      .map((option) => getSubject(option.value))
      .join(',');

    fetchPlans(page, limit, minScore, maxScore, searchTerm, selectedSubjects);
  };
  // const handleSelectionChange = (selectedOptions: Option[]) => {
  //   setMultiSelected(selectedOptions);

  //   const selectedTags = selectedOptions
  //     .map((option) => option.value)
  //     .join(',');

  //   const query: { [key: string]: any } = {};
  //   if (selectedTags) {
  //     query.tags = selectedTags;
  //   }

  //   fetchFlashcards(query);
  // };

  const subjectOptions: any =
    studyPlanCourses?.map((item, index) => ({
      value: item._id,
      label: item.label,
      id: item._id
    })) || [];

  // if (isLoading) {
  //   return (
  //     <Box
  //       p={5}
  //       textAlign="center"
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh'
  //       }}
  //     >
  //       <ShepherdSpinner />
  //     </Box>
  //   );
  // }
  const clearFilters = () => {
    setMinScore(0);
    setMaxScore(100);
    setSearchTerm('');
    setSubject([]);
  };

  return (
    <Box height={'100vh'}>
      <Flex p={3} justifyContent="space-between" alignItems="center" gap={1}>
        <Box>
          <Text fontSize={24} fontWeight={600} color="text.200">
            Study Plans
          </Text>
          <Text fontSize={14} fontWeight={400} color="text.300">
            Chart success: Monitor your personalized study plans.
          </Text>
        </Box>
        <Spacer />
        <Flex gap={2} alignItems="center">
          <MdCancel size={'50px'} color="lightgray" onClick={clearFilters} />
          <Box marginRight={'-15px'}>
            <MultiSelect
              options={subjectOptions}
              value={subject}
              onChange={handleSubjectChange}
              labelledBy="Select"
              valueRenderer={() => (
                <span
                  style={{
                    color: '#8c8c8c',
                    fontSize: '0.875rem'
                  }}
                >
                  Filter By Subjects
                </span>
              )}
            />
          </Box>
          <Box>
            {' '}
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<ChevronDownIcon boxSize={30} color="#bbb" />}
                color="#8c8c8c"
                fontSize="0.875rem"
                h="35px"
                w="full"
                borderRadius={'7px'}
                fontWeight={400}
              >
                Readiness Score
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Flex w="full" gap={2}>
                    {' '}
                    <Text fontSize={14}> {minScore}</Text>
                    <RangeSlider
                      aria-label={['min', 'max']}
                      defaultValue={[minScore, maxScore]}
                      onChangeEnd={(values) =>
                        handleScoreChange(values[0], values[1])
                      }
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack bg="blue.50" />
                      </RangeSliderTrack>
                      <RangeSliderThumb
                        index={0}
                        bg="#207df7"
                      ></RangeSliderThumb>
                      <RangeSliderThumb index={1} bg="#207df7" />
                    </RangeSlider>
                    <Text fontSize={14}> {maxScore}</Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            fontSize="0.875rem"
            whiteSpace="nowrap"
            h="35px"
          />
        </Flex>
        {studyPlans.length > 0 && (
          <Button
            size={'md'}
            isDisabled={user.school && user.userRole !== 'tutor'}
            onClick={() => {
              const baseUrl = isTutor
                ? '/dashboard/tutordashboard'
                : '/dashboard';
              navigate(`${baseUrl}/create-study-plans`);
            }}
          >
            Create New
          </Button>
        )}
      </Flex>
      {isLoading ? (
        <Box
          p={5}
          textAlign="center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <ShepherdSpinner />
        </Box>
      ) : studyPlans.length > 0 ? (
        <>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing="20px"
            ref={tutorGrid}
            mt={4}
            p={2}
          >
            {studyPlans.map((plan: any) => (
              <SubjectCard
                key={plan._id}
                title={plan.title || getSubject(plan.course)}
                subjectId={plan.course}
                score={plan.readinessScore}
                scoreColor="green"
                date={moment(plan.createdAt).format('DD MMM, YYYY')}
                handleClick={() => navigate(`planId=${plan._id}`)}
                handleDelete={() => {
                  setSelectedPlan(plan._id);
                  openConfirmDelete();
                }}
              />
            ))}
          </SimpleGrid>
          <Pagination
            page={pagination.page}
            count={pagination.total}
            limit={pagination.limit}
            handlePagination={handlePagination}
          />
        </>
      ) : (
        <section className="flex justify-center items-center mt-28 w-full">
          <div className="text-center">
            <img src="/images/notes.png" alt="" />
            <Text>You don't have any study plans yet!</Text>
            <Button
              onClick={() => {
                const baseUrl = isTutor
                  ? '/dashboard/tutordashboard'
                  : '/dashboard';
                navigate(`${baseUrl}/create-study-plans`);
              }}
              isDisabled={user.school && user.userRole !== 'tutor'}
            >
              Create New
            </Button>
          </div>
        </section>
      )}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={closeConfirmDelete}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Center flexDirection={'column'}>
              <Box>
                <svg
                  width="90"
                  height="70"
                  viewBox="0 0 73 62"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_2506_16927)">
                    <circle cx="36.5" cy="28" r="20" fill="white" />
                    <circle
                      cx="36.5"
                      cy="28"
                      r="19.65"
                      stroke="#EAEAEB"
                      stroke-width="0.7"
                    />
                  </g>
                  <path
                    d="M36.5002 37.1663C31.4376 37.1663 27.3335 33.0622 27.3335 27.9997C27.3335 22.9371 31.4376 18.833 36.5002 18.833C41.5627 18.833 45.6668 22.9371 45.6668 27.9997C45.6668 33.0622 41.5627 37.1663 36.5002 37.1663ZM35.5835 30.7497V32.583H37.4168V30.7497H35.5835ZM35.5835 23.4163V28.9163H37.4168V23.4163H35.5835Z"
                    fill="#F53535"
                  />
                  <defs>
                    <filter
                      id="filter0_d_2506_16927"
                      x="0.5"
                      y="0"
                      width="72"
                      height="72"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="8" />
                      <feGaussianBlur stdDeviation="8" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.32 0 0 0 0 0.389333 0 0 0 0 0.48 0 0 0 0.11 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2506_16927"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2506_16927"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </Box>
              <Text my={2} fontSize={20} fontWeight="bold">
                Are You Sure?
              </Text>
              <Text align={'center'}>
                Are you sure you want to delete this plan?. All resources
                associated with this plan will be lost
              </Text>
            </Center>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button onClick={closeConfirmDelete} w="50%" variant="outline">
              Cancel
            </Button>
            <Spacer />
            <Button
              color="white"
              bg="red.400"
              _hover={{ bg: 'darkred' }}
              w="50%"
              onClick={() => handleDeletePlan(selectedPlan)}
              // isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default StudyPlans;
