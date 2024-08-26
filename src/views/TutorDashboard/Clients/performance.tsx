import { AllClientTab } from '../../../components';
import StudentPerformanceTab from '../../../components/performanceTab';
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
import { useNavigate, useParams } from 'react-router';
import ShepherdSpinner from '../../Dashboard/components/shepherd-spinner';

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

const Performance = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  console.log(clientId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [performanceReport, setPerformanceReport] = useState<any>([]);

  const doFetchTutorClients = useCallback(async () => {
    try {
      const response = await ApiService.getStudentPerformance(clientId);
      const { data } = await response.json();
      setPerformanceReport(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchTutorClients();
  }, [doFetchTutorClients]);

  const [checkedState, setCheckedState] = useState(
    new Array(filteredBy.length).fill(false)
  );

  const tabLists = [
    {
      id: 1,
      title: 'All'
    },

    {
      id: 2,
      title: 'In Progress'
    },
    {
      id: 3,
      title: 'Not Started'
    },

    {
      id: 4,
      title: 'Complete'
    }
  ];

  // const tabPanel = [
  //   {
  //     id: 1,
  //     component: <StudentPerformanceTab performanceReport={performanceReport} />
  //   },
  //   {
  //     id: 2,
  //     component: (
  //       <StudentPerformanceTab
  //         performanceReport={performanceReport.filter(
  //           (client) => client?.offer?.expired === false
  //         )}
  //       />
  //     )
  //   },
  //   {
  //     id: 3,
  //     component: (
  //       <StudentPerformanceTab
  //         allTutorClients={allTutorClients.filter(
  //           (client) => client?.offer?.expired === false
  //         )}
  //       />
  //     )
  //   },
  //   {
  //     id: 4,
  //     component: (
  //       <StudentPerformanceTab
  //         allTutorClients={allTutorClients.filter(
  //           (client) => client?.offer?.expired === true
  //         )}
  //       />
  //     )
  //   }
  // ];
  // const createNewLists = [
  //   {
  //     id: 1,
  //     iconName: <NewNoteIcon />,
  //     labelText: 'New note',
  //     onClick: () => navigate('/dashboard/new-note')
  //   },
  //   {
  //     id: 2,
  //     iconName: <DocIcon />,
  //     labelText: 'Upload document',
  //     // onClick: activateHelpModal
  //     onClick: () => navigate('/dashboard/new-note')
  //   }
  // ];

  const handleCheckboxChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  const sortByStartDate = (direction) => {
    const sortedWithStartDate = [...performanceReport].filter(
      (item) => item.offer?.contractStartDate
    );
    const sortedWithoutStartDate = [...performanceReport].filter(
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
      ? setPerformanceReport([...sortedArray, ...sortedWithoutStartDate])
      : setPerformanceReport([...sortedWithoutStartDate, ...sortedArray]);
  };

  const sortByEndDate = (direction) => {
    const sortedWithEndDate = [...performanceReport].filter(
      (item) => item.offer?.contractEndDate
    );
    const sortedWithoutEndDate = [...performanceReport].filter(
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
      ? setPerformanceReport([...sortedArray, ...sortedWithoutEndDate])
      : setPerformanceReport([...sortedWithoutEndDate, ...sortedArray]);
  };

  const sortByClientName = (direction) => {
    const sortedClients = [...performanceReport].sort((a, b) => {
      const nameA = a.student.user.name.first.toLowerCase();
      const nameB = b.student.user.name.first.toLowerCase();

      if (direction === 'DESC') {
        return nameB.localeCompare(nameA);
      } else {
        return nameA.localeCompare(nameB);
      }
    });

    setPerformanceReport(sortedClients);
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
        <header className="flex my-4 justify-between">
          <Box>
            <StyledHeader>
              <p className="font-bold">
                {' '}
                {`${performanceReport?.student?.user?.name?.first} ${performanceReport?.student?.user?.name?.last}'s `}
                Performance
              </p>
            </StyledHeader>
            <Text fontSize="sm">
              {` Keep up with ${performanceReport?.student?.user?.name?.first}'s learning progress`}
            </Text>
          </Box>
          <FlexContainer>
            {/* <Menu>
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
                  color="#212224"
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={() => sortByStartDate('DESC')}
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Start Date
                </MenuItem>
                <MenuItem
                  color="#212224"
                  fontSize="14px"
                  onClick={() => sortByEndDate('DESC')}
                  _hover={{ bgColor: '#F2F4F7' }}
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  End Date
                </MenuItem>
                <MenuItem
                  _hover={{ bgColor: '#F2F4F7' }}
                  color="#212224"
                  fontSize="14px"
                  onClick={() => sortByClientName('ASC')}
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Student name (A-Z)
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
                  Student name (Z-A)
                </MenuItem>
              </MenuList>
            </Menu> */}
          </FlexContainer>
        </header>
        {/* <CustomTabs tablists={tabLists} tabPanel={tabPanel} /> */}
        <StudentPerformanceTab performanceReport={performanceReport} />
      </NotesWrapper>
    </>
  );
};

export default Performance;
