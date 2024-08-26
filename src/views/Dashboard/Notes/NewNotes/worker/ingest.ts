import { WorkerCallback, WorkerProcess } from '../../types';

export const initNoteIngestWorker = (callback: WorkerCallback): Worker => {
  const workerProcess = workerLogic();
  const blob = new Blob([workerProcess], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));

  worker.addEventListener('message', (event) => {
    const { result } = event.data;
    callback && callback(result);
    worker.terminate();
  });
  return worker;
};

/**
 * Create a process string to initiate worker process call
 *
 * @param process The function to process and make the call
 * @returns {string} a string representation of the function for worker instance creation
 */
const workerLogic = (): string => {
  return `
    self.addEventListener('message', (event) => {
      const { editorData } = event.data;
      // Communicate the result back to the main thread
      self.postMessage("hello");
    });
  `;
};
