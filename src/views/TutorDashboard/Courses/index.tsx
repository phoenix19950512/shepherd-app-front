import { AllClientTab } from '../../../components';
import CustomTabs from '../../../components/CustomComponents/CustomTabs';
import ApiService from '../../../services/ApiService';
import {
  FlexContainer,
  NotesWrapper,
  StyledHeader
} from '../../Dashboard/Notes/styles';
import {
  Text,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import React, { useState, useCallback, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import ShepherdSpinner from '../../Dashboard/components/shepherd-spinner';
import userStore from '../../../state/userStore';
import AllSchoolStudentsTab from '../../../components/schoolStudentsTab';
import clientStore from '../../../state/clientStore';
import AllSchoolCoursesTab from '../../../components/schoolCoursesTab';

const getNotes = JSON.parse(localStorage.getItem('notes') as string) || [];

const filteredBy = [
  {
    id: 1,
    value: '#Chemistry',
    checked: false
  },
  {
    id: 2,
    value: '#Physics',
    checked: false
  },
  {
    id: 3,
    value: '#Biology',
    checked: false
  },
  {
    id: 4,
    value: '#English',
    checked: false
  }
];

const sortedBy = [
  {
    id: 1,
    title: 'By date',
    firstValue: 'Start Date',
    secondValue: 'End Date'
  },
  {
    id: 2,
    title: 'By name',
    firstValue: 'A -> Z',
    secondValue: 'Z -> A'
  }
];

const Courses = () => {
  const navigate = useNavigate();
  const { user: userData } = userStore();
  const { fetchSchoolCourses, schoolStudents, schoolCourses } = clientStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allTutorClients, setAllTutorClients] = useState<any>([]);
  const [allSchoolCourses, setAllSchoolCourses] = useState<any>([]);

  const doFetchSchoolCourses = useCallback(async () => {
    const response: any = await fetchSchoolCourses();

    // const jsonResp = await response.json();
    console.log(response);

    setAllSchoolCourses(schoolCourses);
    setIsLoading(false);

    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchSchoolCourses();
  }, [doFetchSchoolCourses]);

  const [checkedState, setCheckedState] = useState(
    new Array(filteredBy.length).fill(false)
  );
  console.log(allSchoolCourses, schoolCourses);

  const handleCheckboxChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  const sortByStartDate = (direction) => {
    const sortedWithStartDate = [...allTutorClients].filter(
      (item) => item.offer?.contractStartDate
    );
    const sortedWithoutStartDate = [...allTutorClients].filter(
      (item) => !item.offer
    );

    const sortedArray = sortedWithStartDate.sort((a, b) => {
      if (direction === 'ASC') {
        return a.offer.contractStartDate.localeCompare(
          b.offer?.contractStartDate
        );
      } else {
        return b.offer.contractStartDate.localeCompare(
          a.offer?.contractStartDate
        );
      }
    });

    direction === 'ASC'
      ? setAllTutorClients([...sortedArray, ...sortedWithoutStartDate])
      : setAllTutorClients([...sortedWithoutStartDate, ...sortedArray]);
  };

  const sortByEndDate = (direction) => {
    const sortedWithEndDate = [...allTutorClients].filter(
      (item) => item.offer?.contractEndDate
    );
    const sortedWithoutEndDate = [...allTutorClients].filter(
      (item) => !item.offer
    );

    const sortedArray = sortedWithEndDate.sort((a, b) => {
      if (direction === 'ASC') {
        return a.offer.contractEndDate.localeCompare(b.offer.contractEndDate);
      } else {
        return b.offer.contractEndDate.localeCompare(a.offer.contractEndDate);
      }
    });

    direction === 'ASC'
      ? setAllTutorClients([...sortedArray, ...sortedWithoutEndDate])
      : setAllTutorClients([...sortedWithoutEndDate, ...sortedArray]);
  };

  const sortByClientName = (direction) => {
    const sortedClients = [...allTutorClients].sort((a, b) => {
      const nameA = a.student.user.name.first.toLowerCase();
      const nameB = b.student.user.name.first.toLowerCase();

      if (direction === 'DESC') {
        return nameB.localeCompare(nameA);
      } else {
        return nameA.localeCompare(nameB);
      }
    });

    setAllTutorClients(sortedClients);
  };

  if (isLoading) {
    return (
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
    );
  }
  return (
    <>
      <NotesWrapper>
        <header className="flex m-4 justify-between">
          <StyledHeader>
            <span className="font-bold"> School Courses</span>
            <span className="count-badge">{schoolCourses?.length}</span>
          </StyledHeader>
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
                  onClick={() => sortByClientName('ASC')}
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Course name (A-Z)
                </MenuItem>
                <MenuItem
                  _hover={{ bgColor: '#F2F4F7' }}
                  color="#212224"
                  fontSize="14px"
                  onClick={() => sortByClientName('DESC')}
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Course name (Z-A)
                </MenuItem>
              </MenuList>
            </Menu>
          </FlexContainer>
        </header>

        <AllSchoolCoursesTab allSchoolCourses={schoolCourses} />
      </NotesWrapper>
    </>
  );
};

export default Courses;
