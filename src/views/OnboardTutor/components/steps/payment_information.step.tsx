import onboardTutorStore from '../../../../state/onboardTutorStore';
import { TutorBankInfo } from '../../../../types';
import {
  Box,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea
} from '@chakra-ui/react';
import React, { useState } from 'react';

type PaymentFormData = TutorBankInfo;

const PaymentInformationForm: React.FC = () => {
  const { bankInfo } = onboardTutorStore.useStore();
  const [formData, setFormData] = useState<PaymentFormData>({
    accountName: '',
    accountNumber: '',
    bankName: ''
  });

  const setPaymentInformation = (
    f: (v: PaymentFormData) => PaymentFormData | PaymentFormData
  ) => {
    if (typeof f !== 'function' || !bankInfo) {
      onboardTutorStore.set.bankInfo?.(f as unknown as PaymentFormData);
    } else {
      onboardTutorStore.set.bankInfo?.(f(bankInfo as PaymentFormData));
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPaymentInformation((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  return (
    <Box marginTop={30}>
      <Stack spacing={5}>
        <FormControl>
          <FormLabel>Account Name</FormLabel>
          <Input
            type="text"
            name="accountName"
            value={bankInfo?.accountName}
            onChange={handleInputChange}
            placeholder="e.g Leslie Peters"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Account Number</FormLabel>
          <Input
            type="number"
            name="accountNumber"
            value={bankInfo?.accountNumber}
            onChange={handleInputChange}
            placeholder="0000000000"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bank</FormLabel>
          <Input
            type="text"
            name="bankName"
            value={bankInfo?.bankName}
            onChange={handleInputChange}
            placeholder="e.g Barclays"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Swift Code (optional)</FormLabel>
          <Input
            type="text"
            name="swiftCode"
            value={bankInfo?.swiftCode}
            onChange={handleInputChange}
            placeholder="e.g 00000"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Routing Number</FormLabel>
          <Input
            type="text"
            name="routingNumber"
            value={bankInfo?.routingNumber}
            onChange={handleInputChange}
            placeholder=""
          />
        </FormControl>
        <FormControl>
          <FormLabel>Stripe Account Id</FormLabel>
          <Input
            type="text"
            name="stripeAccountId"
            value={bankInfo?.stripeAccountId}
            onChange={handleInputChange}
            placeholder=""
          />
        </FormControl>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Textarea
            name="address"
            value={bankInfo?.address}
            onChange={(e: any) => handleInputChange(e)}
            placeholder=""
          />
          {/* <Input
            type="text"
            name="address"
            value={bankInfo?.address}
            onChange={handleInputChange}
            placeholder=""
            multiple
          /> */}
        </FormControl>
      </Stack>
    </Box>
  );
};

export default PaymentInformationForm;
