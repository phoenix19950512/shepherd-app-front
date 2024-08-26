import { APIGatewayProxyEvent } from 'aws-lambda';

export const MULTIPLE_CHOICE_SINGLE = 'multipleChoiceSingle';
export const MULTIPLE_CHOICE_MULTI = 'multipleChoiceMulti';
export const TRUE_FALSE = 'trueFalse';
export const OPEN_ENDED = 'openEnded';
export const MIXED = 'mixed';

export type Entity = {
  _id: string;
};

export interface TimestampedEntity extends Entity {
  createdAt: Date;
  updatedAt: Date;
}

export type Rating = 1 | 2 | 3 | 4 | 5;

type Attributes = Record<'offerId', object>;

export enum STATUS {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  CANCELED = 'cenceled',
  DRAFT = 'draft',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  WITHDRAWN = 'withdrawn'
}

export interface Level extends Entity {
  label: string;
}

export interface SkillLevel {
  course: string;
  skillLevel: string;
}

export interface TutorBankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode?: string;
  routingNumber?: string;
  address?: string;
  stripeAccountId?: string;
}

export interface TutorQualification {
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date;
  transcript?: string;
}

export interface Country {
  name: string;
}

export type TimeSchedule = {
  begin: string;
  end: string;
};

export type SingleSchedule = {
  [key: number]: TimeSchedule;
};

export type Schedule = {
  [key: number]: TimeSchedule[];
};

export type Slot = {
  begin: string;
  end: string;
};

export interface PaymentMethod extends TimestampedEntity {
  stripeId: string;
  expMonth: number;
  expYear: number;
  last4: string;
  country: string;
  brand:
    | 'amex'
    | 'diners'
    | 'discover'
    | 'eftpos_au'
    | 'jcb'
    | 'mastercard'
    | 'unionpay'
    | 'visa'
    | 'unknown';
  user: User;
}

export interface StreamToken {
  token: string;
  type: 'student' | 'tutor';
  user: User;
}

export type MinimizedStudy = {
  flashcardId: string;
  data: {
    currentStudyIndex: number;
    studyType: 'manual' | 'timed';
    isStarted: boolean;
    isFinished: boolean;
    progressWidth: string;
    studies: Study[];
    cardStyle: 'flippable' | 'default';
    timer: number;
    savedScore: Score;
    studyState: 'question' | 'answer';
  };
};

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing'
}

export enum SubscriptionTier {
  BASIC = 'Basic',
  PREMIUM = 'Premium',
  FOUNDING_MEMBER = 'Founding Member'
}
export type Prettify<T> = T extends object ? { [K in keyof T]: T[K] } : T;
export type SubscriptionMetadata = {
  flashcard_limit?: number;
  quiz_limit?: number;
  daily_question_limit?: number;
  docchat_word_limit?: number;
  file_mb_limit?: number;
};

export type Subscription = {
  user?: User;
  stripeSubscriptionId: string;
  tier?: SubscriptionTier;
  status?: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  trialEnd?: Date;
  trialStart?: Date;
  daysUntilDue?: number;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  subscriptionMetadata?: SubscriptionMetadata;
};

export type MobileSubscription = {
  user?: User;
  mobileSubscriptionId: string;
  tier?: 'Basic' | 'Premium';
  status: 'active' | 'expired' | 'cancelled';
  originalPurchaseDate?: Date;
  latestPurchaseDate?: Date;
  originalPurchaseDateMillis?: number;
  latestPurchaseDateMillis?: number;
  expirationDate?: Date;
  expirationDateMillis?: number;
  willRenew?: boolean;
  subscriptionMetadata?: SubscriptionMetadata;
  productIdentifier?: string;
  lookup_key?: string;
};

export enum UserNotificationTypes {
  LESSON_SESSION_STARTED = 'lesson_session_started',
  NEW_OFFER_RECEIVED = 'new_offer_received',
  OFFER_WITHDRAWN = 'offer_withdrawn'
}

export interface User extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  firebaseId: string;
  avatar?: string;
  dob: string;
  referralCode?: string;
  school?: any;
  tutor?: Tutor;
  student?: Student;
  isVerified: boolean;
  isTutor?: boolean;
  type: any;
  stripeCustomerId?: string;
  nylasGrantId?: string;
  signedUpAsTutor?: string;
  paymentMethods: PaymentMethod[];
  streamTokens?: StreamToken[];
  subscription?: Subscription;
  hasActiveSubscription: boolean;
  mobileSubscription?: MobileSubscription;
  isMobileSubscription: boolean | null;
  hadSubscription: boolean;
  onboardCompleted: boolean;
  userRole: 'student' | 'tutor' | 'both';
}

