import { useEffect, useMemo, Suspense, lazy } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import userStore from '../state/userStore';
import chameleon from '@chamaeleonidae/chmln';
import { useAuth } from '../providers/auth.provider';
import { usePostHog } from 'posthog-js/react';
import { isProduction } from '../util';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import { Navigate, Route, Routes, useRoutes } from 'react-router';
// TODO:// Add Create Password to Suspense
import CreatePassword from '../views/CreatePassword';
import ShepherdSpinner from '../views/Dashboard/components/shepherd-spinner';
import DashboardLayoutSkeleton from '../components/skeletons/dashboard-layout-skeleton';
import SharedLoading from '../components/skeletons/shared-loading';
import ChatRoom from '../views/Dashboard/home-work-help-2/_components/ai-bot-window/chat-room';
import ApiService from '../services/ApiService';
// const HomeWorkHelp = lazy(() => import('../views/Dashboard/HomeWorkHelp'));
const HomeWorkHelp = lazy(() => import('../views/Dashboard/home-work-help-2'));
const WelcomeLayout = lazy(() => import('../views/WelcomeLayout'));
const OnboardStudent = lazy(() => import('../views/OnboardStudent/index'));
const OnboardTutor = lazy(() => import('../views/OnboardTutor'));
const ForgotPassword = lazy(() => import('../views/ForgotPassword'));
const Login = lazy(() => import('../views/Login'));
const ActivateTutor = lazy(() => import('../views/ActivateTutor'));
const PendingVerification = lazy(
  () => import('../views/VerificationPages/pending_verification')
);
const VerificationSuccess = lazy(
  () => import('../views/VerificationPages/successful_verification')
);
const VerifyEmail = lazy(
  () => import('../views/VerificationPages/verify_email')
);
const CompleteProfile = lazy(
  () => import('../views/OnboardTutor/complete_profile')
);
const PendingActivation = lazy(
  () => import('../views/VerificationPages/pending_activation')
);
const Signup = lazy(() => import('../views/Signup'));
const Home = lazy(() => import('../views/Home'));
const Feedback = lazy(() => import('../views/Feedback'));
const Session = lazy(() => import('../views/Session'));
const DashboardLayout = lazy(() => import('../views/Dashboard/layout'));
const DocChat = lazy(() => import('../views/Dashboard/DocChat'));
const TakeQuizzes = lazy(() => import('../views/Dashboard/Quizzes/take'));
const Tutor = lazy(() => import('../views/Dashboard/Tutor'));
const TutorDashboardLayout = lazy(() => import('../components/Layout'));

const TutorDashboard = lazy(() => import('../views/TutorDashboard/index'));
const Clients = lazy(() => import('../views/TutorDashboard/Clients'));
const Courses = lazy(() => import('../views/TutorDashboard/Courses/index'));
const Performance = lazy(
  () => import('../views/TutorDashboard/Clients/performance')
);
const Client = lazy(() => import('../views/TutorDashboard/Clients/client'));
const TutorOffers = lazy(() => import('../views/TutorDashboard/Offers/index'));
const TutorBounties = lazy(
  () => import('../views/TutorDashboard/Bounties/index')
);
const TutorSettings = lazy(
  () => import('../views/TutorDashboard/AccountSettings')
);
const NewNote = lazy(() => import('../views/Dashboard/Notes/NewNotes'));
const FlashCard = lazy(() => import('../views/Dashboard/FlashCards'));

const Notes = lazy(() => import('../views/Dashboard/Notes/index'));
const PinnedNotes = lazy(
  () => import('../views/Dashboard/Notes/PinnedNotes/PinnedNotes')
);
const SendTutorOffer = lazy(() => import('../views/Dashboard/SendTutorOffer'));
const Offer = lazy(() => import('../views/Dashboard/Offer'));
const DashboardIndex = lazy(() => import('../views/Dashboard/index'));
const Marketplace = lazy(() => import('../views/Dashboard/Marketplace'));
const MyTutors = lazy(() => import('../views/Dashboard/MyTutors'));
const Bounties = lazy(() => import('../views/Dashboard/Bounties/index'));
const StudentBounty = lazy(() => import('../views/Dashboard/Bounties/Bounty'));
const BookmarkedTutors = lazy(
  () => import('../views/Dashboard/BookmarkedTutors')
);
const Messaging = lazy(() => import('../views/Dashboard/Messaging'));
const StudentSettings = lazy(
  () => import('../views/Dashboard/AccountSettings')
);
const CreateFlashCard = lazy(
  () => import('../views/Dashboard/FlashCards/create')
);
const EditFlashCard = lazy(() => import('../views/Dashboard/FlashCards/edit'));
const Library = lazy(() => import('../views/Dashboard/Library'));
const CreateStudyPlans = lazy(
  () => import('../views/Dashboard/StudyPlans/create')
);
const StudyPlans = lazy(() => import('../views/Dashboard/StudyPlans'));
const CoursePlan = lazy(
  () => import('../views/Dashboard/StudyPlans/coursePlan')
);
const Quizzes = lazy(() => import('../views/Dashboard/Quizzes'));
const CreateQuizzes = lazy(() => import('../views/Dashboard/Quizzes/create'));

