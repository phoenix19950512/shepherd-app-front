import { useTitle } from '../../../hooks';
import ApiService from '../../../services/ApiService';
import offerStore from '../../../state/offerStore';
import TutorCard from '../components/TutorCard';
import { Badge, Box, Center, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ShepherdSpinner from '../components/shepherd-spinner';

function Bounties() {
  useTitle('Bounties');
  const [bountyBids, setBountyBids] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [count, setCount] = useState<number>(5);

  const { fetchOffers, offers, isLoading, pagination } = offerStore();
  const { bountyId } = useParams();

  const doFetchBountyBids = useCallback(async () => {
    setLoadingData(true);
    const response = await ApiService.getBountyBids(bountyId);
    const data: any = await response.json();

    setBountyBids(data.data);
    setLoadingData(false);

    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchBountyBids();
  }, [doFetchBountyBids]);

  // const [pagination, setPagination] = useState<PaginationType>();

  const handlePagination = (nextPage) => {
    fetchOffers(nextPage, limit, 'student');
  };

  const [tutorGrid] = useAutoAnimate();
  if (loadingData) {
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
      <Box p={3}>
        {' '}
        <Flex alignItems={'center'} gap={1}>
          <Box>
            <Text fontSize={24} fontWeight={600} color="text.200">
              Interested Tutors
            </Text>
          </Box>
          <Badge bgColor={'#F4F5F6'} p={2} borderRadius={'6px'}>
            {bountyBids ? bountyBids.length : ''}
          </Badge>
        </Flex>
        <Box>
          {' '}
          {!loadingData && bountyBids.length > 0 ? (
            <>
              {' '}
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing="20px"
                ref={tutorGrid}
                mt={4}
              >
                {bountyBids.map((tutor: any) => (
                  <TutorCard
                    key={tutor.tutor?.id}
                    id={tutor.tutor?.id}
                    avatar={tutor.tutor.user.avatar}
                    name={`${tutor.tutor.user.name.first} ${tutor.tutor.user.name.last}`}
                    levelOfEducation={'BSC'}
                    description={tutor.tutor?.description}
                    rate={tutor.tutor?.rate}
                    rating={tutor.tutor?.rating}
                    reviewCount={tutor.tutor?.reviewCount}
                    // saved={true}
                    use="bounty"
                    bidId={tutor.id}
                    offerStatus={tutor.status}
                  />
                ))}
              </SimpleGrid>{' '}
              {/* <Pagination
                page={pagination.page}
                count={pagination.total}
                limit={pagination.limit}
                handlePagination={handlePagination}
              /> */}
            </>
          ) : (
            !loadingData && (
              <Center>
                <div className="text-center">
                  <img src="/images/notes.png" alt="" />
                  <Text>No Tutors have shown interest yet!</Text>
                  {/* <button
                    type="button"
                    className="inline-flex items-center justify-center mt-4 gap-x-2 w-[286px] rounded-md bg-secondaryBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Create new
                  </button> */}
                </div>
              </Center>
            )
          )}
        </Box>
      </Box>
    </>
  );
}

export default Bounties;
