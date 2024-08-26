import {
  Box,
  Checkbox,
  Text,
  Input,
  Menu,
  MenuItem,
  MenuButton,
  IconButton,
  MenuList,
  Flex,
  Button
} from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FaFilter as FilterIcon, FaSearch as SearchIcon } from 'react-icons/fa';

interface FilterItem {
  id: number | string;
  value: string;
}

interface DropdownFilterProps {
  items: FilterItem[];
  selectedItems?: Array<number | string>;
  onSelectionChange: (
    selectedItems: Array<string | number> | string | number
  ) => void;
  style?: React.CSSProperties;
  showSearch?: boolean;
  multi?: boolean;
  filterLabel?: string;
}

// let onMenuClose: (() => void) | undefined = undefined;

type SelectedItems = Array<string | number>;

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  style = {},
  showSearch = true,
  multi = true,
  filterLabel = 'Filter'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [hasFilteredOnce, setHasFilteredOnce] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<
    Array<string | number>
  >([]);

  useEffect(() => {
    if (selectedItems) {
      setSelectedItemIds(selectedItems);
    }
  }, [selectedItems]);

  useEffect(() => {
    throttledHandleSelectionChange(selectedItemIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemIds]);

  const clearAllSelections = useCallback(() => {
    setSelectedItemIds([]);
    onSelectionChange([]);
  }, [onSelectionChange]);

  const handleSearchChange = useCallback(
    throttle((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredItems(items);
    } else {
      const result = items.filter((item) =>
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(result);
    }
  }, [searchTerm, items]);

  const menuCloseRef = useRef<(() => void) | null>(null);

  const closeTimerRef = useRef<number | null>(null);

  const startCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      menuCloseRef.current && menuCloseRef.current();
    }, 3000);
  };

  const handleSelectionChange = useCallback(
    (ids: SelectedItems) => {
      if (ids.length || hasFilteredOnce) {
        if (!hasFilteredOnce) {
          setHasFilteredOnce(true);
        }
        onSelectionChange(ids);
        menuCloseRef.current && menuCloseRef.current();
      }
    },
    [hasFilteredOnce, onSelectionChange]
  );

  const throttledHandleSelectionChange = useMemo(
    () => throttle((ids) => handleSelectionChange(ids), 3000),
    [handleSelectionChange]
  );

  const handleCheckboxChange = (itemId: number | string) => {
    if (multi) {
      setSelectedItemIds((prevState) => {
        const newIds = prevState.includes(itemId)
          ? prevState.filter((id) => id !== itemId)
          : [...prevState, itemId];
        // throttledHandleSelectionChange([itemId]);
        return newIds;
      });
    } else {
      setSelectedItemIds([itemId]);
      // throttledHandleSelectionChange([itemId]);
    }
    // startCloseTimer();
  };

  return (
    <Menu closeOnSelect={false}>
      {({ onClose }) => {
        menuCloseRef.current = onClose;

        return (
          <>
            <MenuButton style={style}>
              <Flex
                cursor="pointer"
                border="1px solid #E5E6E6"
                padding="5px 10px"
                borderRadius="6px"
                alignItems="center"
                mb={{ base: '10px', md: '0' }}
                width={{ base: '-webkit-fill-available', md: 'auto' }}
              >
                <Box display="flex" p="0">
                  <Text
                    fontWeight="400"
                    fontSize={{ base: '12px', md: '14px' }}
                    marginRight="5px"
                    color="#5E6164"
                    width={{ base: '100%', md: 'auto' }}
                  >
                    {filterLabel}
                  </Text>
                  <Text
                    fontWeight="500"
                    fontSize={{ base: '12px', md: '14px' }}
                    marginRight="5px"
                    color="#5E6164"
                    ml="0.5px"
                    width={{ base: '100%', md: 'auto' }}
                  >
                    {`(${selectedItemIds.length})`}
                  </Text>
                </Box>

                <FilterIcon color="#96999C" size="12px" />
              </Flex>
            </MenuButton>
            <MenuList
              fontSize="14px"
              minWidth={'185px'}
              borderRadius="8px"
              backgroundColor="#FFFFFF"
              boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
            >
              {showSearch && (
                <Flex mb="5px">
                  <IconButton
                    borderRadius="8px"
                    backgroundColor="#FFFFFF"
                    border="none"
                    p="0px"
                    aria-label="Search"
                    _hover={{ bgColor: '#FFFFFF', border: 'none' }}
                    icon={<SearchIcon color="#212224" />}
                    size="sm"
                  />
                  <Input
                    maxW={'180px'}
                    height="30px"
                    type="search"
                    placeholder="Search items"
                    value={searchTerm}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSearchTerm(e.target.value);
                    }}
                  />
                </Flex>
              )}

              {filteredItems?.map((item) => (
                <MenuItem
                  closeOnSelect={false}
                  color="#212224"
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    !multi && handleCheckboxChange(item.id);
                  }}
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  {multi && (
                    <Checkbox
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(item.id);
                      }}
                      isChecked={selectedItemIds.includes(item.id)}
                      isDisabled={
                        !multi &&
                        selectedItemIds.length > 0 &&
                        !selectedItemIds.includes(item.id)
                      }
                    />
                  )}
                  <Text ml={2}>{item.value}</Text>
                </MenuItem>
              ))}
              <Button
                w="full"
                mt="10px"
                colorScheme="red"
                size="sm"
                onClick={clearAllSelections}
              >
                Clear All
              </Button>
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
};

export default DropdownFilter;
