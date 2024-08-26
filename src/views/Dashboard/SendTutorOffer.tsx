import CalendarDateInput from '../../components/CalendarDateInput';
import LinedList from '../../components/LinedList';
import PageTitle from '../../components/PageTitle';
import Panel from '../../components/Panel';
import Select, { Option } from '../../components/Select';
import TimePicker from '../../components/TimePicker';
import TutorCard from '../../components/TutorCard';
import { useTitle } from '../../hooks';
import ApiService from '../../services/ApiService';
// import resourceStore from '../../state/resourceStore';
import userStore from '../../state/userStore';
import theme from '../../theme';
import { Tutor } from '../../types';
import {
  numberToDayOfWeekName,
  convertTimeToTimeZone,
  convertTimeToDateTime,
  convertScheduleToUTC
} from '../../util';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikProps,
  useFormikContext
} from 'formik';
import { capitalize, isEmpty } from 'lodash';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { FiChevronRight } from 'react-icons/fi';
import { MdInfo } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import * as Yup from 'yup';
import ShepherdSpinner from './components/shepherd-spinner';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';
import PaymentDialog, {
  PaymentDialogRef
} from '../../components/PaymentDialog';
import ChoosePaymentMethodDialog, {
  ChoosePaymentMethodDialogRef
} from '../../components/ChoosePaymentMethodDialog';
import { loadStripe } from '@stripe/stripe-js';
import { useCustomToast } from '../../components/CustomComponents/CustomToast/useCustomToast';

const LeftCol = styled(Box)`
  min-height: 100vh;
`;
const RightCol = styled(Box)``;

const Root = styled(Box)``;

const TutorOfferSchema = Yup.object().shape({
  course: Yup.string().required('Select a course'),
  level: Yup.string().required('Select a level'),
  days: Yup.array().min(1, 'Select days').required('Select days'),
  schedule: Yup.object().test(
    'is-schedule-valid',
    'Select start and end time for each day',
    function (value) {
      const { days } = this.parent;
      if (!days || days.length === 0) {
        return true;
      }
      for (const day of days) {
        if (!value || !value[day] || !value[day].begin || !value[day].end) {
          return false;
        }
      }
      return true;
    }
  ),
  note: Yup.string(),
  rate: Yup.number()
    .required('Enter a rate')
    .min(1, 'Rate has to be greater than 0'),
  paymentMethod: Yup.object().required('Choose a payment method'),
  expirationDate: Yup.date().required('Select an expiration date'),
  contractStartDate: Yup.date().required('Select a start date'),
  contractEndDate: Yup.date().required('Select an end date')
});

function convertDateStringsToDates(initialValues) {
  const dateFields = ['contractStartDate', 'contractEndDate', 'expirationDate'];
  const convertedValues = { ...initialValues };

  dateFields.forEach((field) => {
    const value = convertedValues[field];
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      convertedValues[field] = new Date(value);
    }
  });

  return convertedValues;
}

const levels = ['A - Level', 'GCSE', 'Grade 12'];

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
);

