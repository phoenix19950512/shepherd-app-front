import { json } from 'stream/consumers';
import { REACT_APP_API_ENDPOINT } from '../config';
import { AI_API, HEADER_KEY } from '../config';
import { firebaseAuth } from '../firebase';
import { languages } from '../helpers';
import { objectToQueryString } from '../helpers/http.helpers';
import {
  User,
  StudentDocumentPayload,
  QuizData,
  QuizQuestion,
  FlashcardData,
  StudyPlanTopicDocumentPayload
} from '../types';
import { doFetch } from '../util';
import { ChatMessage } from '../views/Dashboard/home-work-help-2/_components/ai-bot-window/hooks/useChatManager';
import {
  processDocument,
  createDocchatFlashCards,
  chatHomeworkHelp,
  chatHistory,
  getConversionById,
  getConversionByIdAndAPIKey
} from './AI';

// Suppose these functions are in 'apiFunctions.ts' file

class ApiService {
  static baseEndpoint = REACT_APP_API_ENDPOINT;
  static baseAiEndpoint = AI_API;

  static processDocument = processDocument;
  static createDocchatFlashCards = createDocchatFlashCards;
  static chatHomeworkHelp = chatHomeworkHelp;
  static chatHistory = chatHistory;
  static getConversionById = getConversionById;
  static getConversationByIdAndAPIKey = getConversionByIdAndAPIKey;

  static getResources = async () => {
    return doFetch(`${ApiService.baseEndpoint}/resources`);
  };

  static getCountries = async () => {
    return doFetch('https://restcountries.com/v3.1/all');
  };

  static getUser = async () => {
    return doFetch(`${ApiService.baseEndpoint}/me`);
  };

  static toggleUserRole = async (id: string, userRole: string | null) => {
    return doFetch(`${ApiService.baseEndpoint}/toggleUserRoleHandler`, {
      method: 'POST',
      body: JSON.stringify({ userId: id, role: userRole })
    });
  };

