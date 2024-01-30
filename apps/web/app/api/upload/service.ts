import { Storage } from '@google-cloud/storage';
import { nanoid } from 'nanoid';
import path from 'path';

const storage = new Storage({
  projectId: process.env.NEXT_GCLOUD_PROJECT_ID,
  keyFilename: path.resolve('./keyfile.json'),
});

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
