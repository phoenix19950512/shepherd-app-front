import { useCustomToast } from '../../components/CustomComponents/CustomToast/useCustomToast';
import LinedList from '../../components/LinedList';
import PageTitle from '../../components/PageTitle';
import Panel from '../../components/Panel';
import TutorCard from '../../components/TutorCard';
import { useTitle } from '../../hooks';
import ApiService from '../../services/ApiService';
// import userStore from '../../state/userStore';
import theme from '../../theme';
import {
  numberToDayOfWeekName,
  convertTimeToTimeZone,
  convertTimeToDateTime
} from '../../util';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { capitalize, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { MdInfo } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import ShepherdSpinner from './components/shepherd-spinner';

const LeftCol = styled(Box)`
  min-height: 100vh;
`;

const OfferValueText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.001em;
  color: ${theme.colors.text[200]};
  margin-bottom: 0;
`;

const RightCol = styled(Box)``;

const Root = styled(Box)``;

export const scheduleOptions = [
  {
    label: 'Weekly',
    value: 'weekly'
  },
  {
    label: 'Twice a week',
    value: 'twice-a-week'
  },
  {
    label: 'Fortnightly',
    value: 'fortnightly'
  },
  {
    label: 'Monthly',
    value: 'monthly'
  }
];

const Offer = () => {
  useTitle('Offer');
  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard/');

  const toast = useCustomToast();

  const { offerId } = useParams() as { offerId: string };

  const navigate = useNavigate();
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [offer, setOffer] = useState<any | null>(null);
  const [acceptingOffer, setAcceptingOffer] = useState(false);
  const [declineNote, setDeclineNote] = useState('');
  const [decliningOffer, setDecliningOffer] = useState(false);
  const [withdrawingOffer, setWithdrawingOffer] = useState(false);

  const {
    isOpen: isOfferAcceptedModalOpen,
    onOpen: onOfferAcceptedModalOpen,
    onClose: onOfferAcceptedModalClose
  } = useDisclosure();
  const {
    isOpen: isDeclineOfferModalOpen,
    onOpen: onDeclineOfferModalOpen,
    onClose: onDeclineOfferModalClose
  } = useDisclosure();
  const {
    isOpen: isWithdrawOfferModalOpen,
    onOpen: onWithdrawOfferModalOpen,
    onClose: onWithdrawOfferModalClose
  } = useDisclosure();

  const loadOffer = useCallback(async () => {
    setLoadingOffer(true);
    const resp = await ApiService.getOffer(offerId);
    setOffer(await resp.json());
    setLoadingOffer(false);
  }, [offerId]);
  //   setBookingOffer(true);
  //   const chosenPaymentMethod = offer?.paymentMethod;
  //   const resp = await ApiService.bookOffer(
  //     offer?._id as string,
  //     chosenPaymentMethod?._id
  //   );
  //   switch (resp?.status) {
  //     case 200:
  //       toast({
  //         title: 'Your offer has been booked successfully.',
  //         status: 'success',
  //         position: 'top',
  //         isClosable: true
  //       });
  //       loadOffer();
  //       break;
  //     case 400:
  //       toast({
  //         title: 'Something went wrong',
  //         status: 'error',
  //         position: 'top',
  //         isClosable: true
  //       });
  //       break;
  //     case 401: // Handle payment failure separately
  //       toast({
  //         title:
  //           'Failed to process payment details. Please try another payment method.',
  //         status: 'error',
  //         position: 'top',
  //         isClosable: true
  //       });
  //       break;
  //     default:
  //       toast({
  //         title: 'Something went wrong.',
  //         status: 'error',
  //         position: 'top',
  //         isClosable: true
  //       });
  //       break;
  //   }
  //   // setOffer(await resp.json());
  //   setBookingOffer(false);
  //   // window.location.reload();
  // };

  const acceptOffer = async () => {
    setAcceptingOffer(true);
    const resp = await ApiService.acceptOffer(offer?._id as string);
    // setOffer(await resp.json());
    switch (resp?.status) {
      case 200:
        toast({
          title: 'Offer has been accepted and booked successfully.',
          status: 'success',
          position: 'top',
          isClosable: true
        });
        loadOffer();
        onOfferAcceptedModalOpen();
        break;
      case 400:
        toast({
          title: 'Something went wrong',
          status: 'error',
          position: 'top',
          isClosable: true
        });
        break;

      default:
        toast({
          title: 'Something went wrong.',
          status: 'error',
          position: 'top',
          isClosable: true
        });
        break;
    }
    setAcceptingOffer(false);
  };

  const declineOffer = async () => {
    setDecliningOffer(true);
    const resp = await ApiService.declineOffer(
      offer?._id as string,
      declineNote
    );
    setOffer(await resp.json());
    onDeclineOfferModalClose();
    setDecliningOffer(false);
  };

  const withdrawOffer = async () => {
    setWithdrawingOffer(true);
    const resp = await ApiService.withdrawOffer(offer?._id as string);
    setOffer(await resp.json());
    onWithdrawOfferModalClose();
    setWithdrawingOffer(false);
  };

  useEffect(() => {
    loadOffer();
  }, [loadOffer]);

  const loading = loadingOffer;

  return (
    <Root className="container-fluid">
      <Box className="row" padding="20px">
        <LeftCol mb="32px" className="col-lg-8">
          {loading && (
            <Box textAlign={'center'}>
              <ShepherdSpinner />
            </Box>
          )}
          {!!offer && (
            <Box>
              <Modal
                isOpen={isOfferAcceptedModalOpen}
                onClose={onOfferAcceptedModalClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Box display={'flex'} justifyContent="center">
                        <img
                          alt="offer accepted"
                          src="/images/offer-accepted-confetti.svg"
                        />
                      </Box>
                      <Box marginTop={0}>
                        <Text className="modal-title">Offer Accepted</Text>
                        <div
                          style={{
                            color: theme.colors.text[400]
                          }}
                        >
                          {offer.student?.user?.name?.first}{' '}
                          {offer.student?.user?.name?.last} has been added to
                          your message list
                        </div>
                      </Box>
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      onClick={() =>
                        navigate('/dashboard/tutordashboard/messages')
                      }
                    >
                      Send a message
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal
                isOpen={isWithdrawOfferModalOpen}
                onClose={onWithdrawOfferModalClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Box display={'flex'} justifyContent="center">
                        <img
                          alt="withdraw offer"
                          src="/images/file-shadow.svg"
                        />
                      </Box>
                      <Box marginTop={0}>
                        <Text className="modal-title">Withdraw offer</Text>
                        <div
                          style={{
                            color: theme.colors.text[400]
                          }}
                        >
                          Are you sure you want to withdraw your offer to{' '}
                          {offer.tutor?.user?.name?.first}?
                        </div>
                      </Box>
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <HStack gap="20px">
                      <Button
                        variant={'floating'}
                        onClick={onWithdrawOfferModalClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        isLoading={withdrawingOffer}
                        margin={'0 !important'}
                        variant={'destructiveSolid'}
                        onClick={withdrawOffer}
                      >
                        Withdraw
                      </Button>
                    </HStack>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal
                onOverlayClick={onDeclineOfferModalClose}
                isOpen={isDeclineOfferModalOpen}
                onClose={onDeclineOfferModalOpen}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalBody padding={0} flexDirection="column">
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Text className="sub3" color="text.200">
                        Decline Offer
                      </Text>
                      <Divider mb={0} orientation="horizontal" />
                    </Box>
                    <Box w={'100%'} p={6}>
                      <FormLabel color={'#5C5F64'}>
                        Add a note{' '}
                        <Box color="text.500" as="span">
                          (Optional)
                        </Box>
                      </FormLabel>
                      <Textarea
                        placeholder="Let the client know what your terms are"
                        onChange={(e) => setDeclineNote(e.target.value)}
                        value={declineNote}
                      />
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      isLoading={decliningOffer}
                      variant={'destructiveSolid'}
                      onClick={() => declineOffer()}
                    >
                      Confirm
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Breadcrumb
                spacing="8px"
                separator={<FiChevronRight size={10} color="gray.500" />}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/tutordashboard/offers">
                    Offers
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#">Review Offer</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              {isTutor && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title="Review Offer"
                  subtitle={`Respond to offer from clients, you may also choose to renegotiate`}
                />
              )}
              {!isTutor && offer.status === 'accepted' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title={offer.completed ? 'Offer' : 'Confirm Offer'}
                  subtitle={
                    offer.completed
                      ? `Your offer has been completed`
                      : `Your offer  accepted, proceed to make payment`
                  }
                />
              )}
              {!isTutor && offer.status === 'declined' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title="Offer Declined"
                  subtitle={`Your offer has been declined, choose to update or cancel offer`}
                />
              )}
              {!isTutor && offer.status === 'draft' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title="Offer"
                  subtitle={`You made an offer to ${offer.tutor.user.name.first}`}
                />
              )}
              {!isTutor && offer.status === 'withdrawn' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title="Offer Withdrawn"
                  subtitle={``}
                />
              )}
              <VStack spacing="32px" alignItems={'stretch'}>
                {isTutor && (
                  <Panel display={'flex'}>
                    <Box
                      width={'100%'}
                      display={'flex'}
                      flexDirection="row"
                      gap="20px"
                    >
                      <Box>
                        <Avatar
                          width={'45px'}
                          height="45px"
                          name={`${offer.student?.user?.name?.first} ${offer.student?.user?.name?.last}`}
                        />
                      </Box>
                      <Box flexGrow={1}>
                        <HStack justifyContent={'space-between'}>
                          <Text className="sub2" color={'text.200'} mb={0}>
                            {capitalize(offer.student?.user?.name?.first)}{' '}
                            {capitalize(offer.student?.user?.name?.last)}
                          </Text>
                        </HStack>
                        <Text
                          noOfLines={2}
                          whiteSpace={'normal'}
                          mt={1}
                          mb={0}
                          className="body2"
                          color={'text.200'}
                        >
                          {!offer.expired
                            ? 'Offer expires in'
                            : 'Offer expired'}{' '}
                          <Box as="span" color={'red.400'}>
                            {moment(offer.expirationDate).fromNow()}
                          </Box>
                        </Text>
                      </Box>
                      <Box
                        alignSelf={'flex-start'}
                        background={'#F4F5F6'}
                        padding="3px 8px"
                        borderRadius={'4px'}
                        color="text.400"
                        fontSize={'12px'}
                        fontWeight="500"
                        lineHeight={'17px'}
                      >
                        {moment(offer.createdAt).format('D.MM.YYYY')}
                      </Box>
                    </Box>
                  </Panel>
                )}
                {!isTutor && <TutorCard tutor={offer.tutor} />}
                <Panel>
                  <Text className="sub1" mb={0}>
                    Offer Settings
                  </Text>
                  <Box mt={8}>
                    <VStack spacing={'24px'} alignItems="flex-start">
                      <Box>
                        <FormLabel>Offer expiration date</FormLabel>
                        <OfferValueText>
                          {moment(offer.expirationDate).format('MMMM Do YYYY')}
                        </OfferValueText>
                      </Box>
                      <SimpleGrid
                        width={'100%'}
                        columns={{ base: 1, sm: 2 }}
                        spacing="15px"
                      >
                        <Box>
                          <FormLabel>Contract starts</FormLabel>
                          <OfferValueText>
                            {moment(offer.contractStartDate).format(
                              'Do MMMM YYYY'
                            )}
                          </OfferValueText>
                        </Box>
                        <Box>
                          <FormLabel>Contract ends</FormLabel>
                          <OfferValueText>
                            {moment(offer.contractEndDate).format(
                              'Do MMMM YYYY'
                            )}
                          </OfferValueText>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </Box>
                </Panel>
                <Panel>
                  <Text className="sub1" mb={0}>
                    Offer Details
                  </Text>
                  <Box mt={8}>
                    <VStack spacing={'24px'} alignItems="flex-start">
                      <Box>
                        <FormLabel>Course</FormLabel>
                        <OfferValueText>{offer.course?.label}</OfferValueText>
                      </Box>
                      <Box>
                        <FormLabel>Level</FormLabel>
                        <OfferValueText>{offer.level?.label}</OfferValueText>
                      </Box>
                      <Box>
                        <FormLabel>
                          What days would you like to have your classes
                        </FormLabel>
                        <OfferValueText>
                          {Object.keys(offer.schedule)
                            .map((d) =>
                              numberToDayOfWeekName(parseInt(d), 'ddd')
                            )
                            .join(', ')}
                        </OfferValueText>
                      </Box>
                      {Object.keys(offer.schedule).map((d) => {
                        const n = parseInt(d);
                        return (
                          <Box key={d}>
                            <FormLabel>
                              Time ({numberToDayOfWeekName(n, 'ddd')})
                            </FormLabel>
                            <Flex gap="1px" alignItems="center">
                              <OfferValueText>
                                {convertTimeToTimeZone(
                                  convertTimeToDateTime(
                                    offer.schedule[n].begin
                                  ),
                                  offer.scheduleTz
                                )}
                              </OfferValueText>
                              <FiArrowRight color="#6E7682" size={'15px'} />
                              <OfferValueText>
                                {convertTimeToTimeZone(
                                  convertTimeToDateTime(offer.schedule[n].end),
                                  offer.scheduleTz
                                )}
                              </OfferValueText>
                            </Flex>
                          </Box>
                        );
                      })}
                      <Box>
                        <FormLabel>Note</FormLabel>
                        <OfferValueText>{offer.note || '-'}</OfferValueText>
                      </Box>
                    </VStack>
                  </Box>
                </Panel>
                <Panel>
                  <Text className="sub1" mb={0}>
                    Payment Details
                  </Text>
                  <Box mt={8}>
                    <VStack spacing={'24px'} alignItems="flex-start">
                      <Box>
                        <FormLabel>Hourly rate</FormLabel>
                        <OfferValueText>${offer.rate}/hr</OfferValueText>
                      </Box>
                      <Box>
                        <FormLabel>Total amount</FormLabel>
                        <OfferValueText>${offer.rate}</OfferValueText>
                      </Box>
                    </VStack>
                  </Box>
                  {isTutor && (
                    <Alert status="info" mt="22px">
                      <AlertIcon>
                        <MdInfo color={theme.colors.primary[500]} />
                      </AlertIcon>
                      <AlertDescription>
                        Payout will be made within a week of the end of this
                        contract.
                      </AlertDescription>
                    </Alert>
                  )}
                  {!isTutor && (
                    <Alert status="info" mt="22px">
                      <AlertIcon>
                        <MdInfo color={theme.colors.primary[500]} />
                      </AlertIcon>
                      <AlertDescription>
                        Payment will not be deducted until one hour before your
                        session. You will not be charged if you cancel 24 or
                        more hours before your session.
                      </AlertDescription>
                    </Alert>
                  )}
                  {!isTutor && (
                    <HStack
                      justifyContent={'flex-end'}
                      gap={'19px'}
                      marginTop={'48px'}
                      textAlign="right"
                    >
                      {offer?.status === 'draft' && (
                        <Button
                          onClick={() => onWithdrawOfferModalOpen()}
                          size="md"
                          variant="destructiveSolidLight"
                        >
                          Withdraw Offer
                        </Button>
                      )}
                    </HStack>
                  )}
                </Panel>
              </VStack>
            </Box>
          )}
        </LeftCol>
        <div className="col-lg-4">
          <RightCol height="100%">
            {isTutor && (
              <VStack
                gap={'32px'}
                alignItems="stretch"
                position={'sticky'}
                top="90px"
              >
                {offer?.status === 'draft' && !offer.expired && (
                  <Panel borderRadius={'10px'} position={'sticky'} top="90px">
                    <Box display={'flex'} justifyContent="center">
                      <img
                        alt="file"
                        src="/images/file.svg"
                        width={'80px'}
                        height={'80px'}
                      />
                    </Box>
                    <Text mt={5} mb={0} textAlign="center" className="body2">
                      Respond to the offer before it expires
                    </Text>
                    <VStack mt={8} spacing={'16px'}>
                      <Button
                        isLoading={acceptingOffer}
                        onClick={acceptOffer}
                        w={'100%'}
                        variant="solid"
                      >
                        Accept Offer
                      </Button>
                      <Button
                        onClick={onDeclineOfferModalOpen}
                        w={'100%'}
                        variant="destructiveSolidLight"
                      >
                        Decline Offer
                      </Button>
                    </VStack>
                  </Panel>
                )}
              </VStack>
            )}
            {!isTutor && (
              <VStack
                gap={'32px'}
                alignItems="stretch"
                position={'sticky'}
                top="90px"
              >
                {offer?.status === 'declined' && (
                  <Panel borderRadius={'10px'}>
                    <Box display={'flex'} justifyContent="center">
                      <img
                        alt="file"
                        src="/images/file.svg"
                        width={'80px'}
                        height={'80px'}
                      />
                    </Box>
                    <Text mt={5} mb={0} textAlign="center" className="sub2">
                      Your offer has been declined
                    </Text>
                    {!!offer?.declinedNote && (
                      <Alert status="info" mt="18px">
                        <Text
                          className="body3"
                          fontWeight={500}
                          color="text.400"
                        >
                          {offer?.declinedNote}
                        </Text>
                      </Alert>
                    )}
                    <VStack mt={8} spacing={'16px'}>
                      <Button
                        as="a"
                        href={`../tutor/${offer?.tutor._id}/offer`}
                        w={'100%'}
                        variant="solid"
                      >
                        Update Offer
                      </Button>
                    </VStack>
                  </Panel>
                )}
                {offer?.status === 'accepted' && (
                  <Panel borderRadius={'10px'}>
                    <Box display={'flex'} justifyContent="center">
                      <img
                        alt="file"
                        src="/images/file.svg"
                        width={'80px'}
                        height={'80px'}
                      />
                    </Box>
                    <Text mt={5} mb={0} textAlign="center" className="sub2">
                      Your offer has been accepted
                    </Text>
                    <Text textAlign={'center'} mt={'7px'} className="body2">
                      {capitalize(offer.tutor.user.name.first)} has been added
                      to your tutor list, send them a message
                    </Text>
                    <VStack mt={8} spacing={'16px'}>
                      <Button as="a" w={'100%'} variant="floating">
                        Send message
                      </Button>
                    </VStack>
                  </Panel>
                )}
                <Panel p="24px" borderRadius={'10px'}>
                  <HStack>
                    <BsQuestionCircleFill color="#969CA6" />
                    <Text className="sub2">How this Works</Text>
                  </HStack>
                  <LinedList
                    mt={'30px'}
                    items={[
                      {
                        title: 'Send a Proposal',
                        subtitle:
                          'Find your desired tutor, set your terms, provide payment details and send your offer to the tutor.'
                      },
                      {
                        title: 'Get a Response',
                        subtitle:
                          'Your offer has been sent! Wait for the tutor to review and accept your offer.'
                      },
                      {
                        title: 'Connect with your tutor',
                        subtitle:
                          'You’ll receive a reminder 1 hour before your session. You can reschedule or cancel up to 24 hours before your session starts.'
                      }
                    ]}
                  />
                </Panel>
              </VStack>
            )}
          </RightCol>
        </div>
      </Box>
    </Root>
  );
};

export default Offer;
