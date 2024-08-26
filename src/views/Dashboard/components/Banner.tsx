// Chakra imports
// Assets
import banner from '../../../assets/market-banner.png';
import { Button, Flex, Link, Text } from '@chakra-ui/react';

export default function Banner() {
  // Chakra Color Mode
  return (
    <Flex
      // direction="column"
      // bgImage={banner}
      // bgSize={'cover'} // Changed to 'cover' for better mobile display
      // bgPosition={'center'}
      // bgRepeat={'no-repeat'}
      // height="100%"
      // width="100%"
      // py={{ base: '30px', md: '56px' }}
      // px={{ base: '30px', md: '64px' }}
      // borderRadius="30px"
      direction={{ base: 'column', md: 'row' }} // Adjust direction based on screen size
      bgImage={banner}
      bgSize={{ base: 'cover', md: 'contain' }} // Ensures the background covers the box
      bgPosition="center" // Keeps the image centered
      bgRepeat="no-repeat" // Prevents the image from repeating
      height={{ base: '100%', md: '100%' }} // Adjusts height for different screen sizes
      width="100%"
      py={{ base: 4, md: 8 }} // Adjusts padding (top & bottom) responsively
      px={{ base: 4, md: 8 }} // Adjusts padding (left & right) responsively
      borderRadius="30px"
    >
      {/* <Text
        fontSize={{ base: '24px', md: '34px' }}
        color="white"
        mb="14px"
        maxW={{
          base: '100%',
          md: '64%',
          lg: '46%',
          xl: '70%',
          '2xl': '50%',
          '3xl': '42%'
        }}
        fontWeight="700"
        lineHeight={{ base: '32px', md: '42px' }}
      >
        Discover Top Tutors
      </Text>
      <Text
        fontSize="14px"
        color="#E3DAFF"
        maxWidth={{ sm: '85%', md: '55%', lg: '45%' }}
        fontWeight="500"
        mb="40px"
        lineHeight={{ sm: '20px', lg: '28px' }}
      >
        Find expert instructors to help meet your learning goals with as much
        flexibility as you need
      </Text> */}
    </Flex>
  );
}
