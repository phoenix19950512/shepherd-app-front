export const SCHEDULE_FORMAT = 'hh:mm A';
export const REACT_APP_API_ENDPOINT = process.env
  .REACT_APP_API_ENDPOINT as string;
export const AI_API = process.env.REACT_APP_AI_API as string;
export const AI_SOCKET = (process.env.REACT_APP_AI_SOCKET ||
  process.env.REACT_APP_AI_API) as string;
export const HEADER_KEY = process.env.REACT_APP_AI_HEADER_KEY as string;
