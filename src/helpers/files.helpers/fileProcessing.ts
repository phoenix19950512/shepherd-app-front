import ApiService from '../../services/ApiService';
import { StudentDocumentPayload, StudentDocument } from '../../types';

class FileProcessingService {
  private documentInfo: Partial<StudentDocument>;
  private apiService = ApiService;
  private isSaved = false;

  constructor(documentInfo: Partial<StudentDocument>, isSaved = false) {
    this.documentInfo = documentInfo;
    if (isSaved) {
      this.isSaved = isSaved;
    }
  }

  async process() {
    if (!this.isSaved) {
      const saveFile = await this.apiService.saveStudentDocument(
        this.documentInfo
      );

      if (saveFile.status === 200) {
        const { data } = await saveFile.json();

        const response = await this.processDocumentData({
          ...data,
          student: this.documentInfo.student
        });

        return response;
      }

      throw new Error('Failed to save document');
    } else {
      // If the document is already saved, just process it.
      const data = this.documentInfo;
      const response = await this.processDocumentData(data as StudentDocument);

      return response;
    }
  }

  async processDocumentData(data: StudentDocument) {
    // return {
    //   status: 'Success',
    //   message: 'Received and formatted the argument.',
    //   data: {
    //     studentId:
    //       typeof data.student === 'string' ? data.student : data.student?._id,
    //     documentId: data.documentUrl,
    //     documentURL: data.documentUrl,
    //     title: data.title
    //   }
    // };

    const response = await this.apiService.processDocument({
      studentId:
        typeof data.student === 'string' ? data.student : data.student?._id,
      documentId: data._id,
      documentURL: data.documentUrl,
      title: data.title
    });

    const {
      data: [{ documentId: docId }]
    } = response;

    await this.apiService.updateStudentDocument(data._id, { ingestId: docId });

    return response;
  }
}

export default FileProcessingService;
