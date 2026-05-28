import { nanoid } from 'nanoid';

import { storage } from '../../../lib/gcs';

export async function uploadFileToGCS(
  bucketName: string,
  folderName: string,
  fileName: string,
  buffer: Buffer
) {
  const bucket = storage.bucket(bucketName);
  const folderPath = folderName ? `${folderName}/` : '';
  const filePath = `${folderPath}${nanoid()}-${fileName}`;
  const file = bucket.file(filePath);

  if (folderName) {
    const [folderExists] = await bucket.file(folderPath).exists();
    if (!folderExists) {
      await bucket.file(folderPath).save('', { resumable: false });
    }
  }

  return new Promise((resolve, reject) => {
    const stream = file.createWriteStream();
    stream.on('error', (err) => reject(err));
    stream.on('finish', async () => {
      resolve({
        data: {
          publicUrl: file.publicUrl(),
          filePath: filePath,
        },
      });
    });
    stream.end(buffer);
  });
}

export async function deleteFileFromGCS(bucketName: string, filePath: string) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);
  await file.delete();
}

export async function generateSignedUrl(fileName: string) {
  const bucketName = process.env.NEXT_GCLOUD_STORAGE_BUCKET;
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: expirationDate, // Set expiration time for the URL
  });

  return url;
}
