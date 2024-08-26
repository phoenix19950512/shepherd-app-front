import CalendarDateInput from '../../../components/CalendarDateInput';
import CustomButton2 from '../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import ApiService from '../../../services/ApiService';
import resourceStore from '../../../state/resourceStore';
import offerStore from '../../../state/offerStore';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Textarea,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  useToast,
  HStack
} from '@chakra-ui/react';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function BountyOfferModal(props) {
  const {
    isBountyModalOpen,
    closeBountyModal,
    subject,
    topic,
    level,
    description
  } = props;

  const { courses: courseList, levels: levelOptions } = resourceStore();
  const { createBounty } = offerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [bountyOffer, setBountyOffer] = useState({
    subject: subject || '',
    topic: topic || '',
    description: '',
    level: level || '',
    price: '',
    rating: 0,
    instructionMode: '',
    time: '',
    expirationDate: new Date()
  });

  const [searchValue, setSearchValue] = useState('');
  const priceOptions = [
    { value: '10-12', label: '$10.00 - $12.00', id: 1 },
    { value: '12-15', label: '$12.00 - $15.00', id: 2 },
    { value: '15-20', label: '$15.00 - $20.00', id: 3 },
    { value: '20-25', label: '$20.00 - $25.00', id: 4 }
  ];
  const toast = useToast();
  const searchQuery = useCallback((searchValue: string, courseList: any[]) => {
    return courseList.filter((course) =>
      course.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, []);

  const filteredOptions = searchQuery(searchValue, courseList);

  const isDisabledBtn = useMemo(() => {
    return !Object.values(bountyOffer).some((value) => value === '');
  }, [bountyOffer]);

  const handleSubmitBounty = async () => {
    const newObject = {
      topic: bountyOffer.topic,
      description: bountyOffer.description,
      subject: '',
      reward: parseInt(bountyOffer.price, 10) || 0,
      type: bountyOffer.instructionMode,
      courseId: bountyOffer.subject,
      levelId: bountyOffer.level,
      expiryDate: bountyOffer.expirationDate.toDateString()
    };
    setIsLoading(true);
    const response = await createBounty(newObject);
    setIsLoading(false);
    if (response) {
      closeBountyModal();
      toast({
        render: () => (
          <CustomToast
            title="Bounty Offer Placed Successfully"
            status="success"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        render: () => (
          <CustomToast title="Something went wrong.." status="error" />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
  };

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const levelId =
      (levelOptions.find((option) => option.label === level) || {})._id || '';
    const subjectId =
      (courseList.find((option) => option.label === subject) || {})._id || '';

    setBountyOffer((prevState) => ({
      ...prevState,
      subject: subjectId,
      topic: topic || '',
      level: levelId,
      description: description
    }));
  }, [subject, description, topic, level, levelOptions, courseList]);

  return (
    <>
      <CustomModal
        isOpen={isBountyModalOpen}
        modalTitle="Place Bounty"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'auto'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <CustomButton2
              type="button"
              isCancel
              onClick={closeBountyModal}
              title="Cancel"
            />
            <CustomButton2
              type="button"
              onClick={handleSubmitBounty}
              active={isDisabledBtn}
              title={isLoading ? 'Submitting...' : 'Confirm'}
              disabled={!isDisabledBtn || isLoading}
            />
          </div>
        }
        onClose={closeBountyModal}
      >
        <Box bg="white" width="100%" mt="30px" padding="0 28px">
          <FormControl mb={4}>
            <FormLabel
              fontSize="0.75rem"
              lineHeight="17px"
              color="#5C5F64"
              mb={3}
            >
              Subject
            </FormLabel>

            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<FiChevronDown />}
                borderRadius="8px"
                width="100%"
                height="42px"
                fontSize="0.875rem"
                fontFamily="Inter"
                color=" #212224"
                fontWeight="400"
                textAlign="left"
              >
                {bountyOffer.subject !== 'Subject'
                  ? courseList.map((course) => {
                      if (course._id === bountyOffer.subject) {
                        return course.label;
                      }
                      return null;
                    })
                  : bountyOffer.subject}
              </MenuButton>
              <MenuList zIndex={3} width="24em">
                <Input
                  size="sm"
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search Subject"
                  value={searchValue}
                />
                <div
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {filteredOptions.map((course) => (
                    <MenuItem
                      fontSize="0.875rem"
                      key={course._id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => {
                        setBountyOffer((prevState) => ({
                          ...prevState,
                          subject: course._id
                        }));
                      }}
                    >
                      {course.label}
                    </MenuItem>
                  ))}
                </div>
              </MenuList>
            </Menu>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel
              fontSize="0.75rem"
              lineHeight="17px"
              color="#5C5F64"
              mb={3}
            >
              Topic
            </FormLabel>
            <Input
              fontSize="0.875rem"
              fontFamily="Inter"
              fontWeight="400"
              type="text"
              name="topic"
              color=" #212224"
              placeholder="e.g genetics"
              value={bountyOffer.topic}
              onChange={(e) =>
                setBountyOffer((prevState) => ({
                  ...prevState,
                  topic: e.target.value
                }))
              }
              _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel
              fontSize="0.75rem"
              lineHeight="17px"
              color="#5C5F64"
              mb={3}
            >
              Description
            </FormLabel>
            <Textarea
              fontSize="0.875rem"
              fontFamily="Inter"
              fontWeight="400"
              color="#212224"
              name="description"
              placeholder="e.g epigenetics"
              value={bountyOffer.description}
              onChange={(e) =>
                setBountyOffer((prevState) => ({
                  ...prevState,
                  description: e.target.value
                }))
              }
              // _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Level
            </FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<FiChevronDown />}
                borderRadius="8px"
                fontSize="0.875rem"
                fontFamily="Inter"
                color="#212224"
                fontWeight="400"
                width="100%"
                height="42px"
                textAlign="left"
              >
                {bountyOffer.level !== 'Level'
                  ? levelOptions.map((level) => {
                      if (level._id === bountyOffer.level) {
                        return level.label;
                      }
                      return null;
                    })
                  : bountyOffer.level}
              </MenuButton>
              <MenuList minWidth={'auto'}>
                {levelOptions.map((level) => (
                  <MenuItem
                    fontSize="0.875rem"
                    key={level._id}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setBountyOffer((prevState) => ({
                        ...prevState,
                        level: level._id
                      }));
                    }}
                  >
                    {level.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </FormControl>

          <Flex gap={2} mb={4} alignItems="center">
            <FormControl>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Price ($)
              </FormLabel>

              <Input
                fontSize="0.875rem"
                fontFamily="Inter"
                color="#212224"
                fontWeight="400"
                type="text"
                inputMode="numeric"
                borderRadius="8px"
                width="100%"
                height="42px"
                textAlign="left"
                value={bountyOffer.price}
                onChange={(e) => {
                  setBountyOffer((prevState) => ({
                    ...prevState,
                    price: e.target.value.replace(/\D/g, '')
                  }));
                }}
                placeholder="Enter Price"
                _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
              />
            </FormControl>

            <FormControl>
              {/* <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Select Time
              </FormLabel> */}
              <RadioGroup
                name="time"
                value={bountyOffer.time}
                onChange={(value) => {
                  setBountyOffer((prevState) => ({
                    ...prevState,
                    time: value
                  }));
                }}
                mt={5}
              >
                <Radio value="30min">
                  <Text fontSize="14px">30 mins</Text>
                </Radio>
                <Radio ml={'10px'} value="60min">
                  <Text fontSize="14px"> 1 hour</Text>
                </Radio>
              </RadioGroup>
            </FormControl>
          </Flex>

          <FormControl mb={4}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Select mode of instruction
            </FormLabel>
            <RadioGroup
              name="instructionMode"
              value={bountyOffer.instructionMode}
              onChange={(value) => {
                setBountyOffer((prevState) => ({
                  ...prevState,
                  instructionMode: value
                }));
              }}
            >
              <Radio value="chat">
                <Text fontSize="14px">Chat</Text>
              </Radio>
              <Radio ml={'10px'} value="video">
                <Text fontSize="14px"> Video</Text>
              </Radio>
            </RadioGroup>
          </FormControl>
          <FormControl id="day" marginBottom="20px">
            <FormLabel>Expiration Date</FormLabel>
            <CalendarDateInput
              disabledDate={{ before: today }}
              inputProps={{
                placeholder: 'Select Expiration Date'
              }}
              value={bountyOffer.expirationDate as Date}
              onChange={(value) => {
                setBountyOffer((prevState) => ({
                  ...prevState,
                  expirationDate: value
                }));
              }}
            />
          </FormControl>
        </Box>
      </CustomModal>
    </>
  );
}

// export default BountyOfferModal;
