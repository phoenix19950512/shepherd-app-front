import React from 'react';
import {
  Box,
  Card,
  CardFooter,
  Spacer,
  Grid,
  GridItem,
  Text,
  Flex,
  VStack
} from '@chakra-ui/react';
import EmptyFlashcard from '../../../../assets/no-flashcard.svg';

function Analytics(props) {
  const { studyPlanReport } = props;
  return (
    <>
      {' '}
      <Box>
        {' '}
        <Card
          // height={{ base: 'auto', md: '275px' }}
          borderRadius={{ base: '5px', md: '10px' }}
          border="1px solid #eeeff2"
          position={'relative'}
          marginBottom={{ base: '26px', md: 'none' }}
        >
          {studyPlanReport?.studiedFlashcards > 0 ? (
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
                  p={2}
                >
                  <Box>
                    <Text
                      fontSize={{ base: 'md' }}
                      fontWeight={500}
                      color="text.400"
                    >
                      Cards studied
                    </Text>
                    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={600}>
                      {studyPlanReport.studiedFlashcards}
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
                  p={2}
                >
                  <Box>
                    <Text
                      fontSize={{ base: 'md' }}
                      fontWeight={500}
                      color="text.400"
                    >
                      Time studied
                    </Text>
                    <Flex gap={1}>
                      <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight={600}
                      >
                        {studyPlanReport.flashcardStudyDuration}
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
                      <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight={600}
                      >
                        {/* {
                timeStudied(
                  studentReport.totalWeeklyStudyTime
                ).minute
              } */}
                        0
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
                // h={{ base: 'auto', md: '140px' }}
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
                  <Text
                    fontSize={14}
                    fontWeight={500}
                    color="text.400"
                    my={'auto'}
                  >
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
                    <Text
                      fontWeight={600}
                    >{`${studyPlanReport.passPercentage}%`}</Text>
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
                    <Text
                      fontWeight={600}
                    >{`${studyPlanReport.notRememberedPercentage}%`}</Text>
                  </Flex>
                  <Flex alignItems={'center'} fontSize={12} my={2}>
                    <Box boxSize="12px" bg="red" borderRadius={'3px'} mr={2} />
                    <Text color="text.300">Got it wrong</Text>
                    <Spacer />
                    <Text
                      fontWeight={600}
                    >{`${studyPlanReport.failPercentage}%`}</Text>
                  </Flex>
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={1}
                  position="relative"
                  borderLeft="1px solid #eeeff2"
                  p={3}
                >
                  <Text
                    fontSize={14}
                    fontWeight={500}
                    color="text.400"
                    my={'auto'}
                  >
                    Quiz performance
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
                    <Text
                      fontWeight={600}
                    >{`${studyPlanReport.passPercentage}%`}</Text>
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
                    <Text
                      fontWeight={600}
                    >{`${studyPlanReport.notRememberedPercentage}%`}</Text>
                  </Flex>
                  <Flex alignItems={'center'} fontSize={12} my={2}>
                    <Box boxSize="12px" bg="red" borderRadius={'3px'} mr={2} />
                    <Text color="text.300">Got it wrong</Text>
                    <Spacer />
                    <Text
                      fontWeight={600}
                    >{`${studyPlanReport.failPercentage}%`}</Text>
                  </Flex>
                </GridItem>
              </Grid>
              <CardFooter
                bg="#f0f2f4"
                // h={"45px"}
                borderBottom="1px solid #eeeff2"
                borderBottomRadius={'10px'}
              >
                {/* <Flex
          h="16px"
          alignItems={'center'}
          gap={1}
          direction="row"
        >
          <Flash />
          <Text
            fontSize={14}
            fontWeight={400}
            color="text.300"
          >
            Current study streak:
          </Text>
          <Text fontSize="14px" fontWeight="500" color="#000">
            0 day
          </Text>
        </Flex> */}
              </CardFooter>
            </>
          ) : (
            <Box textAlign={'center'} px={20} mt={5} py={25}>
              <VStack spacing={5}>
                <EmptyFlashcard />
                <Text fontSize={13} fontWeight={500} color="text.400">
                  Monitor your study plan performance for the week. Start
                  Practicing Today.
                </Text>
              </VStack>
            </Box>
          )}
        </Card>
      </Box>
    </>
  );
}

export default Analytics;
