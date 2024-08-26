import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

type PaginationProps = {
  page: number;
  limit: number;
  count: number;
  handlePagination?: (page: number) => void; // Callback when a page is changed
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  count,
  handlePagination
}) => {
  const totalPages = Math.ceil(count / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, count);

  const isOnFirstPage = page === 1;
  const isOnLastPage = page === totalPages;

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center" mt={4} gap={1}>
        <Text fontSize={14} color="text.400">
          {startIndex} - {endIndex} of {count}
        </Text>
        <IconButton
          icon={<RiArrowLeftSLine />}
          onClick={() => handlePagination && handlePagination(page - 1)}
          isDisabled={isOnFirstPage}
          color={isOnFirstPage ? '#CACCCE' : 'text.300'}
          border="1px solid #EFEFF0"
          bgColor="transparent"
          aria-label="Previous Page"
        />
        <IconButton
          icon={<RiArrowRightSLine />}
          onClick={() => handlePagination && handlePagination(page + 1)}
          isDisabled={isOnLastPage}
          color={isOnLastPage ? '#CACCCE' : 'text.300'}
          border="1px solid #EFEFF0"
          bgColor="transparent"
          aria-label="Next Page"
        />
      </Flex>
    </Box>
  );
};

export default Pagination;
