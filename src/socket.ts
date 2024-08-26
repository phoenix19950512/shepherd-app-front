import { AI_SOCKET, HEADER_KEY } from './config';
import io from 'socket.io-client';
import { languages } from './helpers';

const socketWithAuth = (payload: {
  studentId: string;
  language?: (typeof languages)[number];
  firebaseId?: string;
  documentId?: string;
  name?: string;
  namespace: string;
  topic?: string;
  subject?: string;
  level?: string;
  conversationId?: string;
  noteId?: string;
  isDevelopment?: boolean;
}) =>
  io(`${AI_SOCKET}/${payload.namespace}`, {
    extraHeaders: {
      'x-shepherd-header': HEADER_KEY
    },
    autoConnect: false,
    auth: (cb) => {
      cb(payload);
    }
  });

export default socketWithAuth;