export interface Student extends TimestampedEntity {
  name: {
    first: string;
    last: string;
  };
  email: string;
  parentOrStudent: string;
  dob: string;
  courses: Array<Course> | Array<string>;
  gradeLevel?: string;
  somethingElse?: string;
  topic?: string;
  skillLevels?: SkillLevel[];
  schedule: Schedule;
  tz: string;
  pipedriveDealId?: string;
}

export interface Tutor extends TimestampedEntity {
  coursesAndLevels: Array<TutorCourseAndLevel>;
  schedule: Schedule;
  rate: number;
  active?: boolean;
  description?: string;
  avatar?: string;
  calendlyLink?: string;
  cv: string;
  tz: string;
  identityDocument?: string;
  introVideo?: string;
  qualifications?: Array<TutorQualification>;
  country?: string;
  bankInfo?: TutorBankInfo;
  isActive: boolean;
  pipedriveDealId?: string;

  // virtuals
  reviewCount: number;
  rating: number;
  user: User;
}

export interface Course extends Entity {
  label: string;
  imageSrc?: string;
  iconSrc?: string;
}

export interface TutorCourseAndLevel {
  course: Course;
  level: Level;
}

export interface Offer extends TimestampedEntity {
  course: Course;
  level: Level;
  schedule: SingleSchedule;
  scheduleTz: string;
  _id: string;
  rate: number;
  note: string;
  status: STATUS;
  declinedNote: string;
  tutor: Tutor;
  student: Student;
  expirationDate: Date;
  contractStartDate: Date;
  contractEndDate: Date;
  completed?: boolean;
  paymentMethod?: PaymentMethod;
  expired: boolean;
}

export type SearchQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  tags?: string;
  type?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  count: number;
};

export interface BookmarkedTutor extends TimestampedEntity {
  user: User;
  tutor: Tutor;
}

export interface Booking extends TimestampedEntity {
  stripeReference?: string;
  amountPaid?: number;
  status: STATUS;
  conferenceHostRoomUrl?: string;
  conferenceRoomUrl?: string;
  startDate: Date;
  endDate: Date;
  offer: Offer;
}

export interface UserNotifications {
  _id: string;
  text: string;
  type: UserNotificationTypes;
  createdAt?: Date;
  __v?: number;
}

export interface FirebaseUser {
  name: string;
  user_id: string;
  email: string;
  email_verified: boolean;
}

export interface HTTPEvent extends APIGatewayProxyEvent {
  firebaseUser: FirebaseUser;
  user: User;
}

export interface Score {
  score: number;
  passed: number;
  failed: number;
  notRemembered: number;
  questionsPassed?: string[];
  questionsFailed?: string[];
  questionsNotRemembered?: string[];
  date: string;
}

export interface FlashcardData {
  _id: string;
  student: Student;
  deckname: string;
  studyType: 'longTermRetention' | 'quickPractice';
  subject?: string;
  tags: string[];
  topic?: string;
  scores: Score[];
  studyPeriod:
    | 'daily'
    | 'weekly'
    | 'biweekly'
    | 'spacedRepetition'
    | 'noRepeat';
  questions: FlashcardQuestion[];
  createdAt: string;
  source: 'anki' | 'shepherd';
  updatedAt: string;
  currentStudy?: MinimizedStudy;
  studyDetails?: FlashcardStudyDetails[];
}

export interface LibraryCardData {
  _id: string;
  subject: string;
  topic: string;
  difficulty: string;
  front: string;
  back: string;
  explainer?: string;
}

export interface LibraryProviderData {
  name: string;
  _id: string;
}

export interface LibrarySubjectData {
  name: string;
  _id: string;
}

export interface LibraryTopicData {
  name: string;
  _id: string;
}

export interface LibraryDeckData {
  name: string;
  type: string;
  _id: string;
}

export interface FlashcardQuestion {
  questionType: string;
  question: string;
  options?: string[];
  helperText?: string;
  explanation?: string;
  answer: string;
  numberOfAttempts: number;
  currentStep: number;
  totalSteps: number;
}

export interface FlashcardStudyDetails {
  availableTimeStart?: string;
  availableTimeEnd?: string;
  frequencyPerWeek?: number;
  sessionDurationMinutes?: number;
  studyEndDate?: string;
}

export interface Options {
  type: 'single' | 'multiple';
  content: string[];
}

