import { AI_API, HEADER_KEY } from '../config';
import { languages } from '../helpers';
import { AIServiceResponse } from '../views/Dashboard/Notes/types';
import { isNil } from 'lodash';

type DocumentType = {
  topic?: string;
  count: number;
  studentId: string;
  documentId: string;
  subscriptionTier: any;
  language: (typeof languages)[number];
};

export const fetchStudentDocuments = async (studentId: string) => {
  return await fetch(`${AI_API}/notes?studentId=${studentId}`, {
    headers: {
      'x-shepherd-header': HEADER_KEY
    }
  }).then((documents) => documents.json());
};
// export const processDocument = async (data: {
//   studentId: string;
//   documentId: string;
//   documentURL: string;
//   tags?: Array<string>;
//   courseId?: string;
//   title: string;
// }) => {
//   const processDoc = await fetch(`${AI_API}/notes/ingest`, {
//     method: 'POST',
//     headers: {
//       'x-shepherd-header': HEADER_KEY,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   }).then(async (data) => data.json());

//   return processDoc;
// };

export const processDocument = async (data: {
  studentId: string;
  documentId: string;
  documentURL: string;
  tags?: Array<string>;
  courseId?: string;
  title: string;
}) => {
  const processDocResponse = await fetch(`${AI_API}/notes/ingest`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!processDocResponse.ok) {
    throw new Error('Invalid file format');
  }

  const processDocData = await processDocResponse.json();
  return processDocData;
};

export const checkDocumentStatus = async ({
  studentId,
  documentId
}: {
  studentId: string;
  documentId: string;
}) => {
  const document = await fetch(
    `${AI_API}/notes/status?studentId=${studentId}&documentId=${documentId}`,
    {
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );

  return document;
};

export const chatWithDoc = async ({
  query,
  studentId,
  documentId
}: {
  studentId: string;
  query: string;
  documentId: string;
}) => {
  const request = await fetch(`${AI_API}/notes/chat`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      studentId,
      documentId
    })
  });

  return request;
};

export const createDocchatFlashCards = async (data: DocumentType) => {
  const request = await fetch(`https://proxinho.fly.dev`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return request;
};

export const chatHomeworkHelp = async ({
  query,
  studentId,
  topic
}: {
  studentId: string;
  query: string;
  topic: string;
}) => {
  const request = await fetch(`${AI_API}/homework-help/chat`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      studentId,
      topic
    })
  });

  return request;
};

export const fetchStudentConversations = async (studentId: string) => {
  const request = await fetch(
    `${AI_API}/notes/conversations?studentId=${studentId}`,
    {
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  const response = await request.json();

  return response;
};

export const chatHistory = async ({
  documentId,
  noteId,
  studentId
}: {
  documentId?: string;
  noteId?: string;
  studentId: string;
}) => {
  let query = ``;

  if (!isNil(documentId)) {
    query = `&documentId=${documentId}`;
  }
  if (!isNil(noteId)) {
    query = `&noteId=${noteId}`;
  }
  const response = await fetch(
    `${AI_API}/notes/chat/history?studentId=${studentId}${query}`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const chatHistory = await response.json();
    return chatHistory;
  }
};

export const generateSummary = async ({
  documentId,
  studentId
}: {
  documentId: string;
  studentId: string;
}) => {
  const response = await fetch(
    `${AI_API}/notes/summary?studentId=${studentId}&documentId=${documentId}`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const summaryResponse = await response.json();
    return summaryResponse;
  }
};
export const postGenerateSummary = async ({
  documentId,
  studentId
}: {
  documentId: string;
  studentId: string;
}) => {
  const request = await fetch(`${AI_API}/notes/summary/generate`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documentId,
      studentId
    })
  });

  return request;
};

