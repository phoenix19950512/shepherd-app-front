import { GridList, Proceed, WelcomePage } from '../../components';
import ApiService from '../../services/ApiService';
import feedsStore from '../../state/feedsStore';
import userStore from '../../state/userStore';
import ActivityFeeds from '../Dashboard/components/ActivityFeeds';
import Schedule from '../Dashboard/components/Schedule';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import React, { useState, useEffect, useCallback } from 'react';
import ShepherdSpinner from '../Dashboard/components/shepherd-spinner';

export default function Dashboard() {
  const { feeds, fetchFeeds } = feedsStore();
  const { user } = userStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [calendarEventData, setCalendarEventData] = useState<any>([]);
  const [tutorReport, setTutorReport] = useState<any>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<any>([]);

  const fetchData = useCallback(async () => {
    try {
      const [
        tutorReportResponse,
        calendarResponse,
        upcomingEventResponse,
        feedsResponse
      ] = await Promise.all([
        ApiService.getTutorReport(),
        ApiService.getCalendarEvents(),
        ApiService.getUpcomingEvent(),
        fetchFeeds()
      ]);

      const tutorReportData = await tutorReportResponse.json();
      const calendarData = await calendarResponse.json();
      const nextEvent = await upcomingEventResponse.json();

      setTutorReport(tutorReportData.data);
      setCalendarEventData(calendarData.data);
      setUpcomingEvent(nextEvent);
      // setFeeds(feedsResponse);
    } catch (error) {
      /* empty */
    } finally {
      setIsLoading(false);
    }
  }, [fetchFeeds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <Box
        p={5}
        textAlign="center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <ShepherdSpinner />
      </Box>
    );
  }
  const isEmptyObject = (obj) => {
    for (const key in obj) {
      if (obj[key].length > 0) {
        return false;
      }
    }
    return true;
  };
  return (
    <>
      <WelcomePage user={user} />
      {isEmptyObject(user.tutor.schedule) && <Proceed user={user} />}

      <GridList data={tutorReport} />
      <Box my={3} p={6}>
        <Grid
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap={6}
        >
          <GridItem colSpan={2}>
            <Box
              border="1px solid #eeeff2"
              borderRadius={'14px'}
              p={3}
              height="450px"
            >
              <ActivityFeeds feeds={feeds} userType="Tutor" />
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Box
              border="1px solid #eeeff2"
              borderRadius={'14px'}
              width="400px"
              px={3}
              py={2}
              height="450px"
            >
              {' '}
              <Schedule events={calendarEventData} />
            </Box>
          </GridItem>
        </Grid>
      </Box>
      {/* <RecentTransactions /> */}
    </>
  );
}