const studentRoutes = [
  { path: 'notes/new-note', element: <NewNote /> },
  // { path: 'new-note', element: <TestNewNote /> },
  // { path: 'notes/new-note/:id', element: <NewNote /> },
  { path: 'notes', element: <Notes /> },
  { path: 'pinned', element: <PinnedNotes /> },
  { path: 'tutor/:tutorId/offer', element: <SendTutorOffer /> },
  { path: 'offer/:offerId', element: <Offer /> },
  { path: '', element: <DashboardIndex /> },
  // { path: 'docchat', element: <DocChat /> },
  { path: 'find-tutor', element: <Marketplace /> },
  { path: 'find-tutor/:subjectId', element: <Marketplace /> },
  // { path: 'find-tutor/tutor/', element: <Tutor /> },
  { path: 'my-tutors', element: <MyTutors /> },
  { path: 'bounties', element: <Bounties /> },
  { path: 'bounties/:bountyId', element: <StudentBounty /> },
  { path: 'saved-tutors', element: <BookmarkedTutors /> },
  { path: 'messaging', element: <Messaging /> },
  { path: 'account-settings', element: <StudentSettings /> },
  // { path: 'ace-homework/:id', element: <HomeWorkHelp /> },
  // { path: 'ace-homework', element: <HomeWorkHelp /> },
  { path: 'flashcards/create', element: <CreateFlashCard /> },
  { path: 'flashcards', element: <FlashCard /> },
  // { path: 'flashcards/:flashcardId', element: <FlashCard /> },
  { path: 'flashcards/:id/edit', element: <EditFlashCard /> },
  { path: 'library', element: <Library /> },
  { path: 'create-study-plans', element: <CreateStudyPlans /> },
  { path: 'school-courses', element: <Courses /> },

  { path: 'study-plans', element: <StudyPlans /> },
  { path: 'study-plans/:planId', element: <CoursePlan /> },
  { path: 'library/providers/:providerId', element: <Library /> },
  { path: 'library/subjects/:subjectId', element: <Library /> },
  { path: 'library/topics/:topicId', element: <Library /> },
  { path: 'library/decks/:deckId', element: <Library /> },
  // quizzes
  { path: 'quizzes', element: <Quizzes /> },
  { path: 'quizzes/create', element: <CreateQuizzes /> }
  // { path: 'quizzes/take', element: <TakeQuizzes /> }
];

const shareableRoutes = [
  {
    path: 'ace-homework/:id',
    element: <HomeWorkHelp />
  },
  { path: 'study-plans/:planId', element: <CoursePlan /> }
];

const tutorRoutes = [
  { path: 'tutordashboard', element: <TutorDashboard /> },
  { path: 'tutordashboard/clients', element: <Clients /> },
  {
    path: 'tutordashboard/clients/performance/:clientId',
    element: <Performance />
  },
  { path: 'tutordashboard/clients/:clientId', element: <Client /> },
  { path: 'tutordashboard/school-courses', element: <Courses /> },

  { path: 'tutordashboard/offers', element: <TutorOffers /> },
  { path: 'tutordashboard/offer/:offerId', element: <Offer /> },
  { path: 'tutordashboard/bounties', element: <TutorBounties /> },
  { path: 'tutordashboard/bounties/:bidId', element: <TutorBounties /> },
  { path: 'tutordashboard/account-settings', element: <TutorSettings /> },
  { path: 'tutordashboard/messages', element: <Messaging /> },
  { path: 'tutordashboard/create-study-plans', element: <CreateStudyPlans /> },
  { path: 'tutordashboard/study-plans', element: <StudyPlans /> },
  { path: 'tutordashboard/study-plans/:planId', element: <CoursePlan /> },
  // { path: 'tutordashboard/flashcards/create', element: <CreateFlashCard /> },
  { path: 'tutordashboard/flashcards/:id/edit', element: <EditFlashCard /> },
  { path: 'tutordashboard/quizzes/create', element: <CreateQuizzes /> }
];

const userLayouts = {
  student: <DashboardLayout children />,
  tutor: <TutorDashboardLayout children className />
};

