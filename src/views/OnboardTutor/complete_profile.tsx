import Header from '../../components/Header';
import onboardTutorStore from '../../state/onboardTutorStore';
import resourceStore from '../../state/resourceStore';
import { Schedule } from '../../types';
import StepsLayout from './components/StepsLayout';
import SubjectLevelForm from './components/steps/add_subjects';
import AvailabilityForm from './components/steps/availabilty.steps';
import BioForm from './components/steps/bio.step';
import HourlyRateForm from './components/steps/hourly_rate.step';
import IntroVideoForm from './components/steps/intro_video.step';
import PaymentInformationForm from './components/steps/payment_information.step';
import ProfilePictureForm from './components/steps/profile_picture.step';
import QualificationsForm from './components/steps/qualifications.step';
import PreviewProfile from './preview_profile';
import { Box } from '@chakra-ui/react';
import { isBefore } from 'date-fns';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

const Root = styled(Box)`
  display: flex;
  background: #fffff;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  width: 100%;
`;

const MainWrapper = styled(Box)`
  background: #ffffff;
  min-width: 100vw;
  min-height: 100vh;
`;

type Step = {
  id: string;
  position: number;
  title: string;
  supportingText: string;
  element: React.FC;
  isValid?: boolean;
};

const CompleteProfile = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const onboardingData = onboardTutorStore.useStore();

  const { schedule, tz: timezone } = onboardingData;
  const isSubjectsValid = useMemo(() => {
    let isValid = false;

    if (onboardingData?.coursesAndLevels?.length > 0) {
      isValid = onboardingData?.coursesAndLevels.every(
        (obj) => Object.keys(obj.course).length && Object.keys(obj.level).length
      );
    }

    return isValid;
  }, [onboardingData]);

  const isQualificationsValid = useMemo(() => {
    const { qualifications } = onboardingData;
    if (!qualifications) return false;
    const isValid =
      qualifications.length > 0
        ? onboardingData?.qualifications?.every((obj) => {
            const newData = { ...obj };
            // delete newData.transcript;
            return (
              Object.values(newData).every((value) => Boolean(value)) &&
              isBefore(new Date(newData.startDate), new Date(newData.endDate))
            );
          })
        : false;

    return isValid;
  }, [onboardingData]);

  const isScheduleValid = useMemo(() => {
    if (!schedule || !timezone || !Object.keys(schedule).length) {
      return false;
    }

    let hasNonEmptyBlock = false; // Flag to check for at least one non-empty block

    for (const key in schedule) {
      if (!Array.isArray(schedule[key])) {
        return false;
      }

      if (schedule[key].length > 0) {
        hasNonEmptyBlock = true; // Update flag if the array has non-empty blocks

        for (let i = 0; i < schedule[key].length; i++) {
          if (
            !schedule[key][i].begin ||
            !schedule[key][i].end ||
            schedule[key][i].begin.trim() === '' ||
            schedule[key][i].end.trim() === ''
          ) {
            return false;
          }
        }
      }
    }

    return hasNonEmptyBlock; // Return whether at least one non-empty block exists
  }, [schedule, timezone]);

  const isValidPaymentInformation = useMemo(() => {
    const { bankInfo } = onboardingData;
    if (!bankInfo) return false;
    const bankInfoClone = { ...bankInfo };
    delete bankInfoClone.swiftCode;
    const isValid = Object.keys(bankInfo).every((info) => Boolean(info));
    return isValid;
  }, [onboardingData]);

  const steps: Step[] = useMemo(() => {
    return [
      {
        id: 'subjects',
        position: 0,
        element: SubjectLevelForm,
        title: 'Please inform us of the subjects you would like to teach ',
        supportingText:
          'Please choose your areas of expertise and indicate your proficiency level. You can select multiple subjects.',
        isValid: isSubjectsValid
      },
      {
        id: 'qualifications',
        position: 1,
        element: QualificationsForm,
        title:
          'Add your professional qualifications relevant to the subjects you selected',
        supportingText:
          'Provide relevant educational background, certifications and experiences',
        isValid: isQualificationsValid
      },
      {
        id: 'bio',
        position: 2,
        element: BioForm,
        isValid: Boolean(onboardingData.description),
        title: 'Write a bio to let your potential students know about you',
        supportingText:
          'Help potential students make an informed decision by showcasing your personality and teaching style.'
      },
      {
        id: 'availability',
        position: 3,
        isValid: isScheduleValid,
        element: AvailabilityForm,
        title: 'Let us Know when you’ll be available',
        supportingText:
          'Provide the days and time frame when will you be available'
      },
      {
        id: 'intro_video',
        position: 4,
        element: IntroVideoForm,
        title:
          'Upload an intro video to show your proficiency in your chosen subjects (optional)',
        supportingText:
          'Be as detailed as possible, this lets your potential student know you are capable '
      },
      {
        id: 'hourly_rate',
        position: 5,
        element: HourlyRateForm,
        title: 'Set your hourly rate',
        supportingText:
          'Your clients will send you offers based on this rate. You can always adjust your rate',
        isValid: Boolean(onboardingData.rate)
      },
      {
        id: 'upload_profile_picture',
        position: 6,
        element: ProfilePictureForm,
        title: 'Add a profile picture',
        supportingText:
          'Ensure this is a clear and actual picture of you, your picture helps your clients trust you',
        isValid: Boolean(onboardingData.avatar)
      },
      {
        id: 'payment',
        position: 7,
        element: PaymentInformationForm,
        title: 'Provide your account details',
        supportingText:
          'Shepherd uses your account details to remit payment from clients to you ',
        isValid: isValidPaymentInformation
      }
    ];
  }, [
    onboardingData,
    isQualificationsValid,
    isSubjectsValid,
    isValidPaymentInformation,
    isScheduleValid
  ]);

  const currentStep = useMemo(
    () => steps.find((step) => step.position === activeStep),
    [activeStep, steps]
  );

  const goToPreviousStep = () => {
    if (activeStep === 0) return;
    setActiveStep((prev) => prev - 1);
  };

  const goToNextStep = () => {
    if (steps.length === activeStep + 1) {
      setShowPreview(true);
    }
    setActiveStep((prev) => prev + 1);
  };

  const nextStep = useMemo(() => {
    if (activeStep === steps.length) return {} as Step;
    return steps.find((step) => step.position === activeStep + 1);
  }, [activeStep, steps]);

  if (showPreview) return <PreviewProfile />;
  if (!currentStep) return <></>;

  const { element: Element } = currentStep;
  return (
    <MainWrapper>
      <Header />
      <Root>
        <StepsLayout
          currentStep={currentStep.position + 1}
          nextStep={nextStep?.id || 'Preview'}
          onNextClick={() => goToNextStep()}
          onBackClick={() => goToPreviousStep()}
          stepText="Create your profile"
          totalSteps={steps.length}
          isValid={
            typeof currentStep.isValid === 'undefined'
              ? true
              : currentStep.isValid
          }
          supportingText={currentStep.supportingText}
          mainText={currentStep?.title}
        >
          <Element />
        </StepsLayout>
      </Root>
    </MainWrapper>
  );
};
export default CompleteProfile;
