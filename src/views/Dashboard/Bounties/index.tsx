import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import PaymentDialog, {
  PaymentDialogRef
} from '../../../components/PaymentDialog';
import { useTitle } from '../../../hooks';
import ApiService from '../../../services/ApiService';
import offerStore from '../../../state/offerStore';
import userStore from '../../../state/userStore';
import theme from '../../../theme';
import BountyOfferModal from '../components/BountyOfferModal';
import Pagination from '../components/Pagination';
import StudentBountyCard from './StudentBountyCard';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MdInfo } from 'react-icons/md';
import ShepherdSpinner from '../components/shepherd-spinner';

function AllBounties() {
  useTitle('Bounties');
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [count, setCount] = useState<number>(5);
  const [days, setDays] = useState<Array<any>>([]);
  const { isLoading, pagination, bounties, fetchBountyOffers } = offerStore();
  const { user, fetchUser } = userStore();
  const toast = useCustomToast();
  const [settingUpPaymentMethod, setSettingUpPaymentMethod] = useState(false);

  //Payment Method Handlers
  const paymentDialogRef = useRef<PaymentDialogRef>(null);

  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
  );
  const setupPaymentMethod = async () => {
    try {
      setSettingUpPaymentMethod(true);
      const paymentIntent = await ApiService.createStripeSetupPaymentIntent();

      const { data } = await paymentIntent.json();
      paymentDialogRef.current?.startPayment(
        data.clientSecret,
        `${window.location.href}`
      );

      setSettingUpPaymentMethod(false);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (clientSecret) {
      (async () => {
        setSettingUpPaymentMethod(true);

        const stripe = await stripePromise;
        const setupIntent = await stripe?.retrieveSetupIntent(clientSecret);
        await ApiService.addPaymentMethod(
          setupIntent?.setupIntent?.payment_method as string
        );

        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            await fetchUser();
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            break;
          case 'processing':
            toast({
              title:
                "Processing payment details. We'll update you when processing is complete.",
              status: 'loading',
              position: 'top',
              isClosable: true
            });
            break;
          case 'requires_payment_method':
            toast({
              title:
                'Failed to process payment details. Please try another payment method.',
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
        setSettingUpPaymentMethod(false);
      })();
    }
    /* eslint-disable */
  }, [clientSecret]);

  const {
    isOpen: isBountyModalOpen,
    onOpen: openBountyModal,
    onClose: closeBountyModal
  } = useDisclosure();

  const doFetchBountyOffers = useCallback(async () => {
    await fetchBountyOffers(page, limit, 'student');
    setAllTutors(bounties);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchBountyOffers();
  }, [doFetchBountyOffers]);

  // const [pagination, setPagination] = useState<PaginationType>();

  // const handleNextPage = () => {
  //   const nextPage = pagination.page + 1;
  //   fetchBountyOffers(nextPage, limit);
  // };

  // const handlePreviousPage = () => {
  //   const prevPage = pagination.page - 1;
  //   fetchBountyOffers(prevPage, limit);
  // };
  const handlePagination = (nextPage: number) => {
    fetchBountyOffers(nextPage, limit, 'student');
  };
  const [tutorGrid] = useAutoAnimate();

  // if (isLoading) {
  //   return (
  //     <Box
  //       p={5}
  //       textAlign="center"
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh'
  //       }}
  //     >
  //       <ShepherdSpinner />
  //     </Box>
  //   );
  // }

  return (
    <>
      <BountyOfferModal
        isBountyModalOpen={isBountyModalOpen}
        closeBountyModal={closeBountyModal}
      />
      <Box p={3}>
        <HStack display={'flex'} width={'full'} justify={'space-between'}>
          <Flex alignItems={'center'} gap={1}>
            <Box>
              <Text fontSize={24} fontWeight={600} color="text.200">
                Bounties
              </Text>
            </Box>

            <Text
              boxSize="fit-content"
              bgColor={'#F4F5F6'}
              p={2}
              borderRadius={'6px'}
            >
              {bounties ? pagination.total : ''}
            </Text>
          </Flex>
          <Button
            onClick={
              user && user.paymentMethods?.length > 0
                ? openBountyModal
                : setupPaymentMethod
            }
          >
            Place Bounty
          </Button>
        </HStack>
      </Box>
      {bounties && bounties.length > 0 ? (
        <>
          <Box p={3}>
            {bounties &&
              bounties.map((bounty) => (
                <StudentBountyCard key={bounty.id} bounty={bounty} />
              ))}
          </Box>
          <Pagination
            page={pagination.page}
            count={pagination.total}
            limit={pagination.limit}
            handlePagination={handlePagination}
          />
        </>
      ) : (
        <>
          <section className="flex justify-center items-center mt-28 w-full">
            <div className="text-center">
              <img src="/images/notes.png" alt="" />
              <Text>You have not placed any bounties yet!</Text>
              <Button
                onClick={
                  user && user.paymentMethods?.length > 0
                    ? openBountyModal
                    : setupPaymentMethod
                }
              >
                Place Bounty
              </Button>
              {/* <button
              type="button"
              className="inline-flex items-center justify-center mt-4 gap-x-2 w-[286px] rounded-md bg-secondaryBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Place Bounty
            </button> */}
            </div>
          </section>

          <PaymentDialog
            ref={paymentDialogRef}
            prefix={
              <Alert status="info" mb="22px">
                <AlertIcon>
                  <MdInfo color={theme.colors.primary[500]} />
                </AlertIcon>
                <AlertDescription>
                  Payment will not be deducted until after your first lesson,
                  You may decide to cancel after your initial lesson.
                </AlertDescription>
              </Alert>
            }
          />
        </>
      )}
    </>
  );
}

export default AllBounties;
