import {
  Box,
  Checkbox,
  VStack,
  Text,
  Center,
  IconButton,
  HStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export type TableColumn<T = any> = {
  title: string;
  dataIndex?: keyof T;
  key: string;
  render?: (record: T) => JSX.Element;
  align?: 'center' | 'left';
  height?: string | number;
  width?: string | number;
};

export type TableProps<T = any> = {
  columns: any;
  dataSource: T[];
  isSelectable?: boolean;
  onSelect?: (selectedRowKeys: string[]) => void;
  selectedRowKeys?: string[];
  pagination?: boolean;
  currentPage?: number;
  pageCount?: number;
  handlePagination?: (page: number) => void;
};

const SelectableMobileTable = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  isSelectable,
  onSelect,
  selectedRowKeys: selectedKeysProps,
  pagination,
  currentPage = 1,
  pageCount = 1,
  handlePagination
}: TableProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(
    selectedKeysProps || []
  );
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const handleSelect = (record: T) => {
    const key = record.key as string;
    let newSelectedKeys;
    if (selectedRowKeys.includes(key)) {
      newSelectedKeys = selectedRowKeys.filter((k) => k !== key);
    } else {
      newSelectedKeys = [...selectedRowKeys, key];
    }
    setSelectedRowKeys(newSelectedKeys);
    onSelect && onSelect(newSelectedKeys);
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
    <VStack spacing={4} width="100%">
      {isSelectable && (
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={4}
        >
          <Checkbox isChecked={allChecked} onChange={handleSelectAll} mb={2}>
            Select All
          </Checkbox>
        </Box>
      )}
      {dataSource.map((record) => (
        <Box
          key={record.key as string}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          width="100%"
          bg={
            selectedRowKeys.includes(record.key as string)
              ? 'gray.100'
              : 'white'
          }
        >
          {isSelectable && (
            <Checkbox
              isChecked={selectedRowKeys.includes(record.key as string)}
              onChange={() => handleSelect(record)}
              mb={2}
            />
          )}
          {columns.map((col) => (
            <Box
              key={col.key}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              textAlign={col.align || 'left'}
              width={col.width}
              height={col.height}
              mb={2}
            >
              <Text fontSize="sm" fontWeight="bold">
                {col.title}
              </Text>
              <Text fontSize="sm">
                {col.render
                  ? col.render(record)
                  : record[col.dataIndex as keyof T]}
              </Text>
            </Box>
          ))}
        </Box>
      ))}
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
          <Text fontWeight="bold" fontSize="12px">
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
    </VStack>
  );
};

export default SelectableMobileTable;
