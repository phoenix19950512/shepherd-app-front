import { OffersGridList, Section } from '../../../components';
import offerStore from '../../../state/offerStore';
import {
  Box,
  Image,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import ShepherdSpinner from '../../Dashboard/components/shepherd-spinner';

export default function Offers() {
  const { offers, fetchOffers, pagination } = offerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const [allOffers, setAllOffers] = useState<any>([]);
  const doFetchStudentTutors = useCallback(async () => {
    await fetchOffers(page, limit, 'tutor');
    setAllOffers(offers);
    setIsLoading(false);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchStudentTutors();
  }, [doFetchStudentTutors]);

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

  return (
    <Box className="p-4 bg-white">
      <Section
        title="Offers"
        subtitle={offers ? offers.length : 0}
        description="Easily manage and respond to offers from potential clients"
      />

      <Tabs>
        <TabList className="tab-list">
          <Tab fontSize={16} fontWeight={500} color="text.400">
            Offers
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {offers && offers.length > 0 ? (
              <OffersGridList offers={offers} pagination={pagination} />
            ) : (
              <section className="flex justify-center items-center mt-28 w-full">
                <div className="text-center">
                  <Image src="/images/notes.png" alt="empty" m="auto" />
                  <Text textAlign={'center'}>You have no offers yet.</Text>
                </div>
              </section>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
