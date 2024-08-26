import ApiService from '../services/ApiService';
import { SessionType } from '../types';
class StudySessionLogger {
  private sessionType: SessionType;
  public currentState: 'INIT' | 'STARTED' | 'ENDED' = 'INIT';
  private startTime: Date | null = null;
  private entityId: string | null = null;
  private endTime: Date | null = null;
  constructor(sessionType: SessionType, entityId?: string) {
    this.sessionType = sessionType;
    this.entityId = entityId || null;
  }
  start() {
    this.startTime = new Date();
    this.currentState = 'STARTED';
  }
  end() {
    // if (this.currentState !== 'STARTED') {
    //   // eslint-disable-next-line
    //   console.error('NO SESSION STARTED');
    //   return;
    // }
    console.log(this.currentState);

    // Store the end time
    this.endTime = new Date();
    this.currentState = 'ENDED';

    // Send final session data to the server
    ApiService.logStudySession({
      sessionType: this.sessionType,
      startTime: this.startTime,
      endTime: this.endTime,
      entityId: this.entityId
    });
  }
}
export default StudySessionLogger;
