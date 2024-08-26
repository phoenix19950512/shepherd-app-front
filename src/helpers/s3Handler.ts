import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export interface UploadBody {
  studentID: string;
  documentID?: string;
}

export interface UploadMetadata {
  fileUrl: string;
  contentType: string;
  size: number;
  name?: string;
  studentID?: string;
  documentID?: string;
}

class S3Handler {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async uploadToS3(file: File, body: UploadBody): Promise<UploadMetadata> {
    const documentID = body.documentID || file.name;
    const newFileName = `${body.studentID}/${documentID}`;

    const uploadParams = {
      Bucket: 'shepherd-document-upload',
      Key: newFileName,
      Body: file,
      ContentType: file.type
    };

    await new Upload({
      client: this.s3,
      params: uploadParams
    }).done();

    const fileUrl = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${newFileName}`;

    return {
      studentID: body.studentID,
      documentID,
      fileUrl,
      contentType: file.type,
      size: file.size
    };
  }
}

export default S3Handler;
