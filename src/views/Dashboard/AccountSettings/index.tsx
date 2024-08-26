import PlansModal from '../../../components/PlansModal';
import { useTitle } from '../../../hooks';
import userStore from '../../../state/userStore';
import Billing from '../components/Settings/Billing';
import MyProfile from '../components/Settings/MyProfile';
import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';

function AccSettings() {
  useTitle('Account Settings');
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const { user } = userStore();

  const activatePlansModal = () => {
    setTogglePlansModal(true);
  };

  return (
    <div>
      <Box bgColor={'#FBF9FB'} pt={3} px={3}>
        <Box>
          <Text
            fontSize={{ md: 24, sm: 14 }}
            mb={{ base: 4 }}
            ml={{ base: 3 }}
            mt={{ base: 4 }}
            fontWeight={600}
            color="text.200"
          >
            Account Settings
          </Text>
        </Box>
        <Box m={{ md: 4, sm: 0 }} bgColor="#ffffff" borderRadius="16px">
          <Tabs
            sx={{
              display: { md: 'flex', sm: 'block' }
            }}
            variant="unstyled"
            orientation="vertical"
          >
            <Box
              sx={{
                borderRight: '1px solid #EEEFF2',
                width: { md: '200px', lg: '256px' },
                py: 5
              }}
            >
              <TabList
                sx={{
                  display: 'flex'
                }}
              >
                <Tab
                  _selected={{ color: '#207df7', bg: '#F0F6FE' }}
                  color="text.400"
                  my={1}
                  mx={5}
                  p="10px 18px"
                  borderRadius="8px"
                  justifyContent="left"
                >
                  <Text fontSize="14px" fontWeight="500">
                    My Profile
                  </Text>
                </Tab>
                <Tab
                  _selected={{ color: '#207df7', bg: '#F0F6FE' }}
                  color="text.400"
                  my={1}
                  mx={5}
                  p="10px 18px"
                  borderRadius="8px"
                  justifyContent="left"
                >
                  <Text fontSize="14px" fontWeight="500">
                    Billing
                  </Text>
                </Tab>
                <Button
                  _hover={{ color: '#207df7', bg: '#F0F6FE' }}
                  color="text.400"
                  bg="transparent"
                  my={1}
                  mx={5}
                  p="10px 18px"
                  borderRadius="8px"
                  justifyContent="left"
                  fontSize="14px"
                  fontWeight="500"
                  onClick={activatePlansModal}
                >
                  Upgrade Plan
                </Button>
              </TabList>
            </Box>
            <Box width={{ base: '100%' }} px={{ md: 0, lg: 6 }}>
              <TabPanels>
                <TabPanel>
                  <MyProfile
                    id={user?._id}
                    username={`${user?.name?.first} ${user?.name?.last}`}
                    email={user?.email}
                  />
                </TabPanel>
                <TabPanel>
                  <Billing
                    username={`${user?.name?.first} ${user?.name?.last}`}
                    email={user?.email}
                  />
                </TabPanel>
              </TabPanels>
            </Box>
          </Tabs>
          <PlansModal
            togglePlansModal={togglePlansModal}
            setTogglePlansModal={setTogglePlansModal}
          />
        </Box>
        {/* <Grid
          h="110vh"
          m={4}
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
          bgColor="#ffffff"
          borderRadius="16px"
        >
          <GridItem colSpan={1} borderRight="1px solid #EEEFF2">
            dfgf
          </GridItem>
          <GridItem colSpan={4} bg="papayawhip">
            dfdfdf
          </GridItem>
        </Grid> */}
      </Box>
    </div>
  );
}

export default AccSettings;
