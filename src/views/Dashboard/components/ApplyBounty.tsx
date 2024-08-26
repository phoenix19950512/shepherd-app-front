import CustomButton2 from '../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import ApiService from '../../../services/ApiService';
import resourceStore from '../../../state/resourceStore';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  useToast,
  Center,
  VStack,
  HStack
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useCallback, useState, useMemo } from 'react';
import { FiChevronDown } from 'react-icons/fi';

function ApplyBounty(props) {
  const { isApplyBountyOpen, closeApplyBounty, bounty } = props;
  const { courses: courseList, levels: levelOptions } = resourceStore();

  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBounty = async () => {
    setIsSubmitting(true);

    const obj = { bountyId: bounty.id, message: `${bounty.id}` };
    const response = await ApiService.applyForBounty(obj);
    closeApplyBounty();
    setIsSubmitting(false);
    if (response.status === 200) {
      toast({
        render: () => (
          <CustomToast
            title="Your Interest in this offer has been registered Successfully"
            status="success"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        render: () => (
          <CustomToast title="Something went wrong.." status="error" />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
  };

  return (
    <>
      <CustomModal
        isOpen={isApplyBountyOpen}
        modalTitle="Apply For Bounty"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'auto'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <CustomButton2
              type="button"
              isCancel
              onClick={closeApplyBounty}
              title="Cancel"
            />
            <CustomButton2
              type="button"
              onClick={handleSubmitBounty}
              title="Apply"
              disabled={isSubmitting}
            />
          </div>
        }
        onClose={closeApplyBounty}
      >
        <VStack width="100%" p={3}>
          <Box
            boxShadow="md"
            p={4}
            borderRadius="md"
            backgroundColor="white"
            width="100%"
          >
            <Text
              textTransform="capitalize"
              fontSize={12}
              fontWeight={500}
              color="#000"
            >
              Price
            </Text>
            <Text fontSize={16} fontWeight={500} color="#207df7">
              ${bounty.reward}
            </Text>
            <Text>via {bounty.type}</Text>
          </Box>
          <HStack width="100%">
            <Box
              boxShadow="md"
              p={4}
              borderRadius="md"
              backgroundColor="white"
              width="100%"
            >
              <Text
                textTransform="capitalize"
                fontSize={12}
                fontWeight={500}
                color="#000"
              >
                Duration
              </Text>
              <Text fontSize={14} fontWeight={500}>
                30 mins
              </Text>
            </Box>
            <Box
              boxShadow="md"
              p={4}
              borderRadius="md"
              backgroundColor="white"
              width="100%"
            >
              <Text
                textTransform="capitalize"
                fontSize={12}
                fontWeight={500}
                color="#000"
              >
                Expiry Date
              </Text>
              <Text fontWeight={500}>
                {moment(bounty.expiryDate).format('MMMM DD, YYYY')}
              </Text>
            </Box>
          </HStack>
          <Box
            boxShadow="md"
            p={4}
            borderRadius="md"
            backgroundColor="white"
            width="100%"
            textAlign="left"
          >
            <Text
              textTransform="capitalize"
              fontSize={12}
              marginRight="auto"
              fontWeight={500}
              color="#000"
            >
              Description
            </Text>
            <Text fontWeight={500}>{bounty.description}</Text>
          </Box>
        </VStack>
      </CustomModal>
    </>
  );
}

export default ApplyBounty;
