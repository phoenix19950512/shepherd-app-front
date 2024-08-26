import { useCustomToast } from '../../components/CustomComponents/CustomToast/useCustomToast';
import CustomSelect from '../../components/CustomSelect';
import { FORMAT } from '../../components/DateInput';
import DragAndDrop from '../../components/DragandDrop';
import OnboardStep from '../../components/OnboardStep';
import OnboardSubmitStep from '../../components/OnboardSubmitStep';
// import SelectComponent from '../../components/Select';
import StepIndicator from '../../components/StepIndicator';
import { createUserWithEmailAndPassword, firebaseAuth } from '../../firebase';
import { storage } from '../../firebase';
import { useTitle } from '../../hooks';
import lottieSuccessAnimationData from '../../lottie/73392-success.json';
import ApiService from '../../services/ApiService';
import onboardTutorStore from '../../state/onboardTutorStore';
import resourceStore from '../../state/resourceStore';
import { Select } from '@chakra-ui/react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { ref } from '@firebase/storage';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { capitalize } from 'lodash';
import Lottie from 'lottie-react';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { FiBookOpen, FiCalendar, FiUser } from 'react-icons/fi';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import StepWizard, { StepWizardProps } from 'react-step-wizard';

const stepIndicatorSteps = [
  {
    title: 'About you',
    icon: <FiUser />,
    id: 'about-you'
  },
  {
    title: 'Id Verification',
    icon: <FiBookOpen />,
    id: 'id_verification'
  },
  {
    title: 'Security',
    icon: <FiCalendar />,
    id: 'security'
  }
];

