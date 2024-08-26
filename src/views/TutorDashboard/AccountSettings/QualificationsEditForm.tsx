import DatePicker from '../../../components/DatePicker';
import DragAndDrop from '../../../components/DragandDrop';
import { storage } from '../../../firebase';
import onboardTutorStore from '../../../state/onboardTutorStore';
import userStore from '../../../state/userStore';
import { TutorQualification } from '../../../types';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  useToast,
  Text
} from '@chakra-ui/react';
import { ref } from '@firebase/storage';
import { format, isBefore } from 'date-fns';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { RiPencilLine } from 'react-icons/ri';
import { RiCloseCircleLine } from 'react-icons/ri';

const QualificationsForm = (props) => {
  const { updateQualifications } = props;
  const toast = useToast();
  const { user } = userStore();
  const [qualificationsData, setQualificationsData] = useState<any>(
    user?.tutor?.qualifications
  );
  const [formData, setFormData] = useState<TutorQualification>({
    institution: '',
    degree: '',
    startDate: null as unknown as Date,
    endDate: null as unknown as Date,
    transcript: ''
  });
  const [dateError, setDateError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  // const [addQualificationClicked, setAddQualificationClicked] = useState(false);

  // useEffect(() => {
  //   if (qualificationsData.length === 1 && !addQualificationClicked) {
  //     setFormData(qualificationsData[0]);
  //   }
  // }, [qualificationsData, addQualificationClicked]);

  const handleUploadInput = (file: File | null, name: string) => {
    if (!file) return;
    if (file?.size > 10000000) {
      setIsLoading(true);
      toast({
        title: 'Please upload a file under 10MB',
        status: 'error',
        position: 'top',
        isClosable: true
      });
      return;
    } else {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setIsLoading(true);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // setCvUploadPercent(progress);
        },
        (error) => {
          setIsLoading(false);
          // setCvUploadPercent(0);
          toast({ title: error.message + error.cause, status: 'error' });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsLoading(false);
            handleInputChange({
              target: { name, value: downloadURL }
            } as React.ChangeEvent<HTMLInputElement>);
            // onboardTutorStore.set?.transcript?.(downloadURL);
          });
        }
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(updatedFormData);
    updateQualifications([...qualificationsData, updatedFormData]);

    // if (!addQualificationClicked) {
    //   setQualificationsData([updatedFormData]);
    // }
  };

  const handleDateChange = (date: Date | null, name: string) => {
    if (!date) return; // or handle `null` value if necessary

    if (
      name === 'endDate' &&
      formData.startDate &&
      isBefore(date, formData.startDate)
    ) {
      setDateError('End date must be after start date');
      return;
    } else {
      setDateError('');
    }

    const updatedFormData = {
      ...formData,
      [name]: date
    };
    setFormData(updatedFormData);
    updateQualifications([...qualificationsData, updatedFormData]);
  };
  // const isFormValid = useMemo(() => {
  //   return Object.values(formData).every(Boolean);
  // }, [formData]);

  //   const handleAddQualification = () => {
  //     const isFormValid = Object.values(formData).every(Boolean);
  //     if (!isFormValid) return;
  //     setQualificationsData([...qualificationsData, formData]);
  //     updateQualification([...qualificationsData, formData]);
  //     setFormData({
  //       institution: '',
  //       degree: '',
  //       startDate: null as unknown as Date,
  //       endDate: null as unknown as Date,
  //       transcript: ''
  //     });
  //     setAddQualificationClicked(true);
  //   };
  //   const handleEditQualification = (id: string) => {
  //     if (!qualificationsData) return;
  //     const selectedQualificationIndex = qualificationsData.findIndex(
  //       (qual) =>
  //         `${qual.institution}${
  //           qual.degree
  //         }${qual.startDate?.getTime()}${qual.endDate?.getTime()}` === id
  //     );
  //     if (selectedQualificationIndex === -1) return;
  //     const selectedQualification =
  //       qualificationsData[selectedQualificationIndex];
  //     setFormData(selectedQualification);
  //     const updatedQualifications = qualificationsData.filter(
  //       (qual) =>
  //         `${qual.institution}${
  //           qual.degree
  //         }${qual.startDate?.getTime()}${qual.endDate?.getTime()}` !== id
  //     );
  //     updateQualification(selectedQualification);
  //     console.log(selectedQualification, 'derg');
  //   };

  //   const renderQualifications = () => {
  //     if (!addQualificationClicked || qualificationsData.length === 0)
  //       return null;

  //     const uniqueQualifications = qualificationsData.filter(
  //       (qualification, index, self) =>
  //         index ===
  //         self.findIndex(
  //           (qual) =>
  //             `${qual.institution}${
  //               qual.degree
  //             }${qual.startDate?.getTime()}${qual.endDate?.getTime()}` ===
  //             `${qualification.institution}${
  //               qualification.degree
  //             }${qualification.startDate?.getTime()}${qualification.endDate?.getTime()}`
  //         )
  //     );

  //     return uniqueQualifications.map((qualification) => {
  //       const startDate = new Date(qualification.startDate as Date);
  //       const endDate = new Date(qualification.endDate as Date);
  //       const formattedStartDate = startDate.getFullYear();
  //       const formattedEndDate = endDate.getFullYear();
  //       const id = `${qualification.institution}${
  //         qualification.degree
  //       }${startDate.getTime()}${endDate.getTime()}`;

  //       return (
  //         <Box
  //           key={id}
  //           background="#FFFFFF"
  //           border="1px solid #EFEFF1"
  //           boxShadow="0px 3px 10px rgba(136, 139, 143, 0.09)"
  //           borderRadius="6px"
  //           padding="5px 15px"
  //           marginBottom="20px"
  //           position="relative"
  //         >
  //           <HStack justifyContent="space-between">
  //             <HStack>
  //               <Box fontWeight="bold">
  //                 {qualification.institution},{' '}
  //                 {`${formattedStartDate}-${formattedEndDate}`}
  //               </Box>
  //             </HStack>

  //             <Button
  //               border="1px solid #ECEDEE"
  //               color="#212224"
  //               onClick={() => handleEditQualification(id)}
  //               borderRadius="50%"
  //               p="5px"
  //               backgroundColor="transparent"
  //             >
  //               <RiPencilLine size={14} />
  //             </Button>
  //           </HStack>
  //         </Box>
  //       );
  //     });
  //   };

  const QualificationsList = ({ qualifications, onRemove }) => {
    return (
      <Box width="full">
        {qualifications.map((qualification, index) => {
          const startDate = new Date(qualification.startDate).getFullYear();
          const endDate = new Date(qualification.endDate).getFullYear();

          return (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              mb={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="full"
            >
              <Text
                flex="2"
                fontWeight="bold"
                isTruncated
                overflow="hidden"
                textOverflow="ellipsis"
                paddingRight={5}
              >
                {qualification.institution}
              </Text>
              <Text
                flex="2"
                isTruncated
                overflow="hidden"
                textOverflow="ellipsis"
                paddingRight={5}
              >
                {qualification.degree}
              </Text>
              <Text flex="1" isTruncated>
                {startDate}
              </Text>
              <Text flex="1" isTruncated>
                {endDate}
              </Text>
              <Button size="sm" onClick={() => onRemove(index)}>
                <RiCloseCircleLine size="16px" />
              </Button>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box>
      {/* <AnimatePresence>
        {qualificationsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderQualifications()}
          </motion.div>
        )}
      </AnimatePresence> */}
      <QualificationsList
        qualifications={qualificationsData}
        onRemove={(index) => {
          const updatedQualifications = qualificationsData.filter(
            (_, i) => i !== index
          );
          setQualificationsData(updatedQualifications);
          updateQualifications(updatedQualifications);
        }}
      />
      <Text fontSize="xl" fontWeight="bold" pt={6} pb={4}>
        Add New Qualification
      </Text>
      <FormControl id="institution" marginBottom="20px">
        <FormLabel>Institution</FormLabel>
        <Input
          placeholder="e.g Harvard University"
          name="institution"
          value={formData.institution}
          onChange={handleInputChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        />
      </FormControl>

      <FormControl id="degree" marginBottom="20px">
        <FormLabel>Degree</FormLabel>
        <Input
          placeholder="e.g Mathematics"
          name="degree"
          value={formData.degree}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
          onChange={handleInputChange}
        />
      </FormControl>

      <HStack spacing={5} marginBottom="20px">
        <FormControl id="startDate">
          <FormLabel>Start date</FormLabel>
          <DatePicker
            name="startDate"
            placeholder="Select Start Date"
            value={
              formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : ''
            }
            onChange={(date) => handleDateChange(date, 'startDate')}
          />
        </FormControl>

        <FormControl isInvalid={Boolean(dateError)} id="endDate">
          <FormLabel>End date</FormLabel>
          <DatePicker
            name="endDate"
            placeholder="Select End Date"
            value={
              formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : ''
            }
            onChange={(date) => handleDateChange(date, 'endDate')}
          />
          <FormErrorMessage>
            {'End Date Must Be before The Start Date'}
          </FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl id="degree" marginBottom="20px">
        <FormLabel>Transcript/Certificate</FormLabel>
        <DragAndDrop
          isLoading={isLoading}
          file={formData.transcript}
          supportingText="Click to upload your transcript"
          accept="image/*, application/pdf"
          onFileUpload={(file) => handleUploadInput(file, 'transcript')}
          boxStyles={{ minWidth: '250px', marginTop: '10px', height: '50px' }}
        />
      </FormControl>

      {/* <Button
        margin={0}
        padding={0}
        color={'#207DF7'}
        fontSize={'sm'}
        marginTop="-20px"
        background={'transparent'}
        variant="ghost"
        colorScheme="white"
        isDisabled={!isFormValid}
        onClick={handleAddQualification}
      >
        + Add to qualifications
      </Button> */}
    </Box>
  );
};

export default QualificationsForm;