export const uploadBlockNoteDocument = async (data: {
  studentId: string;
  documentId: string;
  document: Array<string>;
  title: string;
  tags?: Array<string>;
  courseId?: string;
}) => {
  return fetch(`${AI_API}/notes/create`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(async (data) => data.json());
};

export const postPDFHighlight = async (data: {
  studentId: string;
  documentId: string;
  highlight: { name: string; position: Array<any> };
  content: string;
}) => {
  const request = await fetch(`${AI_API}/highlights/comment/save`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return request;
};

export const getPDFHighlight = async ({
  documentId
}: {
  documentId?: string;
}) => {
  const response = await fetch(
    `${AI_API}/highlights?documentId=${documentId}`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const highlight = await response.json();
    return highlight;
  }
};

export const generateComment = async (data: {
  highlightText: string;
  documentId: string;
  studentId: string;
}) => {
  const response = await fetch(`${AI_API}/highlights/comment/generate`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorResponse = await response.json();

    throw new Error(`Failed to generate Comment`);
  } else {
    const summaryResponse = await response.json();

    return summaryResponse;
  }
};

export const deleteGeneratedSummary = async ({
  studentId,
  documentId
}: {
  studentId: string;
  documentId: string;
}) => {
  const request = await fetch(
    `${AI_API}/notes/summary?studentId=${studentId}&documentId=${documentId}`,
    {
      method: 'DELETE',
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId,
        studentId
      })
    }
  );
  return request;
};

export const updateGeneratedSummary = async ({
  studentId,
  documentId,
  summary
}: {
  studentId: string;
  documentId: string;
  summary: string;
}) => {
  const request = await fetch(
    `${AI_API}/notes/summary?studentId=${studentId}&documentId=${documentId}`,
    {
      method: 'PATCH',
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId,
        studentId,
        summary
      })
    }
  );
  return request;
};

export const getConversionById = async ({
  conversationId
}: {
  conversationId: string;
}) => {
  const response = await fetch(
    `${AI_API}/notes/conversations/${conversationId}`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const conversation = await response.json();
    return conversation;
  }
};
export const getConversionByIdAndAPIKey = async ({
  conversationId,
  apiKey
}: {
  conversationId: string;
  apiKey: string;
}) => {
  const response = await fetch(
    `${AI_API}/notes/conversations/${conversationId}?shareable=true`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'x-api-key': apiKey
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const conversation = await response.json();
    return conversation;
  }
};
export const deleteConversationId = async ({
  conversationId
}: {
  conversationId: string;
}) => {
  const request = await fetch(
    `${AI_API}/notes/conversations/${conversationId}`,
    {
      method: 'DELETE',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );
  return request;
};

export const editConversationId = async ({
  editConversation,
  newTitle
}: {
  editConversation: string;
  newTitle: string;
}) => {
  const request = await fetch(
    `${AI_API}/notes/conversations/${editConversation}/update`,
    {
      method: 'POST',
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newTitle
      })
    }
  );
  return request;
};

export const getDescriptionById = async ({
  conversationId
}: {
  conversationId: string;
}) => {
  const response = await fetch(
    `${AI_API}/notes/conversations/${conversationId}/description`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const conversation = await response.json();
    return conversation;
  }
};

export const getToggleReaction = async ({ chatId, reactionType }) => {
  const request = await fetch(`${AI_API}/notes/chat/toggle_reaction`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId,
      reactionType
    })
  });
  return request;
};

export const postPinnedPrompt = async ({ chatId, studentId }) => {
  const request = await fetch(`${AI_API}/notes/toggle_pin`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId,
      studentId
    })
  });
  return request;
};

export const getDocchatHistory = async ({
  studentIdParam,
  noteText
}: {
  studentIdParam?: string;
  noteText?: string;
}) => {
  const AI_API_BASE_URL = `${AI_API}/notes/chat`;
  const endpoint = 'document_history';

  // Prepare query parameters
  const queryParams = new URLSearchParams({
    studentId: studentIdParam,
    documentType: noteText ? 'text_note' : '',
    env: process.env.REACT_APP_API_ENDPOINT.includes('develop')
      ? 'develop'
      : 'prod'
  });

  const url = `${AI_API_BASE_URL}/${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-shepherd-header': HEADER_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const conversation = await response.json();
    return conversation;
  }
};

export const generateStudyPlan = async (data: {
  syllabusUrl?: string;
  syllabusData?: {
    course: string;
    gradeLevel: string;
    weekCount: number;
  };
}) => {
  const response = await fetch(`${AI_API}/study-plans/generate`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const studyPlanResponse = await response.json();
    return studyPlanResponse;
  }
};
