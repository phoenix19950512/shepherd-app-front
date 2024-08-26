import priceData from '../mocks/pricing.json';
import ApiService from '../services/ApiService';
import userStore from '../state/userStore';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  ModalHeader,
  ModalFooter
} from '@chakra-ui/react';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SubscriptionRedirectModal from './SubscriptionRedirectModal';

interface ToggleProps {
  setTogglePlansModal: (state: boolean) => void;
  togglePlansModal: boolean;
}
interface PriceTier {
  tier: string;
  price: string;
  cycle: string;
  subscription?: string;
  value: string[];
  popular?: boolean;
  priceId: string;
  lookup_key: string;
}
interface PriceCardListProps {
  priceData: PriceTier[];
  hasActiveSubscription: boolean;
  user: any;
  redirectToCustomerPortal: () => void;
  getButtonText: (userSubscription, priceCard) => string;
  getTrialButtonText: (priceCard) => string;
  handleSubscriptionClick: (priceId, priceTier) => void;
  activeSubscription: any;
  activePlanLookupKey: string;
}

const PriceCardList: React.FC<PriceCardListProps> = ({
  priceData,
  hasActiveSubscription,
  user,
  redirectToCustomerPortal,
  getButtonText,
  getTrialButtonText,
  handleSubscriptionClick,
  activeSubscription,
  activePlanLookupKey
}) => {
  return (
    <Box padding={'10px'}>
      {user && hasActiveSubscription ? (
        <div className="landing-price-wrapper">
          {priceData.map((priceCard) => (
            <div
              className={`landing-price-card ${
                activeSubscription &&
                activePlanLookupKey === priceCard.lookup_key
                  ? 'landing-price-card-active'
                  : ''
              }`}
              style={{
                position: priceCard.popular ? 'relative' : 'static'
              }}
            >
              {priceCard.popular &&
                !(activePlanLookupKey === priceCard.lookup_key) && (
                  <Text className="landing-price-sub-bubble">Popular</Text>
                )}
              <div
                className={`${
                  activeSubscription &&
                  activePlanLookupKey === priceCard.lookup_key
                    ? 'landing-plan-wrapper'
                    : 'landing-metric-wrapper'
                }`}
              >
                <Text className="landing-price-level">{priceCard.tier}</Text>
                {activePlanLookupKey === priceCard.lookup_key && (
                  <Box className="landing-price-level-plan">Current Plan</Box>
                )}
              </div>
              <div className="landing-metric-wrapper">
                <Text className="landing-price-point">{priceCard.price}</Text>
                {priceCard.cycle && (
                  <Text
                    className="landing-metric-tag"
                    style={{ fontWeight: '400' }}
                  >
                    {priceCard.cycle}
                  </Text>
                )}
              </div>
              <div className="landing-section-item-modal">
                {priceCard['value'].map((value) => (
                  <div className="landing-price-value">
                    <img
                      className="landing-check-icon"
                      src="/images/checkIcon.svg"
                      alt="price"
                    />
                    <Text className="landing-desc-mini" fontSize={14}>
                      {value}
                    </Text>
                  </div>
                ))}
                <Button
                  className="landing-price-btn"
                  onClick={() => redirectToCustomerPortal()}
                >
                  {getButtonText(activeSubscription, priceCard)}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="landing-price-wrapper">
          {priceData.map((priceCard) => (
            <div
              className={`landing-price-card ${
                priceCard.lookup_key === 'free'
                  ? 'landing-price-card-active'
                  : ''
              }`}
              style={{
                position: priceCard.popular ? 'relative' : 'static'
              }}
            >
              {priceCard.popular && (
                <Text className="landing-price-sub-bubble">Popular</Text>
              )}
              <div
                className={`${
                  priceCard.lookup_key === 'free'
                    ? 'landing-plan-wrapper'
                    : 'landing-metric-wrapper'
                }`}
              >
                <Text className="landing-price-level">{priceCard.tier}</Text>
                {priceCard.lookup_key === 'free' && (
                  <Box className="landing-price-level-plan">Current Plan</Box>
                )}
              </div>
              <div className="landing-metric-wrapper">
                <Text className="landing-price-point">{priceCard.price}</Text>
                {priceCard.cycle && (
                  <Text
                    className="landing-metric-tag"
                    style={{ fontWeight: '400' }}
                  >
                    {priceCard.cycle}
                  </Text>
                )}
              </div>
              <div className="landing-section-item-modal">
                {priceCard['value'].map((value) => (
                  <div className="landing-price-value">
                    <img
                      className="landing-check-icon"
                      src="/images/checkIcon.svg"
                      alt="price"
                    />
                    <Text className="landing-desc-mini" fontSize={14}>
                      {value}
                    </Text>
                  </div>
                ))}
                <Button
                  className="landing-price-btn"
                  onClick={() =>
                    handleSubscriptionClick(priceCard.priceId, priceCard.tier)
                  }
                >
                  {!user || (user && !user.hadSubscription)
                    ? getTrialButtonText(priceCard)
                    : priceCard.tier === 'Free'
                    ? 'Manage Your Account'
                    : `Get Started`}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Text
        textAlign="center"
        my={2}
        fontSize={14}
        fontWeight={500}
        color="text.300"
      >
        For more details & enquiries?{' '}
        <span className="text-blue-600">Contact Support</span>
      </Text>
    </Box>
  );
};

const PlansModal = ({
  setTogglePlansModal,
  togglePlansModal,
  message,
  subMessage
}: ToggleProps & { message?: string; subMessage?: string }) => {
  const [showSelected, setShowSelected] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const { user, fetchUser, activeSubscription, hasActiveSubscription }: any =
    userStore();
  const activePlanLookupKey = activeSubscription?.lookup_key || 'free';
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const navigate = useNavigate();

  // State for pricing mode
  const [isYearlyPricing, setIsYearlyPricing] = useState(false);

  // Toggle function for pricing mode
  const togglePricingMode = () => {
    setIsYearlyPricing(!isYearlyPricing);
  };

  // Filter price data based on the selected pricing mode
  const filteredPriceData = priceData.filter((price) =>
    isYearlyPricing
      ? price.cycle.includes('/year')
      : price.cycle.includes('/month')
  );

  const filterPriceData = (cycle: string) => {
    return priceData.filter((price) => price.cycle.includes(cycle));
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const planPriorities = {
    basic_monthly: 1,
    premium_monthly: 2,
    basic_yearly: 3,
    premium_yearly: 4
  };

  // Function to determine the button text
  const getButtonText = (userPlan, cardPlan) => {
    const userPlanPriority = planPriorities[userPlan.lookup_key] || 0;
    const cardPlanPriority = planPriorities[cardPlan.lookup_key];

    if (userPlanPriority === cardPlanPriority) {
      return 'Manage your plan';
    } else if (userPlanPriority < cardPlanPriority) {
      return 'Upgrade plan';
    } else {
      return 'Downgrade plan';
    }
  };

  const getTrialButtonText = (priceCard) => {
    if (priceCard.tier === 'Basic') {
      return 'Start Basic Subscription';
    } else if (priceCard.tier === 'Premium') {
      return 'Start Premium Subscription';
    } else {
      // Default case if neither Basic nor Premium
      return 'Manage Your Account';
    }
  };

  const handleSubscriptionClick = async (priceIdKey, priceTier) => {
    if (!user || !user.id) {
      // Handle unauthenticated user scenario

      openModal('You will be redirected to create an account');
      setTimeout(() => {
        navigate('/signup');
      }, 150);
      return;
    }

    if (user?.isMobileSubscription) {
      handleClose();
      closeModal();
      setIsRedirectModalOpen(true);
      return;
    }

    let session;
    const priceId = process.env[priceIdKey];

    if (!priceId) {
      session = await ApiService.getStripeCustomerPortalUrl(
        user.stripeCustomerId
      );
    } else {
      session = await ApiService.initiateUserSubscription(
        user.id,
        priceId,
        priceTier,
        user.stripeCustomerId ? user.stripeCustomerId : null
      );
    }
    const portal = await session.json();
    window.location.href = portal.url;
  };

  // Function to redirect to Stripe's customer portal
  const redirectToCustomerPortal = async () => {
    if (user?.isMobileSubscription) {
      handleClose();
      closeModal();
      setIsRedirectModalOpen(true);
      return;
    }
    const session = await ApiService.getStripeCustomerPortalUrl(
      user.stripeCustomerId,
      activeSubscription.stripeSubscriptionId,
      activeSubscription.tier
    );
    const portal = await session.json();

    window.location.href = portal.url;
  };

  const handleClose = () => {
    setTogglePlansModal(false);
  };

  const handleShowSelected = () => {
    setShowSelected(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="pm">
      <SubscriptionRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
      />
      {togglePlansModal && (
        <Transition.Root show={togglePlansModal} as={Fragment}>
          <Dialog as="div" className="relative z-[2000]" onClose={() => null}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-[2000] overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white mt-10 text-left shadow-xl transition-all sm:w-fit sm:max-w-fit">
                    <div>
                      <div className="flex justify-between align-middle border-b pb-2 px-2">
                        <Box p={2}>
                          {message && (
                            <>
                              <Text
                                fontSize={24}
                                fontWeight={600}
                                color={'text.200'}
                                textAlign={'center'}
                              >
                                {message}
                              </Text>
                              {subMessage && (
                                <Text
                                  fontSize={17}
                                  fontWeight={500}
                                  color="text.300"
                                  mt={2}
                                >
                                  {subMessage}
                                </Text>
                              )}
                            </>
                          )}
                          {!message && (
                            <>
                              <Text
                                fontSize={24}
                                fontWeight={600}
                                color="text.200"
                              >
                                Select your Plan
                              </Text>
                              <Text
                                fontSize={14}
                                fontWeight={500}
                                color="text.400"
                              >
                                One-click Cancel at anytime.
                              </Text>
                            </>
                          )}
                        </Box>
                        <button
                          onClick={handleClose}
                          className="inline-flex h-6 space-x-1 items-center rounded-full bg-gray-100 px-2 py-1 mt-4 mb-2 mr-4 text-xs font-medium text-secondaryGray hover:bg-orange-200 hover:text-orange-600"
                        >
                          <span>Close</span>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                      {/* <Tabs isFitted>
                        <TabList
                          marginTop="25px"
                          width={'80%'}
                          marginLeft={'auto'}
                          marginRight={'auto'}
                        >
                          <Tab>Monthly</Tab>
                          <Tab>Yearly</Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel> */}
                      <PriceCardList
                        priceData={filterPriceData('/month')}
                        hasActiveSubscription={hasActiveSubscription}
                        activeSubscription={activeSubscription}
                        activePlanLookupKey={activePlanLookupKey}
                        user={user}
                        redirectToCustomerPortal={redirectToCustomerPortal}
                        getButtonText={getButtonText}
                        getTrialButtonText={getTrialButtonText}
                        handleSubscriptionClick={handleSubscriptionClick}
                      />
                      {/* </TabPanel>
                          <TabPanel>
                            <PriceCardList
                              priceData={filterPriceData('/year')}
                              hasActiveSubscription={hasActiveSubscription}
                              user={user}
                              redirectToCustomerPortal={
                                redirectToCustomerPortal
                              }
                              getButtonText={getButtonText}
                              getTrialButtonText={getTrialButtonText}
                              handleSubscriptionClick={handleSubscriptionClick}
                            />
                          </TabPanel>
                        </TabPanels>
                      </Tabs> */}

                      {/* <div className="overflow-hidden sm:w-[80%] w-full mx-auto p-6 pt-3  bg-white sm:grid sm:grid-cols-3 justify-items-center sm:gap-x-4 sm:space-y-0 space-y-2">
                        {actions2.map((action) => (
                          <div
                            onClick={() => {
                              if (action.showModal) handleShowSelected();
                            }}
                            key={action.title}
                            className="group cursor-pointer relative transform  bg-white border-1 rounded-lg  border-gray-300 p-4 focus-within:border-blue-500 hover:border-blue-500"
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <button className="text-base font-semibold leading-6 text-orange-400">
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {action.title}
                              </button>
                              <Text className="mt-2 text-sm text-secondaryGray">
                                {action.description}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <p>{modalContent}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PlansModal;
