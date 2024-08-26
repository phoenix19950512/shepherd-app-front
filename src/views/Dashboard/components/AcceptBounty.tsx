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

function AcceptBounty(props) {
  const { isAcceptBountyOpen, closeAcceptBounty, bounty } = props;
  const { courses: courseList, levels: levelOptions } = resourceStore();

  const toast = useToast();
  const handleSubmitBounty = async () => {
    const obj = { action: 'accepted', bidId: `${bounty}` };
    const response = await ApiService.acceptBounty(obj);
    closeAcceptBounty();
    if (response.status === 200) {
      toast({
        render: () => (
          <CustomToast title="Bounty Offer Accepted" status="success" />
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
        isOpen={isAcceptBountyOpen}
        modalTitle="Bounty"
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
              onClick={closeAcceptBounty}
              title="Cancel"
            />
            <CustomButton2
              type="button"
              onClick={handleSubmitBounty}
              title="Accept"
            />
          </div>
        }
        onClose={closeAcceptBounty}
      >
        <VStack width="100%" p={3}>
          <Text>Do you want to accept this bounty offer?</Text>
        </VStack>
      </CustomModal>
    </>
  );
}

export default AcceptBounty;