const RenderLayout = () => {
  const matchedRoute = useRoutes(userRoutes.both);

  const isStudentRoute = [
    { path: 'ace-homework/:id', element: <HomeWorkHelp /> },
    { path: 'ace-homework', element: <HomeWorkHelp /> },
    ...studentRoutes
  ].some((route) => route.path === matchedRoute?.props?.match?.route?.path);
  const isTutorRoute = tutorRoutes.some(
    (route) => route.path === matchedRoute?.props?.match?.route?.path
  );

  if (isStudentRoute) {
    return userLayouts.student;
  } else if (isTutorRoute) {
    return userLayouts.tutor;
  } else {
    return <Navigate to="/404" />;
  }
};

const AuthAction = (props) => {
  const [params] = useSearchParams();
  const mode = params.get('mode')?.toLowerCase();
  const fld: any = params.get('fId')?.toLowerCase();
  const type: any = params.get('type')?.toLowerCase();
  const inviteCode: any = params.get('inviteCode')?.toLowerCase();
  const navigate = useNavigate();

  if (mode === 'resetpassword') {
    return <CreatePassword {...props} />;
  }
  if (fld && type && inviteCode) {
    return <CreatePassword {...props} />;
  }

  return null;
};

const userRoutes = {
  student: studentRoutes,
  tutor: tutorRoutes,
  shareable: shareableRoutes,
  both: [
    ...[
      { path: 'ace-homework/:id', element: <HomeWorkHelp /> },
      { path: 'ace-homework', element: <HomeWorkHelp /> },
      ...studentRoutes
    ],
    ...tutorRoutes
  ]
};

const RequireAuth = ({
  authenticated,
  unAuthenticated
}: {
  authenticated: any;
  unAuthenticated: any;
}) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isShareable = params.get('shareable');
  const apiKey = params.get('apiKey');

  const allowTempAccess = Boolean(isShareable && apiKey);

  const {
    state: { isAuthenticated, loading, user }
  } = useAuth();

  if (loading) {
    return (
      <Box p={5} textAlign="center">
        <SharedLoading />
      </Box>
    );
  }

  if (isAuthenticated && !allowTempAccess && !user?.isVerified) {
    navigate('/verification_pending');
  }
  return isAuthenticated || allowTempAccess
    ? authenticated
    : (localStorage.setItem('preAuthRoute', window.location.href),
      unAuthenticated);
};

const NotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="text-center">
        <p className="text-xl text-muted-foreground">Page Not Found</p>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const { fetchNotifications, fetchUserDocuments } = userStore();
  /* chameleon.io NPM script */

  chameleon.init(
    'S9mtu3rwhjnyCB5YCEJ8wL946DrhUsVByQcsQKo6tTAWqP-1QmYSE-ExIRqucDjaOrhGTJ',
    { fastUrl: 'https://fast.chameleon.io/' }
  );

  const {
    state: { user: userData, loading, isAuthenticated }
  } = useAuth();

  const userType = useMemo(() => {
    return userData?.userRole;
  }, [userData]);

  let userRoute = userRoutes[userType] || [];
  if (params.get('shareable')) {
    userRoute = [...userRoutes.shareable, ...userRoute];
  }
  const posthog = usePostHog();

  const RedirectToExternal = ({ url }) => {
    useEffect(() => {
      window.location.href = url;
    }, [url]);

    return null; // render nothing
  };

  useEffect(() => {
    if (isAuthenticated) {
      // fetchNotifications();
      if (userData) {
        chameleon.identify(userData?._id, {
          // REQUIRED, the unique ID of each user in your database (e.g. 23443 or "690b80e5f433ea81b96c9bf6")
          email: userData?.email, // RECOMMENDED, email is used as the key to map user data for integrations
          name: `${userData?.name.first} ${userData?.name.last}` // RECOMMENDED, name can be used to greet and/or personalize content: ;
        });

        if (isProduction) {
          posthog.identify(userData?._id, {
            email: userData?.email,
            name: `${userData?.name.first} ${userData?.name.last}`
          });
        }
      }
      userData && fetchUserDocuments(userData._id);
    }
    /* eslint-disable */
  }, [isAuthenticated, posthog]);

  // if (true) {
  //   return <DashboardLayoutSkeleton />;
  // }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <div className="spinner">
          <ShepherdSpinner />
        </div>
        <div className="text-center">
          <p className="text-xl text-muted-foreground">
            Welcome to Shepherd. <br />
            Please wait while we load your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path=""
        element={
          <RequireAuth
            authenticated={<Navigate to={'/dashboard'} />}
            unAuthenticated={
              <RedirectToExternal url="/dashboard" />
            }
          />
        }
      />
      <Route
        element={
          <Suspense fallback={<SharedLoading />}>
            <WelcomeLayout />
          </Suspense>
          // <RequireAuth
          //   authenticated={<Navigate to={'/dashboard'} />}
          //   unAuthenticated={<WelcomeLayout />}
          // />
        }
      >
        <Route path="onboard">
          <Route
            path="student"
            element={
              <Suspense fallback={<SharedLoading />}>
                <OnboardStudent />
              </Suspense>
            }
          />
          <Route
            path="tutor"
            element={
              <Suspense fallback={<SharedLoading />}>
                <OnboardTutor />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="student" />} />
          <Route path="" element={<Navigate to="student" />} />
        </Route>

        <Route
          path="login"
          element={
            <Suspense fallback={<SharedLoading />}>
              <Login />
            </Suspense>
            // <RequireAuth
            //   authenticated={<Navigate to={'/dashboard'} />}
            //   unAuthenticated={<Login />}
            // />
          }
        />

        <Route
          path="signup"
          element={
            <Suspense fallback={<SharedLoading />}>
              <RequireAuth
                authenticated={<Navigate to={'/dashboard'} />}
                unAuthenticated={<OnboardStudent />}
              />
            </Suspense>
          }
        />
        <Route
          path="forgot-password"
          element={
            <Suspense fallback={<SharedLoading />}>
              <RequireAuth
                authenticated={<Navigate to={'/dashboard'} />}
                unAuthenticated={<ForgotPassword />}
              />
            </Suspense>
          }
        />
        <Route path="auth-action" element={<AuthAction />} />
      </Route>

      <Route
        path="verification_pending"
        element={
          <Suspense fallback={<SharedLoading />}>
            <PendingVerification />
          </Suspense>
        }
      />
      <Route
        path="verification_success"
        element={
          <Suspense fallback={<SharedLoading />}>
            <VerificationSuccess />
          </Suspense>
        }
      />

      <Route
        path="complete_profile"
        element={
          <Suspense fallback={<SharedLoading />}>
            <CompleteProfile />
          </Suspense>
        }
      />
      <Route
        path="verify_email"
        element={
          <Suspense fallback={<SharedLoading />}>
            <VerifyEmail />
          </Suspense>
        }
      />
      <Route
        path="activation_pending"
        element={
          <Suspense fallback={<SharedLoading />}>
            <PendingActivation />
          </Suspense>
        }
      />

      <Route
        path="activate_tutor"
        element={
          <Suspense fallback={<SharedLoading />}>
            <ActivateTutor />
          </Suspense>
        }
      />

      <Route
        path="signup"
        element={
          <Suspense fallback={<SharedLoading />}>
            <RequireAuth
              authenticated={<Navigate to={'/dashboard'} />}
              unAuthenticated={<Signup />}
            />
          </Suspense>
        }
      />
      <Route
        path="forgot-password"
        element={
          <Suspense fallback={<SharedLoading />}>
            <RequireAuth
              authenticated={<Navigate to={'/dashboard'} />}
              unAuthenticated={<ForgotPassword />}
            />
          </Suspense>
        }
      />
      <Route path="auth-action" element={<AuthAction />} />

      <Route
        path="home"
        element={
          <Suspense fallback={<SharedLoading />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="feedback"
        element={
          <Suspense fallback={<SharedLoading />}>
            <Feedback />
          </Suspense>
        }
      />
      <Route
        path="session/:bookingId"
        element={
          <Suspense fallback={<SharedLoading />}>
            <RequireAuth
              authenticated={<Session />}
              unAuthenticated={<Navigate to={'/login'} />}
            />
          </Suspense>
        }
      />	  
      <Route
        path="/dashboard/notes"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <Notes />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      />
      <Route
        path="/dashboard/notes/new-note"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <NewNote />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      />
      <Route
        path="/dashboard/notes/new-note/:id"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <NewNote />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      />
      <Route
        path="/dashboard/flashcards/:flashcardId"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <FlashCard />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      />
      <Route
        path="/dashboard/docchat"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <DocChat />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      />
      <Route path="/" element={<DashboardLayout children />}>
        <Route
          path="/dashboard/ace-homework"
          element={
            <Suspense fallback={<SharedLoading />}>
              <HomeWorkHelp />
            </Suspense>
          }
        >
          <Route path=":id" element={<ChatRoom />} />
        </Route>
      </Route>
      {/* <Route
        path="/dashboard/ace-homework/:id"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <HomeWorkHelp />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      /> */}
      <Route
        path="/dashboard/quizzes/take"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <TakeQuizzes />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      />
      <Route
        path="/dashboard/find-tutor/tutor/"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <DashboardLayout>
              <Suspense fallback={<SharedLoading />}>
                <Tutor />
              </Suspense>
            </DashboardLayout>
          </Suspense>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<DashboardLayoutSkeleton />}>
            <RequireAuth
              authenticated={<RenderLayout />}
              unAuthenticated={<Navigate to={'/login'} />}
            />
          </Suspense>
        }
      >
        {userRoute &&
          userRoute.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<SharedLoading />}>
                  {route.element}
                </Suspense>
              }
            />
          ))}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to={'/login'} />} />
        )}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
