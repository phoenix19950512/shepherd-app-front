import React, { useState, useEffect } from 'react';
import flashcardStore from '../../../../state/flashcardStore';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import SelectComponent from '../../../../components/Select';

const studyTypeOptions = [
  { value: 'longTermRetention', label: 'Long Term Retention' },
  { value: 'quickPractice', label: 'Quick Practice' }
];

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const studyPeriodOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Once a week' },
  { value: 'biweekly', label: 'Twice a week' },
  { value: 'spacedRepetition', label: 'Spaced repetition' }
];

const AddToDeckModal = ({ isOpen, onClose, onSubmit }) => {
  const { createFlashCard, fetchFlashcards, flashcards } = flashcardStore();
  const [formData, setFormData] = useState({
    deckname: '',
    studyType: '',
    level: '',
    selectedDeckId: '',
    studyPeriod: ''
  });
  const [flashcardOptions, setFlashcardOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchFlashcards();
    };
    fetchData();
  }, [fetchFlashcards]);

  useEffect(() => {
    if (flashcards) {
      setFlashcardOptions(
        flashcards.map((flashcard) => ({
          value: flashcard._id,
          label: flashcard.deckname
        }))
      );
    }
  }, [flashcards]);

  const handleSelectChange = (name, option) => {
    if (name === 'selectedDeckId') {
      const selectedDeck = flashcards.find(
        (flashcard) => flashcard._id === option.value
      );
      setFormData((prev) => ({
        ...prev,
        selectedDeckId: option ? option.value : '',
        deckname: selectedDeck ? selectedDeck.deckname : ''
      }));
    } else if (name === 'studyType') {
      const studyPeriod = option.value === 'quickPractice' ? 'noRepeat' : '';
      setFormData((prev) => ({
        ...prev,
        [name]: option ? option.value : '',
        studyPeriod: studyPeriod
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: option ? option.value : ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (isNewDeck) => {
    onSubmit(formData, isNewDeck);
    onClose();
  };

  const StudyFooter = ({ onClose }) => {
    return (
      <Box display="flex" justifyContent="flex-end" p={4}>
        <Button
          variant="ghost"
          rounded="100%"
          padding="10px"
          bg="#FEECEC"
          onClick={onClose}
          _hover={{ bg: '#FEECEC', transform: 'scale(1.05)' }}
          color="black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width={'15px'}
            height={'15px'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </Box>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent
          borderRadius="12px"
          w="full"
          maxW={{ base: '95%', sm: '80%', md: '700px' }}
          mx="auto"
          position="relative"
        >
          <ModalHeader>
            {formData.selectedDeckId ? 'Update Deck' : 'Create New Deck'}
          </ModalHeader>
          <ModalBody>
            <Tabs variant="enclosed" width={'full'}>
              <TabList>
                <Tab>Create New</Tab>
                <Tab>Update Existing</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Flex direction="column" width={'full'}>
                    <FormControl mb={4}>
                      <FormLabel>Deck Name</FormLabel>
                      <Input
                        name="deckname"
                        value={formData.deckname}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormLabel>Study Type</FormLabel>
                      <SelectComponent
                        name="studyType"
                        options={studyTypeOptions}
                        onChange={(option) =>
                          handleSelectChange('studyType', option)
                        }
                        defaultValue={studyTypeOptions.find(
                          (option) => option.value === formData.studyType
                        )}
                      />
                    </FormControl>
                    {formData.studyType === 'longTermRetention' && (
                      <FormControl mb={4}>
                        <FormLabel>Study Period</FormLabel>
                        <SelectComponent
                          name="studyPeriod"
                          options={studyPeriodOptions}
                          onChange={(option) =>
                            handleSelectChange('studyPeriod', option)
                          }
                          defaultValue={studyPeriodOptions.find(
                            (option) => option.value === formData.studyPeriod
                          )}
                        />
                      </FormControl>
                    )}
                    <FormControl mb={4}>
                      <FormLabel>Level</FormLabel>
                      <SelectComponent
                        name="level"
                        options={levelOptions}
                        onChange={(option) =>
                          handleSelectChange('level', option)
                        }
                        defaultValue={levelOptions.find(
                          (option) => option.value === formData.level
                        )}
                      />
                    </FormControl>
                    <Button onClick={() => handleSubmit(true)}>
                      Create Deck
                    </Button>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction="column" width={'full'}>
                    <FormControl mb={4}>
                      <FormLabel>Deck Name</FormLabel>
                      <SelectComponent
                        name="selectedDeckId"
                        options={flashcardOptions}
                        onChange={(option) =>
                          handleSelectChange('selectedDeckId', option)
                        }
                        defaultValue={flashcardOptions.find(
                          (option) => option.value === formData.selectedDeckId
                        )}
                      />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormLabel>Study Type</FormLabel>
                      <SelectComponent
                        name="studyType"
                        options={studyTypeOptions}
                        onChange={(option) =>
                          handleSelectChange('studyType', option)
                        }
                        defaultValue={studyTypeOptions.find(
                          (option) => option.value === formData.studyType
                        )}
                      />
                    </FormControl>
                    {formData.studyType === 'longTermRetention' && (
                      <FormControl mb={4}>
                        <FormLabel>Study Period</FormLabel>
                        <SelectComponent
                          name="studyPeriod"
                          options={studyPeriodOptions}
                          onChange={(option) =>
                            handleSelectChange('studyPeriod', option)
                          }
                          defaultValue={studyPeriodOptions.find(
                            (option) => option.value === formData.studyPeriod
                          )}
                        />
                      </FormControl>
                    )}
                    <FormControl mb={4}>
                      <FormLabel>Level</FormLabel>
                      <SelectComponent
                        name="level"
                        options={levelOptions}
                        onChange={(option) =>
                          handleSelectChange('level', option)
                        }
                        defaultValue={levelOptions.find(
                          (option) => option.value === formData.level
                        )}
                      />
                    </FormControl>
                    <Button onClick={() => handleSubmit(false)}>
                      Update Deck
                    </Button>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Flex justify={'right'} width={'full'}>
              <StudyFooter onClose={onClose} />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default AddToDeckModal;
