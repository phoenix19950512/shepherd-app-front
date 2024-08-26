import { Section } from '../../../components';
import BountyGridList from '../../../components/BountyGridList';
import offerStore from '../../../state/offerStore';
import { Box, Image, Text } from '@chakra-ui/react';
import React, { useState, useCallback, useEffect } from 'react';
import ShepherdSpinner from '../../Dashboard/components/shepherd-spinner';

function TutorBounties() {
  const { pagination, fetchBountyOffers, bounties } = offerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const doFetchBountyOffers = useCallback(async () => {
    await fetchBountyOffers(page, limit, 'tutor');

    setIsLoading(false);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchBountyOffers();
  }, [doFetchBountyOffers]);

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
    <>
      <Box className="p-4 bg-white">
        <Section
          title="Bounties"
          subtitle={bounties ? pagination.total : ''}
          description="Easily manage and respond to active bounty offers from potential clients"
        />

        <Box>
          {bounties && bounties.length > 0 ? (
            <>
              <BountyGridList offers={bounties} pagination={pagination} />
            </>
          ) : (
            <>
              <section className="flex justify-center items-center mt-28 w-full">
                <div className="text-center">
                  <Image src="/images/notes.png" alt="empty" m="auto" />
                  <Text textAlign={'center'}>
                    There are currently no active bounties that match your
                    profile!
                  </Text>
                </div>
              </section>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default TutorBounties;
