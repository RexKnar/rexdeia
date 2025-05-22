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
  buffer: Buffer,
  contentType: string,
  isVideo: boolean = false
) {
  const bucket = storage.bucket(bucketName);
  const folderPath = folderName ? `${folderName}/` : '';
  const fileId = nanoid();
  const filePath = `${folderPath}${fileId}-${fileName}`;
  const file = bucket.file(filePath);

  if (folderName) {
    const [folderExists] = await bucket.file(folderPath).exists();
    if (!folderExists) {
      await bucket.file(folderPath).save('', { resumable: false });
    }
  }

  return new Promise((resolve, reject) => {
    const streamOptions = {
      resumable: isVideo, // Use resumable uploads for videos
      metadata: {
        contentType: contentType,
        cacheControl: isVideo
          ? 'public, max-age=31536000' // Long cache for videos
          : 'public, max-age=3600', // Shorter cache for other files
      },
    };

    const stream = file.createWriteStream(streamOptions);

    stream.on('error', (err) => reject(err));
    stream.on('finish', async () => {
      try {
        // For video files, set metadata to support streaming
        if (isVideo) {
          await file.setMetadata({
            contentType: contentType,
            cacheControl: 'public, max-age=31536000',
            metadata: {
              isStreamable: 'true',
            },
          });
        }
        const fileOpenPath = await generateSignedUrl(filePath);

        const data = {
          publicUrl: fileOpenPath,
          filePath: filePath,
          fileId: fileId,
          contentType: contentType,
          isVideo: isVideo,
        };

        resolve({ data });
      } catch (err) {
        reject(err);
      }
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
