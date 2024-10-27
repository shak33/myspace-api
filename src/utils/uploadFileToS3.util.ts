import AWS from 'aws-sdk';
import { s3 } from '@/configs/awsS3.config';

export const uploadFileToS3Util = async (
  file: any
): Promise<AWS.S3.ManagedUpload.SendData | string> => {
  try {
    const newFileName = `${Date.now().toString()}.${
      file.mimetype.split('/')[1]
    }`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: newFileName,
      Body: file.data,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, {}, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  } catch (error) {
    console.log(error);
    return 'Internal server error';
  }
};
