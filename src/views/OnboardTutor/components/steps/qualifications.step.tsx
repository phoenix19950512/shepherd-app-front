import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import DatePicker from '../../../../components/DatePicker';
import DragAndDrop from '../../../../components/DragandDrop';
import { storage } from '../../../../firebase';
import onboardTutorStore from '../../../../state/onboardTutorStore';
import { TutorQualification } from '../../../../types';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Progress,
  Text,
  useToast
} from '@chakra-ui/react';
import { ref } from '@firebase/storage';
import { format, isBefore } from 'date-fns';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { RiPencilLine } from 'react-icons/ri';
import uploadFile from '../../../../helpers/file.helpers';
import {
  MAX_FILE_NAME_LENGTH,
  MAX_FILE_UPLOAD_LIMIT
} from '../../../../helpers/constants';
import userStore from '../../../../state/userStore';
import { processDocument } from '../../../../services/AI';
import ApiService from '../../../../services/ApiService';

const QualificationsForm: React.FC = () => {
  const toast = useCustomToast();
  const { qualifications: storeQualifications } = onboardTutorStore.useStore();
  const [formData, setFormData] = useState<TutorQualification>({
    institution: '',
    degree: '',
    startDate: null as unknown as Date,
    endDate: null as unknown as Date,
    transcript: ''
  });
  const [dateError, setDateError] = useState('');
  const [confirmReady, setConfirmReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addQualificationClicked, setAddQualificationClicked] = useState(false);
  const [countdown, setCountdown] = useState({
    active: false,
    message: ''
  });
  const [progress, setProgress] = useState(0);
  const { user } = userStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (
      storeQualifications &&
      storeQualifications.length === 1 &&
      !addQualificationClicked
    ) {
      setFormData(storeQualifications[0]);
    }
  }, [storeQualifications, addQualificationClicked]);

  const handleUploadInput = (file: File | null, name: string) => {
    if (!file) return;

    let readableFileName = file?.name
      .toLowerCase()
      .replace(/\.pdf$/, '')

      .replace(/_/g, ' ');
    if (readableFileName.length > MAX_FILE_NAME_LENGTH) {
      readableFileName = readableFileName.substring(0, MAX_FILE_NAME_LENGTH);
      setCountdown((prev) => ({
        active: true,
        message: `The file name has been truncated to ${MAX_FILE_NAME_LENGTH} characters`
      }));
      setProgress(5);
    }

    setIsLoading(true);

    const SIZE_IN_MB = parseInt((file?.size / 1_000_000).toFixed(2), 10);

    if (SIZE_IN_MB > MAX_FILE_UPLOAD_LIMIT) {
      toast({
        title: 'Your file is too large',
        status: 'error',
        position: 'top',
        isClosable: true,
        description: `Your file is ${SIZE_IN_MB}MB, above our ${MAX_FILE_UPLOAD_LIMIT}MB limit. Please upload a smaller document.`
      });
      return;
    }

    const uploadEmitter = uploadFile(file, {
      studentID: user._id, // Assuming user._id is always defined
      documentID: readableFileName // Assuming readableFileName is the file's name
    });

    // const storageRef = ref(storage, `files/${file.name}`);
    // const uploadTask = uploadBytesResumable(storageRef, file);

    // uploadTask.on(
    //   'state_changed',
    //   (snapshot) => {
    //     const progress = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );
    //     // setCvUploadPercent(progress);
    //   },
    //   (error) => {
    //     setIsLoading(false);
    //     // setCvUploadPercent(0);
    //     toast({ title: error.message + error.cause, status: 'error' });
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       setIsLoading(false);
    //       handleInputChange({
    //         target: { name, value: downloadURL }
    //       } as React.ChangeEvent<HTMLInputElement>);
    //       // onboardTutorStore.set?.transcript?.(downloadURL);
    //     });
    //   }
    // );
    uploadEmitter.on('complete', async (uploadFile) => {
      // Assuming uploadFile contains the fileUrl and other necessary details.
      const updatedFormData = {
        ...formData,
        [name]: uploadFile.fileUrl
      };
      setFormData(updatedFormData);

      if (!addQualificationClicked) {
        onboardTutorStore.set.qualifications?.([updatedFormData]);
      }
      setIsLoading(false);
    });

    uploadEmitter.on('error', (error) => {
      setIsLoading(false);
      setCountdown((prev) => ({
        ...prev,
        active: false,
        message: 'Something went wrong. Please attempt the upload again.'
      }));
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(updatedFormData);

    if (!addQualificationClicked) {
      onboardTutorStore.set.qualifications?.([updatedFormData]);
    }
  };

  // const handleDateChange = (date: Date | null, name: string) => {
  //   if (!date) return; // or handle `null` value if necessary

  //   if (
  //     name === 'endDate' &&
  //     formData.startDate &&
  //     isBefore(date, formData.startDate)
  //   ) {
  //     setDateError('End date must be after start date');
  //     return;
  //   } else {
  //     setDateError('');
  //   }

  //   const updatedFormData = {
  //     ...formData,
  //     [name]: date
  //   };
  //   setFormData(updatedFormData);
  //   if (!addQualificationClicked) {
  //     onboardTutorStore.set.qualifications?.([updatedFormData]);
  //   }
  // };

  const handleDateChange = (selectedDate: Date | null, fieldName: string) => {
    if (!selectedDate) return;

    const updatedFormData = { ...formData, [fieldName]: selectedDate };

    if (fieldName === 'endDate') {
      if (formData.startDate && isBefore(selectedDate, formData.startDate)) {
        setDateError('End date must be after start date');
        return;
      } else {
        setDateError('');
      }
    }

    setFormData(updatedFormData);

    if (!addQualificationClicked) {
      onboardTutorStore.set.qualifications?.([updatedFormData]);
    }
  };

  const isFormValid = useMemo(() => {
    return Object.values(formData).every(Boolean);
  }, [formData]);

  const handleAddQualification = () => {
    const isFormValid = Object.values(formData).every(Boolean);
    if (!isFormValid) return;
    onboardTutorStore.set.qualifications?.([
      ...(storeQualifications || []),
      formData
    ]);
    setFormData({
      institution: '',
      degree: '',
      startDate: null as unknown as Date,
      endDate: null as unknown as Date,
      transcript: ''
    });
    setAddQualificationClicked(true);
  };

  const handleEditQualification = (id: string) => {
    if (!storeQualifications) return;
    const selectedQualificationIndex = storeQualifications.findIndex(
      (qual) =>
        `${qual.institution}${
          qual.degree
        }${qual.startDate?.getTime()}${qual.endDate?.getTime()}` === id
    );
    if (selectedQualificationIndex === -1) return;
    const selectedQualification =
      storeQualifications[selectedQualificationIndex];
    setFormData(selectedQualification);
    const updatedQualifications = storeQualifications.filter(
      (qual) =>
        `${qual.institution}${
          qual.degree
        }${qual.startDate?.getTime()}${qual.endDate?.getTime()}` !== id
    );
    onboardTutorStore.set.qualifications?.(updatedQualifications);
  };

  const renderQualifications = () => {
    if (!addQualificationClicked || !storeQualifications) return null;

    const uniqueQualifications = storeQualifications.filter(
      (qualification, index, self) =>
        index ===
        self.findIndex(
          (qual) =>
            `${qual.institution}${
              qual.degree
            }${qual.startDate?.getTime()}${qual.endDate?.getTime()}` ===
            `${qualification.institution}${
              qualification.degree
            }${qualification.startDate?.getTime()}${qualification.endDate?.getTime()}`
        )
    );

    return uniqueQualifications.map((qualification) => {
      const startDate = new Date(qualification.startDate as Date);
      const endDate = new Date(qualification.endDate as Date);
      const formattedStartDate = startDate.getFullYear();
      const formattedEndDate = endDate.getFullYear();
      const id = `${qualification.institution}${
        qualification.degree
      }${startDate.getTime()}${endDate.getTime()}`;

      return (
        <Box
          key={id}
          background="#FFFFFF"
          border="1px solid #EFEFF1"
          boxShadow="0px 3px 10px rgba(136, 139, 143, 0.09)"
          borderRadius="6px"
          padding="5px 15px"
          marginBottom="20px"
          position="relative"
        >
          <HStack justifyContent="space-between">
            <HStack>
              <Box fontWeight="bold">
                {qualification.institution},{' '}
                {`${formattedStartDate}-${formattedEndDate}`}
              </Box>
            </HStack>

            <Button
              border="1px solid #ECEDEE"
              color="#212224"
              onClick={() => handleEditQualification(id)}
              borderRadius="50%"
              p="5px"
              backgroundColor="transparent"
            >
              <RiPencilLine size={14} />
            </Button>
          </HStack>
        </Box>
      );
    });
  };

  const CountdownProgressBar = ({
    confirmReady,
    countdown
  }: {
    confirmReady: boolean;
    countdown: { active: boolean; message: string };
  }) => {
    // const [progress, setProgress] = useState(0);

    const randomSeed = (min = 1, max = 10) =>
      Math.floor(Math.random() * (max - min + 5) + min);

    useEffect(() => {
      if (confirmReady) {
        setProgress(() => 500);
      } else {
        const interval = setInterval(() => {
          setProgress((prevProgress) => prevProgress + randomSeed());
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [confirmReady]);

    return (
      <div>
        <Progress
          size="lg"
          hasStripe
          value={progress}
          max={500}
          colorScheme="green"
        />
        <Text>{countdown.message}</Text>
      </div>
    );
  };

  return (
    <Box>
      <AnimatePresence>
        {storeQualifications && storeQualifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderQualifications()}
          </motion.div>
        )}
      </AnimatePresence>
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
            selected={formData.startDate}
            name="startDate"
            placeholderText="YYYY-MM-DD"
            onChange={(date) => handleDateChange(date, 'startDate')}
            dateFormat="yyyy-MM-dd"
          />
        </FormControl>

        <FormControl isInvalid={Boolean(dateError)} id="endDate">
          <FormLabel>End date</FormLabel>
          <DatePicker
            selected={formData.endDate}
            name="endDate"
            placeholderText="YYYY-MM-DD"
            onChange={(date) => handleDateChange(date, 'endDate')}
            dateFormat="yyyy-MM-dd"
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

      <Button
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
      </Button>
    </Box>
  );
};

export default QualificationsForm;
