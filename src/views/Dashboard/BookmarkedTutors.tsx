import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import Pagination from './components/Pagination';
import TutorCard from './components/TutorCard';
import { Box, Flex, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useCallback, useEffect, useState } from 'react';

function BookmarkedTutors() {
  const {
    fetchBookmarkedTutors,
    tutors: allTutors,
    pagination
  } = bookmarkedTutorsStore();

  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
    /* eslint-disable */
  }, []);
  // const [pagination, setPagination] = useState<PaginationType>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [count, setCount] = useState<number>(5);
  const [days, setDays] = useState<Array<any>>([]);

  const handleNextPage = () => {
    const nextPage = pagination.page + 1;
    fetchBookmarkedTutors();
  };

  const handlePreviousPage = () => {
    const prevPage = pagination.page - 1;
    fetchBookmarkedTutors();
  };

  useEffect(() => {
    doFetchBookmarkedTutors();
  }, [doFetchBookmarkedTutors]);

  const [tutorGrid] = useAutoAnimate();

  return (
    <>
      <Box p={3} minH={'100vh'}>
        {' '}
        <Flex alignItems={'center'} gap={1}>
          <Box>
            <Text fontSize={24} fontWeight={600} color="text.200" mb={0}>
              Saved Tutors
            </Text>
            <Text fontSize={16} fontWeight={400} color="text.300">
              Keep up with tutors whose profile you’ve saved
            </Text>
          </Box>
        </Flex>
        {allTutors.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing="20px"
            ref={tutorGrid}
            mt={4}
          >
            {allTutors?.map((tutor: any) => (
              <TutorCard
                key={tutor.tutor?._id}
                id={tutor.tutor?._id}
                name={`${tutor.tutor.user.name.first} ${tutor.tutor.user.name.last}`}
                levelOfEducation={'BSC'}
                avatar={tutor.tutor.user.avatar}
                saved={true}
                description={tutor.tutor?.description}
                rate={tutor.tutor?.rate}
                rating={tutor.tutor?.rating}
                reviewCount={tutor.tutor?.reviewCount}
              />
            ))}
          </SimpleGrid>
        ) : (
          <>
            <section className="flex justify-center items-center mt-28 w-full">
              <div className="text-center">
                <Image src="/images/notes.png" alt="empty" m="auto" />
                <Text textAlign={'center'}>
                  You currently have no saved shepherds!
                </Text>
              </div>
            </section>
          </>
        )}
        {/* <Pagination
          page={pagination.page}
          count={pagination.total}
          limit={pagination.limit}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        /> */}
      </Box>
    </>
  );
}

export default BookmarkedTutors;