  static generateShareLink = async (body: {
    apiKey?: string;
    shareType?: any;
    forwardList?: { apiKey: string; userId: string; shareLink: string }[];
    permissionBasis?: any;
  }) => {
    return doFetch(`${ApiService.baseEndpoint}/generateShareLink`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  };

  static editFlashcard = async (id: string, data: Partial<FlashcardData>) => {
    return doFetch(`${ApiService.baseEndpoint}/editFlashcard?id=${id}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static createUser = async (data: Partial<User>) => {
    return doFetch(`${ApiService.baseEndpoint}/createUser`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static deleteAccount = async (id: string) => {
    return await doFetch(
      `${ApiService.baseEndpoint}/deleteAccount?userId=${id}`,
      {
        method: 'POST'
      }
    );
  };

  static getStudyPlanCourses = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getStudyPlanCourses`);
  };

  static resendUserEmail = async (data: any) => {
    const payload = { email: data };
    return doFetch(`${ApiService.baseEndpoint}/resendUserEmail`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  };

  static storeFlashcardTags = (
    flashcardIds: string[] | string,
    tags: string[]
  ) => {
    return doFetch(`${ApiService.baseEndpoint}/storeFlashcardTags`, {
      method: 'POST',
      body: JSON.stringify({ flashcardIds, tags })
    });
  };

  static scheduleStudyEvent = async (data: any) => {
    const requestPayload = {
      ...data,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    return doFetch(`${ApiService.baseEndpoint}/scheduleStudyEvent`, {
      method: 'POST',
      body: JSON.stringify(requestPayload)
    });
  };

  static scheduleImageOcclusionStudyEvent = async (data: any) => {
    const requestPayload = {
      ...data,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    return doFetch(`${ApiService.baseEndpoint}/scheduleStudyEvent`, {
      method: 'POST',
      body: JSON.stringify(requestPayload)
    });
  };

  static createMathConversation = async (b: {
    subject: string;
    topic: string;
    level: string;
    language: (typeof languages)[number];
    referenceId: string;
  }) => {
    const body = JSON.stringify(b);
    return fetch(`${process.env.REACT_APP_AI_II}/conversations/`, {
      method: 'POST',
      body,
      headers: {
        'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then((resp) => resp.json())
      .then((r: { data: string }) => r);
  };

  static createConvoLog = async (b: {
    query: string;
    conversationId: string;
    studentId: string;
  }) => {
    const body = JSON.stringify(b);
    return fetch(
      `${process.env.REACT_APP_AI_II}/conversations/conversation-log/`,
      {
        method: 'POST',
        body,
        headers: {
          'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
      .then((resp) => resp.json())
      .then((r: { data: ChatMessage }) => r);
  };

  static rescheduleStudyEvent = async (data: any) => {
    if (data.updates) {
      data.updates.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return doFetch(`${ApiService.baseEndpoint}/updateStudyEvent`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static reScheduleBooking = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateBooking`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static cancelBooking = async (queryParams: { id: string }) => {
    const queryString = objectToQueryString(queryParams);
    return doFetch(`${ApiService.baseEndpoint}/cancelBooking?${queryString}`, {
      method: 'POST'
    });
  };

  static submitStudent = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createStudent`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static nylasAuth = async () => {
    return doFetch(`${ApiService.baseEndpoint}/nylasAuth`, {
      method: 'POST'
    });
  };

  static getMnemonics = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/getMnemonics`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getLibraryProviders = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/getLibraryProviders`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getLibrarySubjects = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/getLibrarySubjects`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getLibraryTopics = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/getLibraryTopicsBySubject`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getLibraryDecks = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/getLibraryDecks`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getLibraryCards = async (data: any) => {
    const queryString = objectToQueryString({
      page: data.page,
      limit: data.limit
    });
    return doFetch(
      `${ApiService.baseEndpoint}/getLibraryCardsByDeck?${queryString}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static createMnemonic = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createMneomics`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static updateQuestionAttempt = async (data: any) => {
    return doFetch(
      `${ApiService.baseEndpoint}/updateFlashcardQuestionAttempt`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static storeFlashcardScore = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/storeScore`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static saveStudentDocument = async (data: StudentDocumentPayload) => {
    return doFetch(`${ApiService.baseEndpoint}/createStudentDocument`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getFlashcards = async (queryParams: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const queryString = objectToQueryString(queryParams);
    return doFetch(
      `${ApiService.baseEndpoint}/getStudentFlashcards?${queryString}`
    );
  };

  static getTodaysFlashcards = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getDailyFlashcards`);
  };

  static deleteFlashcard = async (id: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/deleteFlashcard?id=${id}`, {
      method: 'POST'
    });
  };

  static deleteStudentDocument = async (id: string | number) => {
    return doFetch(
      `${ApiService.baseEndpoint}/deleteStudentDocument?id=${id}`,
      {
        method: 'POST'
      }
    );
  };

  static updateStudentDocument = async (
    id: string | number,
    updates: Partial<StudentDocumentPayload>
  ) => {
    return doFetch(`${ApiService.baseEndpoint}/updateStudentDocument`, {
      method: 'POST',
      body: JSON.stringify({ documentId: id, updates })
    });
  };

  static uploadFileToS3 = async (fileUrl: string) => {
    return doFetch(`${ApiService.baseEndpoint}/uploadFileToS3`, {
      method: 'POST',
      body: JSON.stringify({ fileUrl })
    });
  };

  static getOcclusionImageText = async (imageUri: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getOcclusionImageText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUri })
    });
  };

  static createFlashcard = async (
    data: any,
    generatorType = 'manual',
    id: string = null
  ) => {
    if (!id) {
      return doFetch(
        `${ApiService.baseEndpoint}/createFlashcard?generatorType=${generatorType}`,
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );
    } else {
      return doFetch(
        `${ApiService.baseEndpoint}/createFlashcard?generatorType=${generatorType}&fid=${id}`,
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );
    }
  };

  static createOcclusionCard = async (data: any) => {
    // return doFetch(`${ApiService.baseEndpoint}/createOcclusionCard`, {
    return doFetch(`${ApiService.baseEndpoint}/createOcclusionCard`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getOcclusionCard = async (id: string) => {
    // return doFetch(`${ApiService.baseEndpoint}/createOcclusionCard`, {
    return doFetch(`${ApiService.baseEndpoint}/fetchOcclusionCard?id=${id}`, {
      method: 'POST'
    });
  };

  static editOcclusionCard = async (data: any) => {
    // return doFetch(`${ApiService.baseEndpoint}/createOcclusionCard`, {
    return doFetch(
      `${ApiService.baseEndpoint}/editOcclusionCard?id=${data._id}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static resetOcclusionCard = async (id: string) => {
    // return doFetch(`${ApiService.baseEndpoint}/createOcclusionCard`, {
    return doFetch(
      `${ApiService.baseEndpoint}/editOcclusionCard?id=${id}&reset=true`,
      {
        method: 'POST',
        body: JSON.stringify({})
      }
    );
  };

  static deleteOcclusionCard = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/deleteOcclusionCard?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  };

  static fetchOcclusionCards = async (page: number, limit: number) => {
    // return doFetch(`${ApiService.baseEndpoint}/createOcclusionCard`, {
    return doFetch(
      `${ApiService.baseEndpoint}/fetchOcclusionCards?page=${page}&limit=${limit}`,
      {
        method: 'POST',
        body: JSON.stringify({})
      }
    );
  };

  static storeStudyPlanMetaData = async (data: {
    studyPlanId: string;
    metadata?: {
      topicId: string;
      conversationId?: string;
      testDate?: Date;
    };
  }) => {
    return doFetch(`${ApiService.baseEndpoint}/storeStudyPlanMetaData`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getSingleFlashcard = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getStudentFlashcard?id=${id}`);
  };

  static getSingleFlashcardForAPIKey = async (id: string, apiKey: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getStudentFlashcard?id=${id}&shareable=true`,
      {
        method: 'GET'
      },
      true,
      {
        'x-api-key': apiKey
      }
    );
  };

  static verifyToken = async (token: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/verifyUserEmail?token=${token}`,
      {
        method: 'POST'
      }
    );
  };

  static logStudySession = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/logStudySession`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static storeCurrentStudy = async (flashcardId: string, data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/storeCurrentStudy`, {
      method: 'POST',
      body: JSON.stringify({ flashcardId, data })
    });
  };
  static convertAnkiToShep = async (d: { base64String: string }) => {
    const body = JSON.stringify(d);

    const headers: HeadersInit = {};

    const token = await firebaseAuth.currentUser?.getIdToken();
    headers['x-shepherd-header'] = 'vunderkind23';

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      //headers['Content-Type'] = 'multipart/form-data';
    }
    return fetch(`${REACT_APP_API_ENDPOINT}/convertAnkiToShep`, {
      method: 'POST',
      body,
      headers
    });
  };

  static checkFlashcardCount = async (studentId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getFlashcardCount`, {
      method: 'POST',
      body: JSON.stringify({ studentId })
    });
  };

  static checkQuizCount = async (userId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getQuizCount`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  };

  static generateFlashcardQuestions = async (
    data: any,
    studentId: string,
    lang: (typeof languages)[number]
  ) => {
    return fetch(`${AI_API}/flash-cards/students/${studentId}?lang=${lang}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      }
    });
  };

  static generateFlashcardQuestionsForNotes = async (
    data: any,
    studentId: string,
    firebaseId: string,
    lang: (typeof languages)[number]
  ) => {
    const isDevelopment =
      process.env.REACT_APP_API_ENDPOINT.includes('develop');

    return fetch(
      `${AI_API}/flash-cards/generate-from-plain-notes?env=${
        isDevelopment ? 'development' : 'production'
      }&lang=${lang}`,
      {
        method: 'POST',
        body: JSON.stringify({
          noteId: data.note,
          count: data.count,
          studentId: studentId,
          firebaseId: firebaseId
        }),
        headers: {
          'x-shepherd-header': HEADER_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
  };

  static generateMneomics = async (query: string) => {
    return fetch(`${AI_API}/mnemonics/generate`, {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      }
    });
  };

  static createMneomics = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createMneomics`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static submitTutor = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createTutor`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static activateTutor = async (queryParams: {
    apiKey: string;
    tutorEmail: string;
  }) => {
    const queryString = objectToQueryString(queryParams);
    return doFetch(`${ApiService.baseEndpoint}/activateTutor?${queryString}`, {
      method: 'POST'
    });
  };

  static getBookSessionData = async (data: any) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getBookSessionData?${new URLSearchParams(
        data
      )}`
    );
  };

  static getBooking = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getBooking?id=${id}`);
  };

  // Payments

  static createBooking = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createBooking`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static createStripeSetupPaymentIntent = async (data: any = {}) => {
    return doFetch(
      `${ApiService.baseEndpoint}/createStripeSetupPaymentIntent`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static addPaymentMethod = async (stripeId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/addPaymentMethod`, {
      method: 'POST',
      body: JSON.stringify({ stripeId })
    });
  };
  static deletePaymentMethod = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/deletePaymentMethod`, {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  };

  // Tutor

  static getTutor = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/tutor/${id}`);
  };
  static getTutorForAPIKey = async (id: string, apiKey: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/tutor/${id}?shareable=true`,
      {
        method: 'GET'
      },
      true,
      {
        'x-api-key': apiKey
      }
    );
  };
  // Offer

  static getOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/offer/${id}`);
  };

  static createOffer = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createOffer`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static acceptOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/acceptOffer`, {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  };

  static declineOffer = async (id: string, note: string) => {
    return doFetch(`${ApiService.baseEndpoint}/declineOffer`, {
      method: 'POST',
      body: JSON.stringify({ id, note })
    });
  };

  static withdrawOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/withdrawOffer`, {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  };

  static bookOffer = async (id: string, paymentMethodId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/bookOffer`, {
      method: 'POST',
      body: JSON.stringify({ id, paymentMethodId })
    });
  };

  static sendOtp = async () => {
    return doFetch(`${ApiService.baseEndpoint}/sendOttp`, {
      method: 'POST'
    });
  };

  static updateTutor = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateTutor`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getAllTutors = async (formData: any) => {
    let filterParams = '';

    for (const key in formData) {
      if (key === 'price' && !!formData['price']) {
        const rateArray = formData['price'].split('-');
        const minRate = rateArray[0];
        const maxRate = rateArray[1];
        filterParams += `&rateGTE=${minRate}&rateLTE=${maxRate}`;
      } else if (key === 'days' && !!formData['days']) {
        const daysArray = formData['days'];
        // eslint-disable-next-line
        daysArray.forEach((element: any) => {
          filterParams += `&schedule.${element.value}`;
        });
      } else if (
        key !== 'tz' &&
        key !== 'price' &&
        key !== 'days' &&
        !!formData[key]
      ) {
        filterParams += `&${key}=${formData[key]}`;
      }
    }

    const url = `${ApiService.baseEndpoint}/tutors?tz=${formData.tz}${filterParams}`;
    return doFetch(url);
  };

  static submitReview = async (clientId: string | number, data: any) => {
    return doFetch(
      `${ApiService.baseEndpoint}/createClientReview?id=${clientId}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static toggleBookmarkedTutor = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/toggleBookmarkedTutor`, {
      method: 'POST',
      body: JSON.stringify({ tutorId: id })
    });
  };

  // Get All Bookmarked tutors
  static getBookmarkedTutors = async () => {
    return doFetch(
      // `${ApiService.baseEndpoint}/bookmarkedTutors?page=${page}&limit=${limit}`
      `${ApiService.baseEndpoint}/bookmarkedTutors`
    );
  };

  static getStudentTutors = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getStudentTutors`);
  };

  static getActivityFeeds = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getActivityFeed`);
  };

  static getStudentReport = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getStudentReport`);
  };

  static getTutorReport = async () => {
    return doFetch(`${ApiService.baseEndpoint}/tutorStats`);
  };

  static getCalendarEvents = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getCalenderEvents`);
  };

  static getUpcomingEvent = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getUpcomingEvent`);
  };

  // Get All Tutor Clients
  static getTutorClients = async (page: number, limit: number) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getTutorClients?page=${page}&limit=${limit}`
    );
  };
  // Get Single Tutor Clients
  static getTutorSingleClients = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getClient?id=${id}`, {
      method: 'GET'
    });
  };

  // Get All Tutor Offers
  static getOffers = async (page: number, limit: number, userType: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getOffers?userType=${userType}&page=${page}&limit=${limit}`
    );
  };

  // Get Singlege Tutor Offers
  static getTutorSingleOffers = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getOffers?id=${id}`);
  };

  //Tutor notification
  static getTutorNotifications = async () => {
    return doFetch(`${ApiService.baseEndpoint}/notifications`);
  };

  static getTutorReviews = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/tutorReviews?tutor=${id}`);
  };

  //Tutor Activity Feed
  static getTutorActivityFeed = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getActivityFeed`);
  };

  static getUserNotifications = async () => {
    return doFetch(`${ApiService.baseEndpoint}/notifications`);
  };

  // Notes

  static getAllNotes = async (queryParams: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    type?: string;
  }) => {
    const queryString = objectToQueryString(queryParams);
    return doFetch(`${ApiService.baseEndpoint}/notes?${queryString}`);
  };

  static getNote = async (id: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/notes/${id}`);
  };
  static getNoteForAPIKey = async (id: string | number, apiKey: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/notes/${id}?shareable=true`,
      {
        method: 'GET'
      },
      true,
      {
        'x-api-key': apiKey
      }
    );
  };

  static createNote = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createNote`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  static cloneNote = async (noteId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/createNote?nid=${noteId}`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  };
  static updateNote = async (id: string | number, data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateNote/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  };

  static storeNotesTags = (noteIds: string[] | string, tags: string[]) => {
    return doFetch(`${ApiService.baseEndpoint}/storeNotesTags`, {
      method: 'POST',
      body: JSON.stringify({ noteIds, tags })
    });
  };

  static updateNoteTags = async (id: string | number, data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateNoteTags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  };

  static updateAllNoteTags = async (id: string[] | number, tags: string[]) => {
    const requestPayload = {
      noteIds: id,
      tags: tags
    };
    return doFetch(`${ApiService.baseEndpoint}/updateAllNoteTags`, {
      method: 'PUT',
      body: JSON.stringify(requestPayload)
    });
  };

  static deleteNote = async (id: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/deleteNote?id=${id}`, {
      method: 'DELETE'
    });
  };

  static deleteAllNote = async (noteIds: string[]): Promise<Response> => {
    const requestPayload = {
      noteIds: noteIds
    };

    return doFetch(`${ApiService.baseEndpoint}/deleteAllNotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });
  };

  static updateNoteDocumentId = async (
    id: string | number,
    documentURL: string | undefined
  ) => {
    if (!documentURL) {
      return;
    }
    return doFetch(`${ApiService.baseEndpoint}/updateNoteDocumentId/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ documentId: documentURL })
    }).then((response) => response.json());
  };

  static updateProfile = async (formData: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateProfile`, {
      method: 'PUT',
      body: JSON.stringify(formData)
    });
  };

  static createStudentFromTutor = async () => {
    return doFetch(`${ApiService.baseEndpoint}/createStudentFromTutor`, {
      method: 'POST'
    });
  };

  static createBounty = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createBounty`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  static getBountyOffers = async (
    page: number,
    limit: number,
    userType: string
  ) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getBounties?userType=${userType}&page=${page}&limit=${limit}`
    );
  };

  static applyForBounty = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/applyForBounty`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  static acceptBounty = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/handleBountyBid`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getBountyBids = async (data: any) => {
    const queryParams = new URLSearchParams({ bountyId: data }).toString();
    const url = `${ApiService.baseEndpoint}/getBountyBids?${queryParams}`;

    return doFetch(url, {
      method: 'GET'
    });
  };

  static getOnlineTutors = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getOnlineTutors`);
  };

  // CREATE: Create a new student document
  static createStudentDocument = async (data: StudentDocumentPayload) => {
    return await doFetch(`${ApiService.baseEndpoint}/studentDocuments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static storeDocumentTags = (
    documentIds: string[] | string,
    tags: string[]
  ) => {
    return doFetch(`${ApiService.baseEndpoint}/storeStudentDocumentTag`, {
      method: 'POST',
      body: JSON.stringify({ documentIds, tags })
    });
  };

  // READ: Get a specific student document by ID
  static getStudentDocument = async (id: string) => {
    return await doFetch(`${ApiService.baseEndpoint}/studentDocuments/${id}`, {
      method: 'GET'
    });
  };

  // READ: Get all student documents for a particular student
  static getStudentDocuments = async (queryParams: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    type?: string;
  }) => {
    const queryString = objectToQueryString(queryParams);
    return await doFetch(
      `${ApiService.baseEndpoint}/getStudentDocuments?${queryString}`,
      {
        method: 'GET'
      }
    );
  };

  // Utility function to perform the fetch operations
  private static async doFetch(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

  //Quizzes
  static getQuizzes = async (queryParams: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = objectToQueryString(queryParams);
    return doFetch(
      `${ApiService.baseEndpoint}/getStudentQuizzes?${queryString}`
    );
    // return {};
  };

  static createQuiz = async (data: {
    questions: QuizQuestion[];
    title: string;
    tags: string[];
  }) => {
    return doFetch(`${ApiService.baseEndpoint}/createQuiz`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static cloneQuiz = async (qid: string) => {
    return doFetch(`${ApiService.baseEndpoint}/createQuiz?qid=${qid}`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  };

  static storeQuizTags = (quizId: string[] | string, tags: string[]) => {
    return doFetch(`${ApiService.baseEndpoint}/editQuiz?id=${quizId}`, {
      method: 'POST',
      body: JSON.stringify({ tags })
    });
  };

  static updateQuiz = (
    quizId: string,
    data: {
      questions: QuizQuestion[];
      title: string;
      tags: string[];
    }
  ) => {
    return doFetch(`${ApiService.baseEndpoint}/editQuiz?id=${quizId}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static deleteQuiz = async (id: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/deleteQuiz?id=${id}`, {
      method: 'POST'
    });
  };

  static deleteQuizQuestion = async (
    quizId: string | number,
    questionId: string | number
  ) => {
    return doFetch(
      `${ApiService.baseEndpoint}/deleteQuizQuestion?quizId=${quizId}&questionId=${questionId}`,
      {
        method: 'DELETE'
      }
    );
  };

  static storeQuizScore = async (data: {
    quizId: string;
    score: number | string;
    scoreDetails: any;
  }) => {
    return doFetch(`${ApiService.baseEndpoint}/storeQuizScore`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static storeQuizHistory = async (data: {
    quizId: string;
    questionId: string;
    answerProvided: string;
  }) => {
    return doFetch(`${ApiService.baseEndpoint}/storeQuizHistory`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getQuiz = async (quizId: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/getQuiz?id=${quizId}`, {
      method: 'GET'
    });
  };

  static getQuizForAPIKey = async (quizId: string | number, apiKey: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getQuiz?id=${quizId}`,
      {
        method: 'GET'
      },
      true,
      {
        'x-api-key': apiKey
      }
    );
  };
  static generateQuizQuestion = async (
    userId: string,
    data: {
      firebaseId: string;
      type: QuizQuestion['type'] | 'mixed';
      count: number;
      difficulty: QuizQuestion['difficulty'];
      subject: string;
      topic: string;
      documentId?: string;
    },
    lang: (typeof languages)[number]
  ) => {
    return doFetch(
      `${AI_API}/quizzes/students/${userId}?lang=${lang}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      false,
      { 'Content-Type': 'application/json' }
    );
  };

  static generateQuizQuestionFromDocs = async (data: {
    type: QuizQuestion['type'] | 'mixed';
    count: number;
    difficulty: QuizQuestion['difficulty'];
    subject: string;
    topic: string;
    documentId?: string;
    studentId?: string;
    subscriptionTier?: string;
    start_page?: number;
    end_page?: number;
    lang: (typeof languages)[number];
  }) => {
    const { lang, ...d } = data;
    const newData = { ...d, language: lang };
    // const isDevelopment =
    //   process.env.REACT_APP_API_ENDPOINT.includes('develop');

    return doFetch(
      // isDevelopment
      //   ? 'https://shepherd-anywhere-cors.fly.dev/https://i2u58ng9l4.execute-api.us-east-2.amazonaws.com/prod/generate-from-notes'
      //   : // 'https://shepherd-anywhere-cors.fly.dev/https://shepherd-simple-proxy.fly.dev/generate-quizzes'
      //     `https://i2u58ng9l4.execute-api.us-east-2.amazonaws.com/prod/generate-from-notes`,
      `https://shepherd-anywhere-cors.fly.dev/https://i2u58ng9l4.execute-api.us-east-2.amazonaws.com/prod/generate-from-notes`,
      {
        method: 'POST',
        body: JSON.stringify(newData)
      },
      false,
      {
        'Content-Type': 'application/json'
      }
    );
  };

  // User Subscriptions
  static initiateUserSubscription = async (
    userId: string,
    priceId: string,
    priceTier: string,
    stripeCustomerId?: string
  ) => {
    return doFetch(`${ApiService.baseEndpoint}/initiateUserSubscription`, {
      method: 'POST',
      body: JSON.stringify({ stripeCustomerId, userId, priceId, priceTier }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  static getStripeCustomerPortalUrl = async (
    stripeCustomerId: string,
    currentSubscriptionId?: string,
    currentTier?: string
  ): Promise<any> => {
    return doFetch(`${ApiService.baseEndpoint}/createCustomerPortalSession`, {
      method: 'POST',
      body: JSON.stringify({
        stripeCustomerId,
        currentSubscriptionId,
        currentTier
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  static createStudyPlan = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createStudyPlan`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static deleteStudyPlan = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/deleteStudyPlan?id=${id}`, {
      method: 'POST'
    });
  };
  static getStudyPlans = async (
    page: number,
    limit: number,
    minReadinessScore?: number,
    maxReadinessScore?: number,
    title?: string,
    subject?: string,
    id?: string,
    apiKey?: string
  ) => {
    let apiUrl = `${ApiService.baseEndpoint}/getStudyPlans?page=${page}&limit=${limit}`;
    if (minReadinessScore !== undefined && maxReadinessScore !== undefined) {
      apiUrl += `&minReadinessScore=${minReadinessScore}&maxReadinessScore=${maxReadinessScore}`;
    }
    if (title) {
      apiUrl += `&title=${title}`;
    }

    if (subject) {
      apiUrl += `&course=${subject}`;
    }
    if (id) {
      apiUrl += `&id=${id}`;
    }
    if (apiKey) {
      apiUrl += `&shareable=true`;
    }
    const headers: HeadersInit = {};
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    return doFetch(
      apiUrl,
      {
        method: 'GET'
      },
      true,
      headers
    );
  };

  static cloneStudyPlan = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/cloneStudyPlan`, {
      method: 'POST',
      body: JSON.stringify({ studyPlanId: id })
    });
  };
  static getStudyPlanResources = async (planId: string, apiKey?: string) => {
    let apiUrl = `${ApiService.baseEndpoint}/getStudyPlanResources?studyPlanId=${planId}`;
    const headers: HeadersInit = {};
    if (apiKey) {
      apiUrl += `&shareable=true`;
    }
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    return doFetch(
      apiUrl,
      {
        method: 'GET'
      },
      false,
      headers
    );
  };
  static getStudyPlanReport = async (planId: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getStudyPlanReport?studyPlanId=${planId}`
    );
  };
  static getUpcomingStudyPlanEvent = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getUpcomingStudyPlanEvent`);
  };

  static setStudentOnboardStatus = async (status: boolean, userId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/setStudentOnboardStatus`, {
      method: 'POST',
      body: JSON.stringify({ status: status, userId: userId })
    });
  };
  static saveTopicSummary = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateIndividualStudyTopic`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  static storeConversationIdToStudyPlan = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/storeStudyPlanMetaData`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  static storeStudyPlanTopicDocument = async (
    data: StudyPlanTopicDocumentPayload
  ) => {
    return doFetch(`${ApiService.baseEndpoint}/storeStudyPlanTopicDocument`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  static ValidateSchoolUsers = async (fId, inviteCode) => {
    return doFetch(
      `${ApiService.baseEndpoint}/validateInviteCode?fId=${fId}&inviteCode=${inviteCode}`,
      {
        method: 'POST'
      }
    );
  };
  static updateSchoolUserPassword = async (fId, inviteCode, newPassword) => {
    return doFetch(
      `${ApiService.baseEndpoint}/updateSchoolUserPassword?fId=${fId}&inviteCode=${inviteCode}`,
      { method: 'POST', body: JSON.stringify({ newPassword: newPassword }) }
    );
  };

  static getSchoolTutorStudents = async (
    page?: number,
    limit?: number,
    filters?: Record<string, any>
  ) => {
    const params: Record<string, any> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;

    if (filters) {
      for (const key in filters) {
        params[key] = filters[key];
      }
    }
    const queryParams = new URLSearchParams(params).toString();

    return doFetch(
      `${ApiService.baseEndpoint}/getSchoolStudents?${queryParams}`
    );
  };
  static getSchoolCourses = async (page: number, limit: number) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getSchoolCourses?page=${page}&limit=${limit}`
    );
  };
  static getStudentPerformance = async (id) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getTutorsStudyPlanReport?studentUserId=${id}`
    );
  };
  static inviteSchoolStudents = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/inviteSchoolStudent`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  static inviteSchoolStudentsWithCSV = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/inviteSchoolStudentWithCSV`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
}

export default ApiService;
