import BackIcn from '../../../assets/backIcn.svg?react';
import NoTutorsIcn from '../../../assets/noTutorsIcn.svg?react';
import CustomScrollbar from '../../../components/CustomComponents/CustomScrollBar';
import ApiService from '../../../services/ApiService';
import resourceStore from '../../../state/resourceStore';
import TutorCard from '../../Dashboard/components/TutorCard';
import {
  DiscoverMore,
  PreviouslyText,
  SimpleGridContainer,
  TutorsBackIcn,
  ViewTutorSection
} from './style';
import { Box } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShepherdSpinner from '../components/shepherd-spinner';

const ViewTutors = ({
  onOpenModal,
  subjectID,
  onlineTutorsId
}: {
  onOpenModal?: () => void;
  subjectID?: string;
  onlineTutorsId?: string[];
}) => {
  const { courses: courseList, levels: levelOptions } = resourceStore();
  //   const { fetchBookmarkedTutors, tutors: allTutors } = bookmarkedTutorsStore();
  const [subject, setSubject] = useState<string>('Subject');
  const [allTutors, setAllTutors] = useState<any>([]);
  const navigate = useNavigate();
  const [tutorDetails, setTutortDetails] = useState({
    level: {
      _id: ''
    },
    tz: '',
    days: [],
    price: { value: '' },
    rating: { value: '' },
    toTime: '',
    fromTime: '',
    page: '',
    limit: ''
  });
  const [loadingData, setLoadingData] = useState(false);
  //   const doFetchBookmarkedTutors = useCallback(async () => {
  //     await fetchBookmarkedTutors();
  //     /* eslint-disable */
  //   }, []);

  //   useEffect(() => {
  //     doFetchBookmarkedTutors();
  //   }, [doFetchBookmarkedTutors]);

  const handleSelectedCourse = (selectedCourse) => {
    const selectedCourseObject = courseList.find(
      (course) => course.label === selectedCourse
    );

    if (selectedCourseObject) {
      const selectedID = selectedCourseObject._id;
      setSubject(selectedID);
    }
  };

  useEffect(() => {
    if (!subject) {
      return; // No need to proceed if subjectID is not available
    }

    const cachedTutors = allTutors.find(
      (tutor) => tutor.subject === subject.toLowerCase()
    );

    if (cachedTutors) {
      // If data is already cached, update the state and return
      setAllTutors([cachedTutors]);
      setLoadingData(false);
      return;
    }

    const formData = {
      courses: subject === 'Subject' ? '' : subject.toLowerCase(),
      levels: tutorDetails?.level?._id || '',
      availability: '',
      tz: moment.tz.guess(),
      days: tutorDetails?.days || [],
      price: tutorDetails?.price?.value || '',
      floorRating: tutorDetails?.rating?.value || '',
      startTime: tutorDetails?.fromTime || '',
      endTime: tutorDetails?.toTime || '',
      page: tutorDetails?.page || 1, // Default page value
      limit: tutorDetails?.limit || 10 // Default limit value
    };

    const getData = async () => {
      setLoadingData(true);
      try {
        const resp = await ApiService.getAllTutors(formData);
        const data = await resp.json();
        setAllTutors(data?.tutors ?? []);
      } catch (error) {
        // eslint-disable-next-line no-console
      } finally {
        setLoadingData(false);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectID, subject, tutorDetails]);

  useEffect(() => {
    setSubject(subjectID ?? '');
  }, [subjectID]);

  return (
    <ViewTutorSection>
      <TutorsBackIcn onClick={onOpenModal}>
        <BackIcn /> Back
      </TutorsBackIcn>
      <CustomScrollbar>
        <div>
          <PreviouslyText>Tutors you’ve hired previously</PreviouslyText>
        </div>
        <div>
          {loadingData ? (
            <Box
              p={5}
              textAlign="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
              }}
            >
              <ShepherdSpinner />
            </Box>
          ) : (
            <>
              {!loadingData && !allTutors?.length && (
                <div
                  style={{
                    display: 'table',
                    margin: '0 auto',
                    textAlign: 'center',
                    alignContent: 'center'
                  }}
                >
                  <NoTutorsIcn />
                  <p>You’re yet to hire a tutor</p>
                </div>
              )}

              {!loadingData && !!allTutors?.length && (
                <SimpleGridContainer columns={[2, null, 3]} spacing="20px">
                  {allTutors?.map((tutor: any) => (
                    <TutorCard
                      key={tutor?.level?._id}
                      id={tutor?.id}
                      name={`${tutor?.user?.name?.first ?? ''} ${
                        tutor?.user?.name?.last ?? ''
                      }`}
                      levelOfEducation={'BSC'}
                      avatar={tutor?.user?.avatar ?? ''}
                      rate={tutor?.rate ?? ''}
                      rating={tutor?.rating ?? ''}
                      courses={tutor?.coursesAndLevels}
                      reviewCount={tutor?.reviewCount ?? ''}
                      description={tutor?.description ?? ''}
                      handleSelectedCourse={handleSelectedCourse}
                      isViewTutors
                    />
                  ))}
                </SimpleGridContainer>
              )}
            </>
          )}
        </div>
        <div>
          <PreviouslyText>Online tutors</PreviouslyText>
        </div>
        <div>
          {loadingData ? (
            <Box
              p={5}
              textAlign="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
              }}
            >
              <ShepherdSpinner />
            </Box>
          ) : (
            <>
              {!onlineTutorsId?.length && (
                <div
                  style={{
                    display: 'table',
                    margin: '0 auto',
                    textAlign: 'center',
                    alignContent: 'center'
                  }}
                >
                  <NoTutorsIcn />
                  <p>No tutor available</p>
                </div>
              )}
              {!!onlineTutorsId?.length && (
                <SimpleGridContainer
                  columns={[2, null, 3]}
                  spacing="20px"
                  padding="0 120px"
                >
                  {allTutors?.map((tutor: any) => (
                    <TutorCard
                      key={tutor?.level?._id}
                      name={`${tutor?.user?.name?.first ?? ''} ${
                        tutor?.user?.name?.last ?? ''
                      }`}
                      levelOfEducation={'BSC'}
                      avatar={tutor?.user?.avatar ?? ''}
                      rate={tutor?.rate ?? ''}
                      rating={tutor?.rating ?? ''}
                      courses={tutor?.coursesAndLevels ?? ''}
                      reviewCount={tutor?.reviewCount ?? ''}
                      description={tutor?.description ?? ''}
                      isTutorOnline={onlineTutorsId?.includes(tutor?.id)}
                      isViewTutors
                    />
                  ))}
                </SimpleGridContainer>
              )}
            </>
          )}
        </div>
        <DiscoverMore onClick={() => navigate('/dashboard/find-tutor')}>
          {'Discover more tutors >>>'}
        </DiscoverMore>
      </CustomScrollbar>
    </ViewTutorSection>
  );
};

export default ViewTutors;
