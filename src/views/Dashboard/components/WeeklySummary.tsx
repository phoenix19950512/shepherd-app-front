import Badge50 from '../../../assets/badge-50.svg';
import EnergyUp from '../../../assets/energy-up.svg';
import OnFire from '../../../assets/fire.svg';
import Flash from '../../../assets/flash.svg';
import magicStar from '../../../assets/magic-star.svg';
import EmptyFeeds from '../../../assets/no-activity.svg';
import EmptyFlashcard from '../../../assets/no-flashcard.svg';
import ribbon2 from '../../../assets/ribbon1.svg';
import ribbon1 from '../../../assets/ribbon2.svg';
import Summary from '../../../assets/summary.svg';
import { CustomButton } from '../layout';
import {
  Box,
  Card,
  Flex,
  Spacer,
  Text,
  VStack,
  Grid,
  GridItem,
  Center,
  CardFooter,
  Image
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

export default function WeeklySummary(props) {
  const { data: studentReport } = props;

  // Settings for the slider
  const settings = {
    dots: false,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    centerMode: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const slides = [
    {
      img: OnFire,
      description: 'spend a little extra time learning',
      label: 'You’ve scored a total of 65% in all quizzes this week!'
    },
    {
      img: EnergyUp,
      description: 'Complete a flash deck to make it 4',
      label: 'You’re on a 3 day streak!'
    },
    {
      img: OnFire,
      description: 'spend a little extra time learning',
      label: 'You spent 5 hours learning this week'
    }
  ];

  const timeStudied = (totalWeeklyStudyTime) => {
    const [hours, minutes] = totalWeeklyStudyTime.split(':');
    return { hour: hours, minute: minutes };
  };

  const getBadgeIconByBadgeType = (badgeType) => {
    switch (badgeType) {
      case 'Created First Flashcard':
        return <EnergyUp />;
      case 'Bronze Flashcard Achievement':
        return <Badge50 />;
      case '...':
        return <OnFire />;

      default:
        return undefined;
    }
  };

  const getTextByBadgeType = (badgeType) => {
    switch (badgeType) {
      case 'Created First Flashcard':
        return 'You have just created your first flashcard';
      case 'Bronze Flashcard Achievement':
        return 'You’ve scored above 65% in all quizzes this week!';
      case 'flashcards':
        return `You created a new flashcard deck `;

      default:
        return undefined;
    }
  };
  return (
    <>
      {' '}
      <Card
        // bg={"#207DF7"}
        // bgImage={briefCase}
        // bgRepeat={"no-repeat"}
        // bgSize={"160px"}
        // bgPosition={"right -10px bottom 10px"}
        height={{ base: 'auto', md: '379px' }}
        borderRadius={{ base: '5px', md: '10px' }}
        border="1px solid #eeeff2"
        position={'relative'}
        marginBottom={{ base: '26px', md: 'none' }}
      >
        <Flex gap={1} p={3} h="60px">
          <Summary />
          <Text fontSize={'20px'} fontWeight={600}>
            Weekly Summary
          </Text>
        </Flex>
        {studentReport.studiedFlashcards > 0 ? (
          <>
            <Grid
              h={{ base: 'auto', md: 'auto' }}
              px={3}
              templateRows="repeat(1, 1fr)"
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)'
              }}
              gap={1}
            >
              <GridItem
                borderBottom={'1px solid #eeeff2'}
                position="relative"
                p={3}
              >
                <Box>
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    fontWeight={500}
                    color="text.400"
                  >
                    Cards studied
                  </Text>
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={600}>
                    {studentReport.studiedFlashcards}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: '400',
                        color: '#6e7682'
                      }}
                    >
                      {' '}
                      cards
                    </span>
                  </Text>
                </Box>
              </GridItem>

              <GridItem
                borderBottom={'1px solid #eeeff2'}
                position="relative"
                p={3}
              >
                <Box>
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    fontWeight={500}
                    color="text.400"
                  >
                    Time studied
                  </Text>
                  <Flex gap={1}>
                    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={600}>
                      {timeStudied(studentReport.totalWeeklyStudyTime).hour}
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          color: '#6e7682'
                        }}
                      >
                        {' '}
                        hrs
                      </span>
                    </Text>{' '}
                    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={600}>
                      {timeStudied(studentReport.totalWeeklyStudyTime).minute}
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: '400',
                          color: '#6e7682'
                        }}
                      >
                        {' '}
                        mins
                      </span>
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
            <Grid
              h={{ base: 'auto', md: '190px' }}
              templateRows={{
                base: 'repeat(2, 1fr)',
                md: 'repeat(1, 1fr)'
              }}
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)'
              }}
              gap={0}
            >
              <GridItem rowSpan={1} colSpan={1} p={3}>
                <Text fontSize={14} fontWeight={500} color="text.400" my={3}>
                  Flashcard performance
                </Text>
                <Flex alignItems={'center'} fontSize={12} my={2}>
                  <Box
                    boxSize="12px"
                    bg="#4caf50"
                    borderRadius={'3px'}
                    mr={2}
                  />
                  <Text color="text.300">Got it right</Text>
                  <Spacer />
                  <Text fontWeight={600}>
                    {Math.ceil(studentReport.passPercentage)}%
                  </Text>
                </Flex>
                <Flex alignItems={'center'} fontSize={12} my={2}>
                  <Box
                    boxSize="12px"
                    bg="#fb8441"
                    borderRadius={'3px'}
                    mr={2}
                  />
                  <Text color="text.300">Didn't remember</Text>
                  <Spacer />
                  <Text fontWeight={600}>{studentReport.notRemembered}%</Text>
                </Flex>
                <Flex alignItems={'center'} fontSize={12} my={2}>
                  <Box boxSize="12px" bg="red" borderRadius={'3px'} mr={2} />
                  <Text color="text.300">Got it wrong</Text>
                  <Spacer />
                  <Text fontWeight={600}>
                    {Math.floor(
                      100 -
                        studentReport.passPercentage -
                        studentReport.notRemembered
                    )}
                    %
                  </Text>
                </Flex>
              </GridItem>
              <GridItem
                rowSpan={1}
                colSpan={1}
                position="relative"
                borderLeft="1px solid #eeeff2"
              >
                <Box
                  h={'full'}
                  width={'full'}
                  position="absolute"
                  p={3}
                  bottom={2}
                >
                  {' '}
                  <Slider {...settings}>
                    {studentReport.badges.map((slide) => (
                      <div>
                        {' '}
                        <Center py={4}>
                          <VStack>
                            {getBadgeIconByBadgeType(slide.name)}
                            <Text
                              fontSize="12px"
                              fontWeight={400}
                              color="text.300"
                              textAlign="center"
                              width={'220px'}
                            >
                              {getTextByBadgeType(slide.name)}
                            </Text>
                          </VStack>

                          {/* <Text fontSize="12px" fontWeight={400}>
                {slide.description}
              </Text> */}
                        </Center>{' '}
                      </div>
                    ))}
                  </Slider>{' '}
                </Box>
              </GridItem>
            </Grid>
            <CardFooter
              bg="#f0f2f4"
              // h={"45px"}
              borderBottom="1px solid #eeeff2"
              borderBottomRadius={'10px'}
              marginTop="60px"
            >
              <Flex h="16px" alignItems={'center'} gap={1} direction="row">
                <Flash />
                <Text fontSize={14} fontWeight={400} color="text.300">
                  Current streak:
                </Text>
                <Text fontSize="14px" fontWeight="500" color="#000">
                  {studentReport.streak < 2
                    ? `${studentReport.streak} day `
                    : `${studentReport.streak} days `}
                </Text>
              </Flex>
            </CardFooter>
          </>
        ) : (
          <Box textAlign={'center'} px={20} mt={5} mb={{ base: '20px', md: 0 }}>
            <VStack spacing={5}>
              <EmptyFlashcard />
              <Text fontSize={13} fontWeight={500} color="text.400">
                Monitor your flashcard performance for the week. Start
                Practicing Today.
              </Text>
              <Link to="/dashboard/flashcards">
                <CustomButton buttonText="Create Flashcard" />
              </Link>
            </VStack>
          </Box>
        )}
      </Card>
    </>
  );
}
