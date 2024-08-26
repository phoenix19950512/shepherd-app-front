import { useCustomToast } from '../components/CustomComponents/CustomToast/useCustomToast';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  FormErrorMessage
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import ApiService from '../services/ApiService';

const ActivateTutorSchema = Yup.object().shape({
  tutorEmail: Yup.string().email('Invalid email').required('Required'),
  apiKey: Yup.string().required('Required')
});

const ActivateTutor: React.FC = () => {
  const toast = useCustomToast();

  return (
    <Box display="flex" justifyContent="center" mt="5%">
      <Box width="33%" p={5} boxShadow="md" borderRadius="md">
        <Heading as="h2" size="lg" textAlign="center" mb={5}>
          Activate Tutor
        </Heading>
        <Formik
          initialValues={{ tutorEmail: '', apiKey: '' }}
          validationSchema={ActivateTutorSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const response = await ApiService.activateTutor({
                apiKey: values.apiKey,
                tutorEmail: values.tutorEmail
              });
              if (response.status === 200) {
                toast({
                  title: 'Tutor activated successfully',
                  position: 'top-right',
                  status: 'success',
                  duration: 5000,
                  isClosable: true
                });

                resetForm();
              } else {
                toast({
                  title: 'Something went wrong..',
                  status: 'error',
                  position: 'top-right',
                  isClosable: true
                });
              }
            } catch (error) {
              toast({
                title: 'Failed to activate tutor',
                position: 'top-right',
                status: 'error',
                duration: 5000,
                isClosable: true
              });
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack spacing={4}>
                <Field name="tutorEmail">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.tutorEmail && form.touched.tutorEmail
                      }
                    >
                      <FormLabel htmlFor="tutorEmail">Tutor Email</FormLabel>
                      <Input
                        {...field}
                        id="tutorEmail"
                        placeholder="Tutor Email"
                      />
                      <FormErrorMessage>
                        {form.errors.tutorEmail}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="apiKey">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.apiKey && form.touched.apiKey}
                    >
                      <FormLabel htmlFor="apiKey">API Key</FormLabel>
                      <Input {...field} id="apiKey" placeholder="API Key" />
                      <FormErrorMessage>{form.errors.apiKey}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Activate Tutor
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ActivateTutor;
