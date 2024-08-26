import { StyledTd, StyledTh, StyledTr } from './styles';
import {
  Table,
  Thead,
  Tbody,
  Checkbox,
  Box,
  HStack,
  Center,
  IconButton,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '2px',
    height: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#F2F4F7',
    borderRadius: '15px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#F2F4F7',
    borderRadius: '15px'
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#888 #F2F4F7'
};

export type TableColumn<T = any> = {
  title: string;
  dataIndex?: keyof T;
  key: string;
  scrollX?: boolean; // New
  scrollY?: boolean; // New
  render?: (record: T) => JSX.Element;
  align?: 'center' | 'left';
  id?: number;
  height?: string | number; // <-- Added optional height
  width?: string | number; // <-- Add this line for the optional width
};

export type TableProps<T = any> = {
  columns: TableColumn<T>[];
  dataSource: T[];
  isSelectable?: boolean;
  onSelect?: (selectedRowKeys: string[]) => void;
  fileImage?: any;
  selectedRowKeys?: string[];
  setSelectedRowKeys?: React.Dispatch<React.SetStateAction<string[]>>;
  handleSelectAll?: () => void;
  allChecked?: boolean;
  setAllChecked?: any;
  setSelectedNoteIdToDelete?: any;
  selectedNoteIdToDelete?: any;
  setSelectedNoteIdToDeleteArray?: any;
  selectedNoteIdToDeleteArray?: any;
  selectedNoteIdToAddTagsArray?: any;
  setSelectedNoteIdToAddTagsArray?: any;
  setSelectedNoteIdToAddTags?: any;
  selectedNoteIdToAddTags?: any;
  pagination?: boolean; // To conditionally render pagination
  currentPage?: number; // Current page number
  pageCount?: number; // Total number of pages
  handlePagination?: (page: number) => void; // Callback when a page is changed
  handleSelect?: any;
};

const SelectableTable = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  isSelectable,
  onSelect,
  selectedRowKeys: selectedKeysProps,
  handleSelectAll: handleSelectAllProps,
  allChecked: allCheckProps,
  setSelectedNoteIdToAddTagsArray,
  selectedNoteIdToAddTagsArray,
  selectedNoteIdToAddTags,
  setSelectedNoteIdToAddTags,
  pagination,
  currentPage = 1,
  pageCount = 1,
  handlePagination,
  handleSelect: handleSelectProps
}: TableProps<T>) => {
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
      <div style={{ overflowX: 'auto' }}>
        <Table
          size="sm"
          variant="unstyled"
          width={{ base: '100em', md: '100%' }}
        >
          <Thead marginBottom={10}>
            <StyledTr>
              {isSelectable && (
                <StyledTh>
                  <Checkbox isChecked={allChecked} onChange={handleSelectAll} />
                </StyledTh>
              )}

              {columns.map((col) => (
                <StyledTh
                  key={col.key}
                  textAlign={col.align || 'left'}
                  width={col.width}
                  flex={true}
                >
                  {col.title}
                </StyledTh>
              ))}
            </StyledTr>
          </Thead>
          <Tbody>
            {dataSource.map((record) => (
              <StyledTr
                key={record.key as string}
                active={selectedRowKeys?.includes(record.key as string)}
                selectable={isSelectable}
              >
                {isSelectable && (
                  <StyledTd tagsColor={[record.tags].includes('#Che')}>
                    <div style={{ padding: '0 5px' }}>
                      <Checkbox
                        borderRadius={'5px'}
                        isChecked={selectedRowKeys?.includes(
                          record.key as string
                        )}
                        onChange={() => handleSelect(record)}
                      />
                    </div>
                  </StyledTd>
                )}

                {columns.map((col) => (
                  <StyledTd
                    key={col.key}
                    fontWeight="500"
                    maxW={col.width}
                    marginRight={col.width && '10px'}
                    maxH={col.height}
                    overflowX={col.scrollX ? 'hidden' : 'auto'}
                    overflowY={col.scrollY ? 'hidden' : 'auto'}
                    css={scrollbarStyles}
                    textAlign={col.align || 'left'}
                    style={{
                      width: col.width,
                      height: col.height
                    }}
                    tagsColor={
                      col.dataIndex === 'tags' ? record.tags : '#585f68'
                    }
                  >
                    {col.render
                      ? col.render(record)
                      : col.dataIndex
                      ? record[col?.dataIndex]
                      : null}
                  </StyledTd>
                ))}
              </StyledTr>
            ))}
          </Tbody>
        </Table>
      </div>

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

export default SelectableTable;
