import {
  Box,
  Checkbox,
  VStack,
  HStack,
  IconButton,
  Text,
  Center
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export type TableColumn<T = any> = {
  title: string;
  dataIndex?: keyof T;
  key: string;
  render?: (record: T) => JSX.Element;
  align?: 'center' | 'left';
};

export type MobileListProps<T = any> = {
  columns: any;
  dataSource: T[];
  isSelectable?: boolean;
  onSelect?: (selectedRowKeys: string[]) => void;
  selectedRowKeys?: string[];
  handleSelectAll?: () => void;
  allChecked?: boolean;
  pagination?: boolean;
  currentPage?: number;
  pageCount?: number;
  handlePagination?: (page: number) => void;
};

const MobileList = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  isSelectable,
  onSelect,
  selectedRowKeys: selectedKeysProps,
  handleSelectAll: handleSelectAllProps,
  allChecked: allCheckProps,
  pagination,
  currentPage = 1,
  pageCount = 1,
  handlePagination
}: MobileListProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(
    selectedKeysProps || []
  );
  const [allChecked, setAllChecked] = useState<boolean>(allCheckProps || false);

  const handleSelect = (record: T) => {
    const key = record.key as string;
    if (selectedRowKeys.includes(key)) {
      setSelectedRowKeys(selectedRowKeys.filter((k) => k !== key));
      onSelect && onSelect(selectedRowKeys.filter((k) => k !== key));
    } else {
      setSelectedRowKeys([...selectedRowKeys, key]);
      onSelect && onSelect([...selectedRowKeys, key]);
    }
  };

  const handleSelectAll = () => {
    if (!allChecked) {
      const newSelectedRowKeys = dataSource.map((data) => data.key as string);
      setSelectedRowKeys(newSelectedRowKeys);
      onSelect && onSelect(newSelectedRowKeys);
    } else {
      setSelectedRowKeys([]);
      onSelect && onSelect([]);
    }
    setAllChecked(!allChecked);
  };

  return (
    <Box>
      {isSelectable && (
        <HStack mb={4}>
          <Checkbox isChecked={allChecked} onChange={handleSelectAll} />
          <Text>Select All</Text>
        </HStack>
      )}
      <VStack spacing={4} align="stretch">
        {dataSource.map((record) => (
          <Box
            key={record.key as string}
            borderWidth="1px"
            borderRadius="lg"
            padding={4}
            backgroundColor={
              selectedRowKeys.includes(record.key as string)
                ? 'gray.100'
                : 'white'
            }
          >
            {isSelectable && (
              <HStack mb={2}>
                <Checkbox
                  isChecked={selectedRowKeys.includes(record.key as string)}
                  onChange={() => handleSelect(record)}
                />
                {/* <Text>Select</Text> */}
              </HStack>
            )}
            {columns.map((col) => (
              <Box
                key={col.key}
                mb={2}
                display="flex"
                justifyContent="space-between"
                alignContent="center"
              >
                <Text fontWeight="bold">{col.title}</Text>
                <Text>
                  {col.render
                    ? col.render(record)
                    : col.dataIndex
                    ? record[col.dataIndex]
                    : null}
                </Text>
              </Box>
            ))}
          </Box>
        ))}
      </VStack>

      {pagination && (
        <Center mt={4}>
          <IconButton
            size="sm"
            icon={<FaChevronLeft />}
            aria-label="Previous Page"
            isDisabled={currentPage <= 1}
            onClick={() =>
              handlePagination && handlePagination(currentPage - 1)
            }
            colorScheme="gray"
            variant="outline"
            fontSize="12px"
            mr={2}
          />

          <Text fontWeight={'bold'} fontSize="12px">
            {currentPage} / {pageCount}
          </Text>

          <IconButton
            size="sm"
            icon={<FaChevronRight />}
            aria-label="Next Page"
            isDisabled={currentPage >= pageCount}
            onClick={() =>
              handlePagination && handlePagination(currentPage + 1)
            }
            colorScheme="gray"
            variant="outline"
            fontSize="12px"
            ml={2}
          />
        </Center>
      )}
    </Box>
  );
};

export default MobileList;
