import AWS from 'aws-sdk';
import { s3 } from '@/configs/awsS3.config';

export const removeFileFromS3Util = async (
  key: string
): Promise<AWS.S3.DeleteObjectOutput | string> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    };

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  } catch (error) {
    return 'Internal server error';
  }
};
