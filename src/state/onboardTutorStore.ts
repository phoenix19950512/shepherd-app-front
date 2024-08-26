import { TimestampedEntity } from '../types';
import {
  Entity,
  Schedule,
  Tutor,
  TutorBankInfo,
  TutorCourseAndLevel,
  TutorQualification,
  User
} from '../types';
import { createStore } from '@udecode/zustood';
import moment from 'moment-timezone';

type Type = Omit<Tutor, keyof Entity | keyof TimestampedEntity | 'user'> & {
  user: User;
};

export default createStore('onboardTutorStore')<Type>({
  user: {} as User,
  coursesAndLevels: [] as TutorCourseAndLevel[],
  schedule: {} as Schedule,
  tz: moment.tz.guess(),
  qualifications: [] as TutorQualification[],
  rate: 0,
  cv: '',
  bankInfo: {} as TutorBankInfo,
  avatar: '',
  isActive: false,
  reviewCount: 0,
  rating: 0,
  description: '',
  country: '',
  identityDocument: '',
  introVideo: ''
});
