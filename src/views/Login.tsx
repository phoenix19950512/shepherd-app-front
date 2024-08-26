import { useCustomToast } from '../components/CustomComponents/CustomToast/useCustomToast';
import SecureInput from '../components/SecureInput';
import {
  firebaseAuth,
  signInWithEmailAndPassword,
  googleProvider
} from '../firebase';
import { useTitle } from '../hooks';
import { useSearchParams } from 'react-router-dom';
import userStore from '../state/userStore';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast
} from '@chakra-ui/react';
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signOut,
  getAuth
} from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import ApiService from '../services/ApiService';

const Root = styled(Box)``;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('A valid email address is required'),
  password: Yup.string().required('A password is required')
});

let authBasis = 'normal';
let handleSubmitting: any;
const Login: React.FC = () => {
  useTitle('Login');
  const toast = useCustomToast();
  const navigate = useNavigate();
  const auth = getAuth();
  const [params] = useSearchParams();
  const redirectPath = params.get('redirect');
  const [isLoading, setLoading] = useState(false);
  const { user: appUser, fetchUser } = userStore();

  const signupPath = useMemo(() => {
    let path = '/signup';
    if (redirectPath) {
      path = `/signup?redirect=${redirectPath}`;
    }
    return path;
  }, [redirectPath]);

  const handleNavigation = useCallback(async () => {
    let path = '/dashboard';
    const preAuthRoute = localStorage.getItem('preAuthRoute');
    const url = window.location.href;
    const redirectIndex = url.indexOf('redirect=');
    const redirectPath =
      redirectIndex > -1
        ? url.substring(redirectIndex + 'redirect='.length)
        : null;

    sessionStorage.setItem('Just Signed in', 'true');
    if (appUser?.type.includes('tutor')) {
      const resp = await ApiService.toggleUserRole(appUser._id, 'tutor');
      path = '/dashboard/tutordashboard';
    }
    if (appUser?.signedUpAsTutor) {
      if (appUser?.tutor) {
        const resp = await ApiService.toggleUserRole(appUser._id, 'tutor');
        path = '/dashboard/tutordashboard';
      } else {
        path = '/complete_profile';
      }
    }
    if (
      (appUser?.tutor &&
        !appUser.tutor.isActive &&
        appUser?.type.includes('student')) ||
      (appUser?.type.includes('student') && !appUser.tutor)
    ) {
      const resp = await ApiService.toggleUserRole(appUser._id, 'student');
      path = '/dashboard';
    }
    if (redirectPath && !path.includes('complete')) {
      path = path + redirectPath;
    }
    if (preAuthRoute) {
      path = preAuthRoute;
      localStorage.removeItem('preAuthRoute');
    }
    window.location.href = path;
  }, [appUser, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user && !user.emailVerified) {
        signOut(auth).then(() => {
          localStorage.clear();
          navigate('/verification_pending');
        });
      }
      if (user && appUser) {
        if (authBasis === 'google') {
          const signInMethods = await fetchSignInMethodsForEmail(
            firebaseAuth,
            user.email as string
          );
          if (signInMethods.length === 0) {
            toast({
              title: "User doesn't exist, not signing in.",
              position: 'top-right',
              status: 'error',
              isClosable: true
            });
          } else {
            handleNavigation();
          }
        } else {
          handleNavigation();
        }
      }
    });

    return () => unsubscribe();
  }, [auth, appUser, navigate, handleNavigation]);

  const loginWithGoogle = useCallback(async () => {
    try {
      authBasis = 'google';
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      setLoading(true);

      await fetchUser();
      const userEmail = result?.user?.email;
      if (!userEmail) {
        toast({
          title: 'Invalid User',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: 'Invalid User',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  }, [appUser]);

  const loginWithEmail = useCallback(
    async (values, { setSubmitting }) => {
      try {
        await signInWithEmailAndPassword(
          firebaseAuth,
          values.email,
          values.password
        );
        await fetchUser();
        setLoading(true);
      } catch (e: any) {
        let errorMessage = '';
        switch (e.code) {
          case 'auth/user-not-found':
            errorMessage = 'Invalid email or password';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password';
            break;
          default:
            errorMessage = 'An unexpected error occurred';
            break;
        }

        toast({
          title: errorMessage,
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    },
    [handleNavigation, appUser, navigate, fetchUser]
  );

  return (
    <Root>
      <Box mb={'20px'}>
        <Heading mb={'12px'} as={'h3'} textAlign={'center'}>
          Welcome Back!
        </Heading>
        <Text m={0} className="body2" textAlign={'center'}>
          Sign in to your Shepherd account
        </Text>
      </Box>
      <Box>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={loginWithEmail}
        >
          {({ errors, isSubmitting, submitForm }) => (
            <Form>
              <Field name="email">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      fontSize="0.875rem"
                      fontFamily="Inter"
                      fontWeight="400"
                      size={'lg'}
                      isInvalid={form.errors.email && form.touched.email}
                      {...field}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    marginTop={'22px'}
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <SecureInput
                      fontSize="0.875rem"
                      fontFamily="Inter"
                      fontWeight="400"
                      size={'lg'}
                      isInvalid={form.errors.password && form.touched.password}
                      {...field}
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Box>
                <Link
                  color="primary.400"
                  className="body2"
                  as={RouterLink}
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </Box>
              <Box
                marginTop={'36px'}
                display={'flex'}
                flexDirection="column"
                gap={4}
                justifyContent="flex-end"
              >
                <Button
                  isDisabled={Object.values(errors).length !== 0}
                  isLoading={isSubmitting || isLoading}
                  width={'100%'}
                  size="lg"
                  onClick={() => {
                    submitForm();
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="solid"
                  bg="#F2F2F3"
                  onClick={() => loginWithGoogle()}
                  colorScheme={'primary'}
                  size={'lg'}
                  color="#000"
                  leftIcon={<img src="/images/google.svg" alt="Google icon" />}
                >
                  Continue With Google
                </Button>
                <Link
                  color="primary.400"
                  className="body2 text-center"
                  as={RouterLink}
                  to={signupPath}
                >
                  <span className="body2">Don’t have an account?</span> Sign up
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Root>
  );
};

export default Login;
