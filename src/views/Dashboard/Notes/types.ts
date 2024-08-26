import { TimestampedEntity, User } from '../../../types';

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
  note: any;
  topic: string;
  documentId?: string;
  tags?: Array<string>;
  status?: NoteStatus;
}
