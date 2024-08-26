import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import { firebaseAuth, updatePassword } from '../../../../firebase';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import {
  Avatar,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Input,
  InputGroup,
  InputRightElement,
  useEditableControls,
  Switch,
  Spacer,
  Divider,
  Button,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  Stack,
  useToast,
  useDisclosure,
  VStack,
  Center,
  Heading,
  UnorderedList,
  ListItem,
  Checkbox
} from '@chakra-ui/react';
import firebase from 'firebase/app';
// import { updatePassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { IoIosAlert } from 'react-icons/io';
import { RiArrowRightSLine } from 'react-icons/ri';
import TandC from '../../../../components/TandC';
import PrivacyPolicy from '../../../../components/PrivacyPolicy';
import { useNavigate } from 'react-router';

function MyProfile(props) {
  const { id, username, email } = props;
  const { user, logoutUser } = userStore();

  const toast = useCustomToast();
  const [newEmail, setNewEmail] = useState<string>(email);

  const [isOpenTandC, setIsOpenTandC] = useState(false);
  const [isOpenPrivacy, setIsOpenPrivacy] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const handleClickOld = () => setShowOldPassword(!showOldPassword);
  const handleClickNew = () => setShowNewPassword(!showNewPassword);

  // const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();
  const {
    isOpen: isConfirmAccountDeleteOpen,
    onOpen: openConfirmAccountDelete,
    onClose: closeConfirmAccountDelete
  } = useDisclosure();
  const {
    isOpen: isUpdateEmailModalOpen,
    onOpen: openUpdateEmailModal,
    onClose: closeUpdateEmailModal
  } = useDisclosure();

  const {
    isOpen: isUpdatePasswordModalOpen,
    onOpen: openUpdatePasswordModal,
    onClose: closeUpdatePasswordModal
  } = useDisclosure();

  useEffect(() => {
    // Simulate sending OTP to the provided email address when the component mounts.
    // In a real application, this would be done through a backend API.
    // For this example, we'll just set isEmailSent to true.
    setIsEmailSent(true);
    if (isUpdatePasswordModalOpen || isUpdateEmailModalOpen) {
      const response = ApiService.sendOtp();
    }

    // Simulate receiving the OTP after a delay (e.g., 2 seconds).
    // In a real application, you would receive the OTP through email or SMS.
    // const timeoutId = setTimeout(() => {
    //   const receivedOtp = '123456'; // Replace with the actual OTP from the server
    //   setOtp(receivedOtp);
    //   setIsOtpVerified(true); // Automatically verify OTP
    // }, 2000); // Simulated delay

    // return () => clearTimeout(timeoutId);
  }, [isUpdateEmailModalOpen, isUpdatePasswordModalOpen]);

  const handleChangeEmail = (e) => {
    setNewEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleOpenTandCModal = () => {
    setIsOpenTandC(true);
  };

  const handleCloseTandCModal = () => {
    setIsOpenTandC(false);
  };
  const handleOpenPrivacyModal = () => {
    setIsOpenPrivacy(true);
  };

  const handleClosePrivacyModal = () => {
    setIsOpenPrivacy(false);
  };
  const handleSaveEmail = async () => {
    const formData = { email: newEmail, ottp: otp };
    const response = await ApiService.updateProfile(formData);
    const resp: any = await response.json();
    closeUpdateEmailModal();
    if (response.status === 200) {
      toast({
        title: 'Email Updated successfully',
        status: 'success',
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        title: 'Something went wrong..',
        status: 'error',
        position: 'top-right',
        isClosable: true
      });
    }
  };
  const handleUpdatePassword = async () => {
    const formData = { password: newPassword, ottp: otp };
    const response = await ApiService.updateProfile(formData);
    const resp: any = await response.json();
    closeUpdatePasswordModal();
    if (response.status === 200) {
      toast({
        title: 'Password Updated successfully',
        status: 'success',
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        title: 'Something went wrong..',
        status: 'error',
        position: 'top-right',
        isClosable: true
      });
    }
  };
  const handleDeleteAccount = async () => {
    const formData = { password: newPassword, ottp: otp };
    const response = await ApiService.deleteAccount(user._id);

    if (response.status === 200) {
      toast({
        title: 'Account Deleted successfully',
        status: 'success',
        position: 'top-right',
        isClosable: true
      });
      logoutUser();
      navigate('/login');
    } else {
      toast({
        title: 'Something went wrong..',
        status: 'error',
        position: 'top-right',
        isClosable: true
      });
    }
  };
  // const handleUpdatePassword = async (e) => {
  //   e.preventDefault();
  //   const users = await firebaseAuth.currentUser;
  //   // const credentials = await firebaseAuth.EmailAuthProvider.credential(
  //   //   users.email,
  //   //   oldPassword
  //   // );
  //   if (users) {
  //     await updatePassword(users, newPassword)
  //       .then(() => {
  //         toast({
  //           render: () => (
  //             <CustomToast
  //               title="Password Updated successfully"
  //               status="success"
  //             />
  //           ),
  //           position: 'top-right',
  //           isClosable: true
  //         });
  //       })
  //       .catch((error) => {
  //         toast({
  //           render: () => (
  //             <CustomToast title="Something went wrong.." status="error" />
  //           ),
  //           position: 'top-right',
  //           isClosable: true
  //         });
  //       });
  //   }
  // };
  return (
    <Box>
      {id && username && email && (
        <>
          {' '}
          <Flex
            gap={3}
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
            mt={2}
            mb={4}
          >
            <Avatar
              boxSize="64px"
              color="white"
              name={username}
              bg="#4CAF50;"
            />
            <Stack spacing={'2px'}>
              <Text
                fontSize="16px"
                fontWeight={500}
                color="text.200"
                display={{ base: 'block', sm: 'none', md: 'block' }}
              >
                {username}
              </Text>{' '}
              <Text fontSize={14} color="text.400">
                {email}
              </Text>
            </Stack>
          </Flex>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
          >
            <Text fontSize={'12px'} color="text.400" mb={2}>
              ACCOUNT SECURITY
            </Text>

            <Divider />
            <Flex gap={5} direction="column" py={2}>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Email
                  </Text>{' '}
                  {email && (
                    <Editable
                      defaultValue={email}
                      onChange={(e: any) => setNewEmail(e)}
                    >
                      <EditablePreview fontSize={12} color="text.300" />
                      <EditableInput />
                    </Editable>
                  )}
                </Stack>
                <Spacer />{' '}
                <Button
                  variant="unstyled"
                  sx={{
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    px: 4,
                    border: '1px solid #E7E8E9',
                    color: '#5C5F64',
                    height: '29px',
                    _hover: {
                      color: '#207df7',
                      backgroundColor: '#F0F6FE'
                    }
                  }}
                  // isDisabled={!newEmail || email === newEmail}
                  // onClick={handleSaveEmail}
                  onClick={openUpdateEmailModal}
                >
                  Change
                </Button>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Password
                  </Text>{' '}
                  {/* <Text fontSize={12} color="text.200">
                verify old password
              </Text> */}
                  {/* <InputGroup size="xs" fontSize={12}>
                <Input
                  pr="4.5rem"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    variant="unstyled"
                    onClick={handleClickOld}
                    fontSize={10}
                    color="text.300"
                    mt={1}
                  >
                    {showOldPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <InputGroup size="xs" fontSize={12}>
                <Input
                  pr="4.5rem"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    variant="unstyled"
                    onClick={handleClickNew}
                    fontSize={10}
                    color="text.300"
                    mt={1}
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup> */}
                  <Editable
                    defaultValue={newPassword}
                    onChange={(e: any) => setNewPassword(e)}
                  >
                    <EditablePreview fontSize={12} color="text.300" />
                    <EditableInput />
                  </Editable>
                </Stack>
                <Spacer />
                <Button
                  variant="unstyled"
                  sx={{
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    px: 4,
                    border: '1px solid #E7E8E9',
                    color: '#5C5F64',
                    height: '29px',
                    _hover: {
                      color: '#207df7',
                      backgroundColor: '#F0F6FE'
                    }
                  }}
                  onClick={openUpdatePasswordModal}
                >
                  Change
                </Button>
              </Flex>
              {/* LOG OUT OF ALL DEVICES */}
              {/* <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="#F53535"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Log out of all devices
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Log out of all other active sessions on other devices
                    besides this one.
                  </Text>
                </Stack>
                <Spacer /> <RiArrowRightSLine size="24px" color="#969CA6" />
              </Flex> */}
            </Flex>
          </Box>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
            my={4}
          >
            <Text fontSize={'12px'} color="text.400" mb={2}>
              MANAGE ALERTS
            </Text>

            <Divider />
            <Flex gap={4} direction="column" py={2}>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Email Notifications
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Receive email updates, including schedule alerts
                  </Text>
                </Stack>
                <Spacer /> <Switch colorScheme={'whatsapp'} size="lg" />
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Mobile Notifications
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Receive email updates, including schedule alerts
                  </Text>
                </Stack>
                <Spacer />
                <Switch colorScheme={'whatsapp'} size="lg" />
              </Flex>
            </Flex>
          </Box>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
          >
            <Text fontSize={'12px'} color="text.400" mb={2}>
              SUPPORT
            </Text>

            <Divider />
            <Flex gap={4} direction="column" py={2}>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Terms and conditions
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Read Sherperd’s terms & conditions
                  </Text>
                </Stack>
                <Spacer />{' '}
                <Box _hover={{ cursor: 'pointer' }}>
                  <RiArrowRightSLine
                    size="24px"
                    color="#969CA6"
                    onClick={handleOpenTandCModal}
                  />
                </Box>
                <Modal
                  isOpen={isOpenTandC}
                  onClose={handleCloseTandCModal}
                  size="2xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>
                      Terms and Conditions of www.shepherd.study
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {/* <iframe
                        title="PDF Viewer"
                        src={
                          'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'
                        }
                        width="100%"
                        height="500px"
                      /> */}
                      <TandC />
                    </ModalBody>
                    <ModalFooter>
                      <Flex>
                        <Text fontSize="sm" color="gray.600">
                          Last Updated: February 12, 2024
                        </Text>
                      </Flex>
                      <Spacer />
                      <Button
                        colorScheme="blue"
                        onClick={handleCloseTandCModal}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Privacy Policy
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Read Sherperd’s privacy policy
                  </Text>
                </Stack>
                <Spacer />{' '}
                <Box _hover={{ cursor: 'pointer' }}>
                  <RiArrowRightSLine
                    size="24px"
                    color="#969CA6"
                    onClick={handleOpenPrivacyModal}
                  />
                </Box>
                <Modal
                  isOpen={isOpenPrivacy}
                  onClose={handleClosePrivacyModal}
                  size="2xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>
                      Privacy Policy of www.shepherd.study
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <PrivacyPolicy />
                    </ModalBody>
                    <ModalFooter>
                      <Flex>
                        <Text fontSize="sm" color="gray.600">
                          Last Updated: February 12, 2024
                        </Text>
                      </Flex>
                      <Spacer />
                      <Button
                        colorScheme="blue"
                        onClick={handleClosePrivacyModal}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Contact support
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Need help? Please reach out to our support team.
                  </Text>
                </Stack>
                <Spacer />
                <Text fontSize={12} color="text.300">
                  hello@shepherd.study
                </Text>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="#F53535"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Delete my account
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Permanently delete your Shepherd account
                  </Text>
                </Stack>
                <Spacer />{' '}
                <RiArrowRightSLine
                  size="24px"
                  color="#969CA6"
                  onClick={openConfirmAccountDelete}
                />
              </Flex>
            </Flex>
          </Box>
        </>
      )}

      <Modal
        isOpen={isUpdateEmailModalOpen}
        onClose={closeUpdateEmailModal}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                Update Email Address
              </Text>
              <Text>An OTP has been sent to your existing email address.</Text>

              {isEmailSent ? (
                <>
                  <FormControl>
                    <FormLabel> New Email</FormLabel>
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={handleChangeEmail}
                      placeholder="Enter your new email"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>OTP (One-Time Password)</FormLabel>
                    <Input
                      type="text"
                      value={otp}
                      // isReadOnly={isOtpVerified}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </FormControl>
                  {/* <Button
                    colorScheme="teal"
                    // onClick={handleVerifyOtp}
                    isDisabled={isOtpVerified}
                  >
                    Submit
                  </Button>
                  {isOtpVerified && (
                    <Text color="green.500">Email updated successfully!</Text>
                  )} */}
                </>
              ) : (
                <Text>Waiting for OTP...</Text>
              )}
            </VStack>
          </Box>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={closeUpdateEmailModal} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveEmail} variant="outline">
                Update
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isUpdatePasswordModalOpen}
        onClose={closeUpdatePasswordModal}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                Update Password
              </Text>
              <Text>An OTP has been sent to your Email address.</Text>

              {isEmailSent ? (
                <>
                  <FormControl>
                    <FormLabel> New Password</FormLabel>
                    <Input
                      type="Password"
                      value={newPassword}
                      onChange={handleChangePassword}
                      placeholder="Enter your new Password"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>OTP (One-Time Password)</FormLabel>
                    <Input
                      type="text"
                      value={otp}
                      // isReadOnly={isOtpVerified}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </FormControl>
                  {/* <Button
                    colorScheme="teal"
                    // onClick={handleVerifyOtp}
                    isDisabled={isOtpVerified}
                  >
                    Submit
                  </Button>
                  {isOtpVerified && (
                    <Text color="green.500">Email updated successfully!</Text>
                  )} */}
                </>
              ) : (
                <Text>Waiting for OTP...</Text>
              )}
            </VStack>
          </Box>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={closeUpdatePasswordModal} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword} variant="outline">
                Update
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isConfirmAccountDeleteOpen}
        onClose={closeConfirmAccountDelete}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Center flexDirection={'column'}>
              <Box>
                <svg
                  width="90"
                  height="70"
                  viewBox="0 0 73 62"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_2506_16927)">
                    <circle cx="36.5" cy="28" r="20" fill="white" />
                    <circle
                      cx="36.5"
                      cy="28"
                      r="19.65"
                      stroke="#EAEAEB"
                      stroke-width="0.7"
                    />
                  </g>
                  <path
                    d="M36.5002 37.1663C31.4376 37.1663 27.3335 33.0622 27.3335 27.9997C27.3335 22.9371 31.4376 18.833 36.5002 18.833C41.5627 18.833 45.6668 22.9371 45.6668 27.9997C45.6668 33.0622 41.5627 37.1663 36.5002 37.1663ZM35.5835 30.7497V32.583H37.4168V30.7497H35.5835ZM35.5835 23.4163V28.9163H37.4168V23.4163H35.5835Z"
                    fill="#F53535"
                  />
                  <defs>
                    <filter
                      id="filter0_d_2506_16927"
                      x="0.5"
                      y="0"
                      width="72"
                      height="72"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="8" />
                      <feGaussianBlur stdDeviation="8" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.32 0 0 0 0 0.389333 0 0 0 0 0.48 0 0 0 0.11 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2506_16927"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2506_16927"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </Box>
              <Text my={2} fontSize={20} fontWeight="bold">
                Are You Sure?
              </Text>
              <Text align={'center'}>
                Are you sure you want to delete your account? This action cannot
                be undone. All files and data associated with this user will be
                lost
              </Text>
            </Center>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              onClick={closeConfirmAccountDelete}
              w="50%"
              variant="outline"
            >
              Cancel
            </Button>
            <Spacer />
            <Button
              color="white"
              bg="red.400"
              _hover={{ bg: 'darkred' }}
              w="50%"
              onClick={handleDeleteAccount}
              // isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MyProfile;