const OnboardTutor = () => {
  const toast = useCustomToast();
  const { countries } = resourceStore();
  const [confirmDocument, setConfirmDocument] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [userFields, setUserFields] = useState({
    name: { first: '', last: '' },
    email: '',
    dob: ''
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editModalStep, setEditModalStep] = useState<string | null>(null);
  const {
    isOpen: editModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose
  } = useDisclosure();

  const data = onboardTutorStore.useStore();
  const { country, identityDocument, tz } = data;
  const { name, email, dob } = userFields;

  const age = useMemo(() => moment().diff(moment(dob, FORMAT), 'years'), [dob]);
  const [isUploadLoading, setUploadLoading] = useState(false);

  const validateNameStep = !!userFields.name.first && !!userFields.name.last;

  const validateCredentialsStep = [
    country,
    identityDocument,
    confirmDocument
  ].every(Boolean);

  const [cvUploadPercent, setCvUploadPercent] = useState(0);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedIdDoc, setSelectedIdDoc] = useState<File | null>(null);

  useEffect(() => {
    onboardTutorStore.set.cv('');

    if (!selectedCV) return;

    const storageRef = ref(storage, `files/${selectedCV.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedCV);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setCvUploadPercent(progress);
      },
      (error) => {
        setCvUploadPercent(0);
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onboardTutorStore.set.cv(downloadURL);
        });
      }
    );
    /* eslint-disable */
  }, [selectedCV]);

  useEffect(() => {
    onboardTutorStore.set.identityDocument?.('');

    if (!selectedIdDoc) return;

    const storageRef = ref(storage, `files/${selectedIdDoc.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedIdDoc);

    setUploadLoading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setAvatarUploadPercent(progress);
      },
      (error) => {
        setUploadLoading(false);
        // setAvatarUploadPercent(0);
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadLoading(false);
          onboardTutorStore.set.identityDocument?.(downloadURL);
        });
      }
    );
  }, [selectedIdDoc]);

  useEffect(() => {
    onboardTutorStore.set.avatar?.('');

    if (!selectedAvatar) return;

    if (selectedAvatar?.size > 1000000) {
      toast({
        title: 'Please upload a file under 1MB',
        status: 'error',
        position: 'top',
        isClosable: true
      });
      return;
    }

    const storageRef = ref(storage, `files/${selectedAvatar.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedAvatar);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onboardTutorStore.set.avatar?.(downloadURL);
        });
      }
    );
    /* eslint-disable */
  }, [selectedAvatar]);

  const doSubmit = async () => {
    let firebaseId: string | null = null;
    if (!firebaseId) {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        userFields.email,
        password
      )
        .then((firebaseUser) => {
          // Successfully created a new user account
          firebaseId = firebaseUser.user.uid;
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            toast({
              title: 'Email already exist',
              status: 'error',
              position: 'top-right'
            });
          }
          throw error;
        });
    }
    return ApiService.createUser({
      ...userFields,
      firebaseId: firebaseId as unknown as string,
      isTutor: true
    });
    // return ApiService.submitTutor(data);
  };

  const onStepChange: StepWizardProps['onStepChange'] = ({
    activeStep,
    ...rest
  }) => {
    setActiveStep(activeStep);
  };

  const passwordChecks = useMemo(() => {
    const isEightLetters = {
      text: '8 character minimum',
      checked: password.length >= 8
    };

    const isConfirmed = {
      text: 'Password has been confirmed',
      checked: [password, password === confirmPassword].every(Boolean)
    };

    const hasACharacter = {
      text: 'Password has at least one special character',
      checked: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    const hasANumber = {
      text: 'Password has at least one number',
      checked: /\d/.test(password)
    };

    return [isEightLetters, isConfirmed, hasACharacter, hasANumber];
  }, [password, confirmPassword]);

  const validatePasswordStep =
    passwordChecks.filter((check) => !check.checked).length === 0;
  const steps = [
    {
      id: 'name',
      stepIndicatorId: 'about-you',
      text: '',
      template: (
        <div>
          <p
            style={{
              textAlign: 'center',
              fontSize: '1.02rem',
              fontWeight: '500',
              marginTop: '25px',
              color: '#207DF7'
            }}
          >
            Step 1 of 3
          </p>
          <Box>
            <Box marginTop={30}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  fontSize={'0.875rem'}
                  value={name.first}
                  onChange={(e) =>
                    setUserFields((prev) => ({
                      ...prev,
                      name: { ...prev.name, first: e.target.value ?? '' }
                    }))
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  fontSize={'0.875rem'}
                  value={name.last}
                  onChange={(e) =>
                    setUserFields((prev) => ({
                      ...prev,
                      name: { ...prev?.name, last: e.target.value ?? '' }
                    }))
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  fontSize={'0.875rem'}
                  value={email}
                  onChange={(e) =>
                    setUserFields((prev) => ({
                      ...prev,
                      email: e.target.value
                    }))
                  }
                />
              </FormControl>
            </Box>
          </Box>
        </div>
      ),
      canSave: validateNameStep
    },
    {
      id: 'id_verification',
      text: 'Upload a proof of your identity (drivers license, passport, national ID)',
      stepIndicatorId: 'id_verification',
      template: (
        <div>
          <p
            style={{
              textAlign: 'center',
              fontSize: '1.02rem',
              fontWeight: '500',
              marginTop: '25px',
              color: '#207DF7'
            }}
          >
            Step 2 of 3
          </p>
          <Box>
            <Box marginTop={30}>
              <CustomSelect
                value={country}
                onChange={(e: any) => {
                  onboardTutorStore.set.country?.(e.target.value);
                }}
                placeholder="Select a country"
                style={{
                  fontSize: '0.875rem'
                }}
              >
                <option value="Select a country" disabled>
                  Select a country
                </option>
                {countries.map((country) => (
                  <option value={country.name}>{country.name}</option>
                ))}
              </CustomSelect>
              {/* <SelectComponent
              value={{ value: country, label: country }}
              options={countries.map((country) => ({
                label: country.name,
                value: country.name
              }))}
              onChange={(e: any) => {
                onboardTutorStore.set.country?.(e.value);
              }}
              placeholder="Select a country"
              isSearchable
              // Add any additional props you want to pass
            /> */}
              <DragAndDrop
                file={identityDocument}
                marginTop={30}
                maxSize="100mb"
                isLoading={isUploadLoading}
                onDelete={() => onboardTutorStore.set.identityDocument?.('')}
                onFileUpload={(file) => setSelectedIdDoc(file)}
              />
              <HStack marginTop={30} spacing={2}>
                <Checkbox
                  borderRadius={'4px'}
                  colorScheme={'blue'}
                  isChecked={confirmDocument}
                  onChange={(e) => setConfirmDocument(e.target.checked)}
                  size="lg"
                />
                <Text fontSize="sm">
                  I confirm that I uploaded a valid government issued photo ID.
                </Text>
              </HStack>
            </Box>
          </Box>
        </div>
      ),
      canSave: validateCredentialsStep
    },
    {
      id: 'security',
      stepIndicatorId: 'security',
      text: '',
      template: (
        <div>
          <p
            style={{
              textAlign: 'center',
              fontSize: '1.02rem',
              fontWeight: '500',
              marginTop: '25px',
              color: '#207DF7'
            }}
          >
            Step 3 of 3
          </p>

          <Box>
            <Box marginTop={30}>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    placeholder="Create password"
                    type={showPassword ? 'text' : 'password'}
                    _placeholder={{ fontSize: '14px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement>
                    {!showPassword ? (
                      <HiEye
                        cursor={'pointer'}
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    ) : (
                      <HiEyeOff
                        cursor="pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl mt={5}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    placeholder="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    _placeholder={{ fontSize: '14px' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement>
                    {!showConfirmPassword ? (
                      <HiEye
                        cursor="pointer"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    ) : (
                      <HiEyeOff
                        cursor="pointer"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
                {passwordChecks.map((passwordCheck) => (
                  <HStack marginTop={30} spacing={2}>
                    <Checkbox
                      colorScheme={passwordCheck.checked ? 'green' : 'gray'}
                      variant={'looney'}
                      isChecked={passwordCheck.checked}
                      size="lg"
                    />
                    <Text fontSize="sm">{passwordCheck.text}</Text>
                  </HStack>
                ))}
              </FormControl>
            </Box>
          </Box>
        </div>
      ),
      canSave: validatePasswordStep
    }
  ];

  const activeStepObj = useMemo(() => steps[activeStep - 1], [activeStep]);

  const stepIndicatorActiveStep = useMemo(
    () =>
      stepIndicatorSteps.find((s) => s.id === activeStepObj?.stepIndicatorId),
    [activeStepObj, stepIndicatorSteps]
  );

  useTitle(stepIndicatorActiveStep?.title || '');

  useEffect(() => {
    if (!activeStepObj) return;
  }, [activeStepObj]);

  const canSaveCurrentEditModalStep = steps.find(
    (s) => s.id === editModalStep
  )?.canSave;

  return (
    <Box>
      <Modal
        closeOnEsc={canSaveCurrentEditModalStep}
        closeOnOverlayClick={canSaveCurrentEditModalStep}
        size="xl"
        isOpen={editModalOpen}
        onClose={onEditModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <br />
          </ModalHeader>
          <ModalCloseButton isDisabled={!canSaveCurrentEditModalStep} />
          <ModalBody>
            <Box width={'100%'}>
              {steps.find((s) => s.id === editModalStep)?.template}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!canSaveCurrentEditModalStep}
              onClick={onEditModalClose}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack justifyContent={'center'} alignItems="center">
        <Text
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={600}
          fontSize={{ md: '24px', base: '1.3rem' }}
          lineHeight="34px"
          letterSpacing="-0.02em"
          color="#212224"
          flex="none"
          order={0}
          flexGrow={0}
          textAlign={{ base: 'center' }}
        >
          Create your Shepherd Tutor Account
        </Text>
        <Text
          fontStyle="normal"
          fontWeight={400}
          textAlign="center"
          width={'80%'}
          fontSize="14px"
          lineHeight="21px"
          color="#585F68"
          flex="none"
          order={1}
          flexGrow={0}
          marginBottom="16px"
        >
          {steps[activeStep - 1]?.text}
        </Text>
      </VStack>
      {/* <StepIndicator
        activeStep={stepIndicatorSteps.findIndex(
          (s) => s === stepIndicatorActiveStep
        )}
        steps={stepIndicatorSteps}
      /> */}
      <Box>
        <StepWizard
          isLazyMount
          className="flex-col-reverse"
          onStepChange={onStepChange}
        >
          {
            steps.map((s) => {
              return (
                <OnboardStep {...s} key={s.id} canGoNext={s.canSave}>
                  {s.template}
                </OnboardStep>
              );
            }) as unknown as JSX.Element
          }
          <OnboardSubmitStep submitFunction={doSubmit}>
            <Box textAlign="center">
              <CircularProgress isIndeterminate />
            </Box>
          </OnboardSubmitStep>
          <OnboardStep canGoNext={false} hideNav={true}>
            <Box paddingBottom={5}>
              <Box>
                <Lottie
                  style={{ height: 100 }}
                  animationData={lottieSuccessAnimationData}
                />
              </Box>
              <Heading as="h2" size="lg" textAlign={'center'}>
                You're all set {capitalize(name.first)}!
              </Heading>
              <Text color="gray.500" marginTop={2} textAlign="center">
                We'll match you with students within your availability &amp;
                shoot you an email at {email} with next steps!
              </Text>
            </Box>
          </OnboardStep>
        </StepWizard>
      </Box>
    </Box>
  );
};

export default OnboardTutor;
