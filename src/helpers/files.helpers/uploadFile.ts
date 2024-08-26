import { storage } from '../../firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot
} from 'firebase/storage';

type Func = (...args: any[]) => void;

class UploadEventEmitter {
  private events: { [key: string]: Func[] } = {};

  on(event: string, listener: Func) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }
}

export const uploadFile = (file: File) => {
  const emitter = new UploadEventEmitter();

  // Create a storage reference from our storage service
  const storageRef = ref(storage, `uploads/${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot: UploadTaskSnapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      emitter.emit('progress', progress);
    },
    (error) => {
      emitter.emit('error', error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      emitter.emit('complete', downloadURL);
    }
  );

  return emitter;
};

export default uploadFile;