const SendTutorOffer = () => {
  useTitle('Send an offer');

  const { fetchUser, user } = userStore();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<any>>(null);

  const [loadingTutor, setLoadingTutor] = useState(false);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const { tutorId } = useParams() as { tutorId: string };
  const [isEditing, setIsEditing] = useState(true);
  const tempFormValuesRef = useRef(null);
  const [settingUpPaymentMethod, setSettingUpPaymentMethod] = useState(false);
  const [selectingPaymentMethod, setSelectingPaymentMethod] = useState(false);
  const paymentDialogRef = useRef<PaymentDialogRef>(null);
  const choosePaymentDialogRef = useRef<ChoosePaymentMethodDialogRef>(null);
  const toast = useCustomToast();

  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');

  const selectPaymentMethod = async () => {
    try {
      setSelectingPaymentMethod(true);
      if (choosePaymentDialogRef.current) {
        choosePaymentDialogRef.current
          .choosePaymentMethod()
          .then((selectedPaymentMethod) => {
            //as PaymentMethod??
            const chosenPaymentMethod = selectedPaymentMethod;
            formikRef.current?.setFieldValue(
              'paymentMethod',
              chosenPaymentMethod
            );
          });
      }
      setSelectingPaymentMethod(false);
    } catch (error) {
      return;
    }
  };

  const setupPaymentMethod = async () => {
    try {
      setSettingUpPaymentMethod(true);

      const currentFormValues = formikRef.current?.values;
      tempFormValuesRef.current = currentFormValues;
      localStorage.setItem(
        'tempFormValues',
        JSON.stringify(tempFormValuesRef.current)
      );

      const paymentIntent = await ApiService.createStripeSetupPaymentIntent({
        metadata: { offerId: 'sample string' } //remove
      });

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
        await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded': {
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            selectPaymentMethod();
            break;
          }
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

  const EditField = styled(Text).attrs({ onClick: () => setIsEditing(true) })`
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.001em;
    margin-bottom: 0;
    color: ${theme.colors.text[200]};

    &:after {
      content: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.59967 2.56938L9.42807 5.39777L2.82843 11.9974H0V9.16904L6.59967 2.56938ZM7.54247 1.62656L8.95667 0.21235C9.21707 -0.0479968 9.63913 -0.0479968 9.89947 0.21235L11.7851 2.09797C12.0455 2.35832 12.0455 2.78043 11.7851 3.04078L10.3709 4.45499L7.54247 1.62656Z' fill='%23585F68'/%3E%3C/svg%3E%0A");
      margin-left: 5px;
    }
  `;

  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose
  } = useDisclosure();

  const loadTutor = useCallback(async () => {
    setLoadingTutor(true);
    const resp = await ApiService.getTutor(tutorId);
    setTutor(await resp.json());
    setLoadingTutor(false);
  }, [tutorId]);

  const courseOptions = useMemo(
    () =>
      tutor?.coursesAndLevels.map((c) => ({
        label: c.course.label,
        value: c.course._id
      })) || [],
    [tutor]
  );

  const levelOptions = useMemo(() => {
    const uniqueLevels = new Set(); // Use a Set to store unique values

    return (
      tutor?.coursesAndLevels
        .map((c) => ({
          label: c.level?.label,
          value: c.level?._id
        }))
        .filter((level) => {
          // Filter out duplicates by checking if the value is already in the Set
          if (uniqueLevels.has(level.value)) {
            return false; // Duplicate, skip it
          } else {
            uniqueLevels.add(level.value); // Not a duplicate, add it to the Set
            return true;
          }
        }) || []
    );
  }, [tutor]);

  useEffect(() => {
    loadTutor();
  }, [loadTutor]);

  const loading = loadingTutor;

  const setScheduleValue = (
    value: any,
    day: number,
    property: 'begin' | 'end'
  ) => {
    const scheduleValue = formikRef.current?.values.schedule;
    if (!scheduleValue[day]) {
      scheduleValue[day] = {};
    }
    scheduleValue[day] = { ...scheduleValue[day], [property]: value };
    formikRef.current?.setFieldValue('schedule', scheduleValue);
  };

  // const dayOptions = [...new Array(6)]
  //   .filter((_, i) => !!tutor?.schedule[i])
  //   .map((_, i) => {
  //     return { label: numberToDayOfWeekName(i), value: i };
  //   });

  // function mapScheduleKeysToValue(schedule) {
  //   return Object.keys(schedule).map((key) => ({
  //     label: numberToDayOfWeekName(Number(key)),
  //     value: key
  //   }));
  // }

  function getDaysBetweenDates(startDate: Date, endDate: Date) {
    const startDay = moment(startDate);
    const endDay = moment(endDate);
    const diffDays = endDay.diff(startDay, 'days');

    let days = [];
    if (diffDays < 7) {
      let currentDay = startDay;
      while (currentDay <= endDay) {
        days.push(currentDay.day());
        currentDay = currentDay.clone().add(1, 'days');
      }
    } else {
      days = Array.from({ length: 7 }, (_, i) => i);
    }

    return days.map((dayNum) => ({
      label: numberToDayOfWeekName(dayNum),
      value: dayNum.toString()
    }));
  }

  const today = useMemo(() => new Date(), []);

  const MainForm = () => {
    const formik = useFormikContext();

    return (
      <>
        <Form>
          <VStack spacing="32px" alignItems={'stretch'}>
            <TutorCard tutor={tutor} />
            <Panel mt={'32px'}>
              <Text className="sub1" mb={8}>
                Offer Settings
              </Text>
              <VStack spacing={8} alignItems="stretch">
                <Field name="expirationDate">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={
                        !!form.errors[field.name] && !!form.touched[field.name]
                      }
                    >
                      <FormLabel>Offer expiration date</FormLabel>
                      {isEditing ? (
                        <CalendarDateInput
                          disabledDate={{ before: today }}
                          value={field.value}
                          onChange={(d) =>
                            form.setFieldValue(
                              field.name,
                              moment(d).endOf('day').toDate()
                            )
                          }
                        />
                      ) : (
                        <EditField>
                          {moment(field.value).format('MMMM Do YYYY')}
                        </EditField>
                      )}
                      <FormErrorMessage>
                        {form.errors[field.name] as string}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <SimpleGrid
                  width={'100%'}
                  columns={{ base: 1, sm: 2 }}
                  spacing="15px"
                >
                  <Field name="contractStartDate">
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={
                          !!form.errors[field.name] &&
                          !!form.touched[field.name]
                        }
                      >
                        <FormLabel>Contract starts</FormLabel>
                        <CalendarDateInput
                          disabledDate={{ before: today }}
                          value={field.value}
                          onChange={(d) => {
                            form.setFieldValue(field.name, d);
                            form.setFieldValue('days', []);
                            form.setFieldValue('schedule', {});
                            // Dynamically set the minDate for contractEndDate
                            form.setFieldValue('contractEndDate', null); // Reset contractEndDate
                            form.setFieldError('contractEndDate', ''); // Clear any previous error
                          }}
                        />
                        <FormErrorMessage>
                          {form.errors[field.name] as string}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="contractEndDate">
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={
                          !!form.errors[field.name] &&
                          !!form.touched[field.name]
                        }
                      >
                        <FormLabel>Contract ends</FormLabel>
                        <CalendarDateInput
                          inputProps={{
                            placeholder: 'Select date',
                            onClick: () =>
                              form.setTouched({
                                ...form.touched,
                                [field.name]: true
                              })
                          }}
                          value={field.value}
                          disabledDate={{
                            before: form.values.contractStartDate
                          }}
                          onChange={(d) => {
                            form.setFieldValue(
                              field.name,
                              moment(d).endOf('day').toDate()
                            );
                            form.setFieldValue('days', []);
                            form.setFieldValue('schedule', {});
                          }}
                        />
                        <FormErrorMessage>
                          {form.errors[field.name] as string}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>
              </VStack>
            </Panel>
            <Panel>
              <Text className="sub1" mb={0}>
                Offer Details
              </Text>
              <Field name="course">
                {({ field, form }: FieldProps) => (
                  <FormControl
                    mt={8}
                    isInvalid={
                      !!form.errors[field.name] && !!form.touched[field.name]
                    }
                  >
                    <FormLabel>Course</FormLabel>
                    {isEditing ? (
                      <Select
                        defaultValue={courseOptions.find(
                          (s: any) => s.value === field.value
                        )}
                        tagVariant="solid"
                        placeholder="Select course"
                        options={courseOptions}
                        isInvalid={
                          !!form.errors[field.name] &&
                          !!form.touched[field.name]
                        }
                        size={'md'}
                        onFocus={() =>
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true
                          })
                        }
                        onChange={(option) =>
                          form.setFieldValue(
                            field.name,
                            (option as Option).value
                          )
                        }
                      />
                    ) : (
                      <EditField>
                        {
                          courseOptions.find(
                            (s: any) => s.value === field.value
                          )?.label
                        }
                      </EditField>
                    )}
                    <FormErrorMessage>
                      {form.errors[field.name] as string}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="level">
                {({ field, form }: FieldProps) => (
                  <FormControl
                    mt={'24px'}
                    isInvalid={
                      !!form.errors[field.name] && !!form.touched[field.name]
                    }
                  >
                    <FormLabel>Level</FormLabel>
                    {isEditing ? (
                      <Select
                        defaultValue={levelOptions.find(
                          (s) => s.value === field.value
                        )}
                        tagVariant="solid"
                        placeholder="Select level"
                        options={levelOptions}
                        isInvalid={
                          !!form.errors[field.name] &&
                          !!form.touched[field.name]
                        }
                        size={'md'}
                        onFocus={() =>
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true
                          })
                        }
                        onChange={(option) =>
                          form.setFieldValue(
                            field.name,
                            (option as Option).value
                          )
                        }
                      />
                    ) : (
                      <EditField>
                        {
                          levelOptions.find((s) => s.value === field.value)
                            ?.label
                        }
                      </EditField>
                    )}
                    <FormErrorMessage>
                      {form.errors[field.name] as string}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="days">
                {({ field, form }: FieldProps) => {
                  const contractStartDate = form.values.contractStartDate;
                  const contractEndDate = form.values.contractEndDate;
                  let dayOptions = [];
                  if (contractStartDate && contractEndDate) {
                    dayOptions = getDaysBetweenDates(
                      contractStartDate,
                      contractEndDate
                    );
                  }
                  return (
                    <FormControl
                      mt={'24px'}
                      isInvalid={
                        !!form.errors[field.name] && !!form.touched[field.name]
                      }
                    >
                      <FormLabel>
                        What days would you like to have your classes
                      </FormLabel>
                      {isEditing ? (
                        <Select
                          isMulti
                          value={dayOptions.filter((option) =>
                            form.values.days.includes(option.value)
                          )}
                          tagVariant="solid"
                          placeholder="Select days"
                          options={dayOptions}
                          size={'md'}
                          onFocus={() =>
                            form.setTouched({
                              ...form.touched,
                              [field.name]: true
                            })
                          }
                          // @ts-ignore: we'll get back to this soon
                          onChange={(option: Option[]) => {
                            form.setFieldValue(
                              field.name,
                              option.map((o) => o.value)
                            );
                          }}
                        />
                      ) : (
                        <EditField>
                          {(field.value as number[])
                            .map((v) => {
                              // return dayOptions.find(
                              //   (d) => d.value === v
                              // )?.label;
                              return numberToDayOfWeekName(v);
                            })
                            .join(', ')}
                        </EditField>
                      )}
                      <FormErrorMessage>
                        {form.errors[field.name] as string}
                      </FormErrorMessage>
                    </FormControl>
                  );
                }}
              </Field>

              {!isEmpty(formik.values['days']) && (
                <VStack mt={'24px'} spacing={'24px'}>
                  {formik.errors['schedule'] && (
                    <Text fontSize={14} color="#f30c0c">
                      {formik.errors['schedule']}
                    </Text>
                  )}

                  {formik.values['days'].map((d: number) => (
                    <SimpleGrid
                      key={d}
                      width={'100%'}
                      columns={{ base: 1, sm: 2 }}
                      spacing="15px"
                    >
                      <FormControl>
                        <FormLabel>
                          Start time ({numberToDayOfWeekName(d, 'ddd')})
                        </FormLabel>
                        {isEditing ? (
                          <TimePicker
                            inputProps={{ placeholder: '00:00 AM' }}
                            value={formik.values['schedule'][d]?.begin ?? ''}
                            onChange={(v) => setScheduleValue(v, d, 'begin')}
                          />
                        ) : (
                          <EditField>
                            {formik.values['schedule'][d]?.begin}
                          </EditField>
                        )}
                        <Box mt={2}>
                          {tutor.schedule[d].length !== 0 && (
                            <Text className="body2" mb={0}>
                              {capitalize(tutor.user.name.first)} is available
                              on {numberToDayOfWeekName(d)}s at these times:
                            </Text>
                          )}
                          {!!tutor.schedule[d] &&
                            tutor.schedule[d].map((s) => (
                              <Text className="body3" mb={0}>
                                {convertTimeToTimeZone(
                                  convertTimeToDateTime(s.begin),
                                  tutor.tz
                                )}
                                -{' '}
                                {convertTimeToTimeZone(
                                  convertTimeToDateTime(s.end),
                                  tutor.tz
                                )}
                              </Text>
                            ))}
                        </Box>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          End time ({numberToDayOfWeekName(d, 'ddd')})
                        </FormLabel>
                        {isEditing ? (
                          <TimePicker
                            inputProps={{ placeholder: '00:00 AM' }}
                            value={formik.values['schedule'][d]?.end ?? ''}
                            onChange={(v) => setScheduleValue(v, d, 'end')}
                          />
                        ) : (
                          <EditField>
                            {formik.values['schedule'][d]?.end}
                          </EditField>
                        )}
                      </FormControl>
                    </SimpleGrid>
                  ))}
                </VStack>
              )}
              <Field name="note">
                {({ field, form }: FieldProps) => (
                  <FormControl mt={'24px'}>
                    <FormLabel>Add a note</FormLabel>
                    {isEditing ? (
                      <Textarea
                        {...field}
                        placeholder={`Let ${tutor.user.name.first} know what you need help with`}
                      />
                    ) : (
                      <EditField>{field.value}</EditField>
                    )}
                  </FormControl>
                )}
              </Field>
            </Panel>
            <Panel>
              <Text className="sub1" mb={0}>
                Payment Details
              </Text>
              <Box mt={'32px'}>
                <Field name="rate">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={
                        !!form.errors[field.name] && !!form.touched[field.name]
                      }
                    >
                      <FormLabel>
                        How much would you like to pay per hour?
                      </FormLabel>
                      {isEditing ? (
                        <InputGroup>
                          <InputLeftAddon children="$" />
                          <Input
                            type={'number'}
                            {...field}
                            isInvalid={
                              !!form.errors[field.name] &&
                              !!form.touched[field.name]
                            }
                          />
                        </InputGroup>
                      ) : (
                        <EditField>${field.value}/hr</EditField>
                      )}
                      <FormErrorMessage>
                        {form.errors[field.name] as string}
                      </FormErrorMessage>
                      <Text
                        color={'#585F68'}
                        className="body3"
                        mb={0}
                        mt={'10px'}
                      >
                        {tutor.user.name.first}'s rate is $
                        {tutor.rate.toFixed(0)}/hr
                      </Text>
                    </FormControl>
                  )}
                </Field>

                <Alert status="info" mt="18px">
                  <AlertIcon>
                    <MdInfo color={theme.colors.primary[500]} />
                  </AlertIcon>
                  <AlertDescription>
                    Payment will not be deducted until one hour before your
                    session. You will not be charged if you cancel 24 or more
                    hours before your session.
                  </AlertDescription>
                </Alert>
              </Box>
              {formik.values['paymentMethod'] ? (
                <Flex
                  marginTop="18px"
                  alignItems="center"
                  p="4"
                  boxShadow="md"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Icon
                    as={
                      formik.values['paymentMethod'].brand === 'visa'
                        ? FaCcVisa
                        : formik.values['paymentMethod'].brand === 'mastercard'
                        ? FaCcMastercard
                        : formik.values['paymentMethod'].brand === 'amex'
                        ? FaCcAmex
                        : null
                    }
                    w={8}
                    h={8}
                    color="blue.500"
                    mr="4"
                  />
                  <Box>
                    <Text fontWeight="bold">
                      Card ending in {formik.values['paymentMethod'].last4}
                    </Text>
                    <Text>
                      Expires {formik.values['paymentMethod'].expYear}
                    </Text>
                  </Box>
                </Flex>
              ) : (
                ''
              )}
              <Box marginTop={'18px'} textAlign="left">
                <Button
                  marginRight={'48px'}
                  isLoading={selectingPaymentMethod}
                  onClick={selectPaymentMethod}
                  size="md"
                >
                  Choose Payment Method
                </Button>
              </Box>
              <Box marginTop={'48px'} textAlign="right">
                <Button
                  isDisabled={Object.values(formik.errors).length !== 0}
                  size="md"
                  type="submit"
                  isLoading={formik.isSubmitting}
                >
                  {isEditing ? 'Review Offer' : 'Confirm and Send'}
                </Button>
              </Box>
            </Panel>
          </VStack>
        </Form>
      </>
    );
  };

  return (
    <Root className="container-fluid" margin="25px">
      <PaymentDialog
        ref={paymentDialogRef}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={theme.colors.primary[500]} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until one hour before your session.
              You will not be charged if you cancel 24 or more hours before your
              session.
            </AlertDescription>
          </Alert>
        }
      />
      <ChoosePaymentMethodDialog
        ref={choosePaymentDialogRef}
        onSetupNewPaymentMethod={setupPaymentMethod}
        settingUpPaymentMethod={settingUpPaymentMethod}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={theme.colors.primary[500]} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until one hour before your session.
              You will not be charged if you cancel 24 or more hours before your
              session.
            </AlertDescription>
          </Alert>
        }
      />
      <Box className="row">
        <LeftCol mb="32px" className="col-lg-8">
          {loading && (
            <Box textAlign={'center'}>
              <ShepherdSpinner />
            </Box>
          )}
          {!!tutor && (
            <Box>
              <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalBody>
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Box display={'flex'} justifyContent="center">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="20" cy="20" r="20" fill="#EDF7EE" />
                          <path
                            d="M18.0007 23.1709L27.1931 13.9785L28.6073 15.3927L18.0007 25.9993L11.6367 19.6354L13.0509 18.2212L18.0007 23.1709Z"
                            fill="#4CAF50"
                          />
                        </svg>
                      </Box>
                      <Box marginTop={3}>
                        <Text className="modal-title">
                          Offer successfully sent
                        </Text>
                        <div style={{ color: theme.colors.text[400] }}>
                          We'll notify you when {tutor.user.name.first} responds
                        </div>
                      </Box>
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button onClick={() => navigate('/dashboard')}>
                      Back to dashboard
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Breadcrumb
                spacing="8px"
                separator={<FiChevronRight size={10} color="gray.500" />}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/find-tutor">
                    Shepherds
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/dashboard/find-tutor/tutor/?id=${tutorId}`}
                  >
                    {tutor.user.name.first} {tutor.user.name.last}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#">Send Offer</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <PageTitle
                marginTop={'28px'}
                mb={10}
                title="Send an Offer"
                subtitle={`Provide your contract terms. We’ll notify you via email when ${tutor.user.name.first} responds`}
              />
              <Formik
                initialValues={
                  localStorage.getItem('tempFormValues')
                    ? convertDateStringsToDates(
                        JSON.parse(localStorage.getItem('tempFormValues'))
                      )
                    : {
                        course: '',
                        level: '',
                        days: [],
                        schedule: {},
                        note: '',
                        rate: tutor.rate,
                        expirationDate: moment().endOf('day').toDate(),
                        contractStartDate: null,
                        contractEndDate: null,
                        paymentMethod: null
                      }
                }
                validationSchema={TutorOfferSchema}
                innerRef={formikRef}
                onSubmit={async (values, { setSubmitting }) => {
                  localStorage.removeItem('tempFormValues');
                  if (isEditing) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsEditing(false);
                    setSubmitting(false);
                  } else {
                    await ApiService.createOffer({
                      ...values,
                      tutor: tutorId,
                      schedule: convertScheduleToUTC(values.schedule)
                    });
                    onSuccessModalOpen();
                    setSubmitting(false);
                  }
                }}
              >
                <MainForm />
              </Formik>
            </Box>
          )}
        </LeftCol>
        <div className="col-lg-4">
          <RightCol height="100%">
            <Panel
              p="24px"
              borderRadius={'10px'}
              position={'sticky'}
              top="90px"
            >
              <HStack>
                <BsQuestionCircleFill color="#969CA6" />
                <Text className="sub2">How this Works</Text>
              </HStack>
              <LinedList
                mt={'20px'}
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
          </RightCol>
        </div>
      </Box>
    </Root>
  );
};

export default SendTutorOffer;