export interface Study {
  id: number;
  type: 'timed' | 'manual';
  questions: string;
  questionId?: string;
  helperText?: string;
  explanation?: string;
  answers: string | string[];
  currentStep: number;
  numberOfAttempts: number;
  isFirstAttempt: boolean;
  options?: Options;
}

export enum SessionType {
  QUIZ = 'quiz',
  FLASHCARD = 'flashcard',
  NOTES = 'notes',
  DOCCHAT = 'docchat',
  HOMEWORK = 'homework',
  LECTURES = 'lecture'
}

export interface SchedulePayload {
  entityId: string;
  entityType: string;
  startDates: string[];
  startTime: string;
  recurrence?: {
    frequency: string;
    endDate?: string;
  };
}

export interface StudentDocumentPayload {
  title?: string;
  course?: string;
  documentUrl?: string;
  tags?: string[];
  ingestId?: string;
}

export type LevelType = Level;
export type BookingType = Booking;
export type OfferType = Offer;
export type BookmarkedTutorType = BookmarkedTutor;
export type CourseType = Course;
export type UserType = User;

export interface NoteServerResponse<T = any> {
  message: string;
  error?: any;
  stack?: any;
  data?: T;
}

export type NoteUser = User;

export interface NoteDetails {
  user: NoteUser;
  topic: string;
  note: string;
  summary: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  documentId?: string;
  documentDetails: NoteDocumentDetails;
  [propName: string]: any;
}

export interface NoteDocumentDetails {
  title: string;
  id: number;
  documentId: string;
  reference: string;
  summary: any;
  documentURL?: string;
  updatedAt: Date;
  createdAt: Date;
}
export interface AllNoteDetails {
  user: NoteUser;
  topic: string;
  title?: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
  documentURL?: any;
}

export interface PinnedNoteDetails {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
}

export interface NoteFilter {
  user: NoteUser;
  topic: string;
  note: string;
  tags: Array<string>;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [propName: string]: any;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum NoteEnums {
  PINNED_NOTE_STORE_ID = 'pinned_notes'
}

export type WorkerCallback = (...args: any) => any;

export type WorkerProcess = (...args: any) => any;

export interface AIServiceResponse {
  message: string;
  data: any;
}

export enum NoteStatus {
  DRAFT = 'draft',
  SAVED = 'saved'
}

export interface NoteData {
  note?: any;
  topic?: string;
  documentId?: string;
  tags?: Array<string>;
  status?: NoteStatus;
  summary?: string;
}

export interface StudentDocument {
  title: string;
  course?: string;
  _id: string;
  documentUrl: string;
  updatedAt: string;
  createdAt: string;
  tags: string[];
  ingestId?: string;
  student: any; // Assuming this is the ObjectId of the student
}

export interface QuizQuestionOption {
  content: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  type: 'openEnded' | 'trueFalse' | 'multipleSingleChoice' | string;
  question: string;
  options?: QuizQuestionOption[];
  helperText?: string;
  explanation?: string;
  answer?: string;
  numberOfAttempts?: number;
  currentStep?: number;
  totalSteps?: number;
  id?: string | number;
  _id?: string | number;
  difficulty?:
    | 'kindergarten'
    | 'high school'
    | 'college'
    | 'PhD'
    | 'genius'
    | 'phd';
}

export interface QuizData {
  _id: string;
  student?: Student;
  title: string;
  studyType?: 'timedSession' | 'untimedSession';
  subject?: string;
  topic?: string;
  scores: Score[];
  studyPeriod?: 'daily' | 'weekly' | 'biweekly' | 'spacedRepetition';
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
  currentStudy?: MinimizedStudy;
  tags: string[];
}

export interface ConversationHistory {
  createdAt: string;
  deletedAt: string;
  id: string;
  level: string;
  reference: string;
  referenceId: string;
  subject: string;
  title: string;
  topic: string;
  updatedAt: string;
}

export type StudyPlanTopic = {
  mainTopic: string;
  subTopics: string[];
};

export type StudyPlanWeek = {
  weekNumber: number;
  dateRange: string;
  topics: StudyPlanTopic[];
};

export type SyllabusData = {
  course: string;
  gradeLevel: string;
  weekCount: number;
};

export type StudyPlanJob = {
  status: string;
  studyPlan?: StudyPlanWeek[];
  syllabusData?: SyllabusData;
};

export interface StudyPlanTopicDocumentPayload {
  studyPlanId: string;
  topicId: string;
  documentId: string;
}
