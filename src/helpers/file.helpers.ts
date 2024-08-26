import { storage } from '../firebase';
import S3Handler, { UploadBody } from './s3Handler';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot
} from 'firebase/storage';

type Listener<T extends any[] = any[]> = (...args: T) => void;

interface UploadEvents {
  progress: Listener<[number]>;
  error: Listener<[Error]>;
  complete: Listener<[UploadMetadata]>;
}

interface UploadValidationOptions {
  maxSize?: number; // Max file size in bytes
}

class UploadEventEmitter {
  private events: Partial<Record<keyof UploadEvents, Listener[]>> = {};

  on<T extends keyof UploadEvents>(event: T, listener: UploadEvents[T]) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]?.push(listener);
  }

  emit<T extends keyof UploadEvents>(
    event: T,
    ...args: Parameters<UploadEvents[T]>
  ) {
    if (!this.events[event]) return;
    for (const listener of this.events[event] as Listener[]) {
      listener(...args);
    }
  }
}

export interface UploadMetadata {
  fileUrl?: string;
  contentType?: string;
  size?: number;
  name?: string;
  studentID?: string;
  documentID?: string;
}

export const uploadFile = (
  file: File,
  body?: UploadBody,
  validationOptions?: UploadValidationOptions
) => {
  const emitter = new UploadEventEmitter();

  const s3Handler = new S3Handler();

  if (validationOptions?.maxSize && file.size > validationOptions.maxSize) {
    const error = new Error(
      `File size exceeds the maximum limit of ${validationOptions.maxSize} bytes.`
    );
    emitter.emit('error', error);
  } else {
    s3Handler
      .uploadToS3(file, body)
      .then(
        (metadata) => {
          emitter.emit('complete', metadata);
        },
        (error) => {
          emitter.emit('error', error);
        }
      )
      .catch((error) => {
        emitter.emit('error', error);
      });
  }

  // if (useS3 && body) {

  // } else {
  //   const storageRef = ref(storage, `uploads/${file.name}`);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot: UploadTaskSnapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       emitter.emit('progress', progress);
  //     },
  //     (error) => {
  //       emitter.emit('error', error);
  //     },
  //     async () => {
  //       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

  //       const metadata = {
  //         fileUrl: downloadURL,
  //         contentType: file.type,
  //         size: file.size,
  //         name: file.name
  //       };
  //       emitter.emit('complete', metadata);
  //     }
  //   );
  // }

  return emitter;
};

export const snip = (text, n = 25) => {
  if (text.length > n) {
    const mid = Math.floor(n / 2);
    const truncatedText =
      text.slice(0, mid - 1) + '...' + text.slice(text.length - mid + 2);
    return truncatedText;
  }
  return text;
};

export default uploadFile;
