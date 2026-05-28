import 'server-only';

import { Storage, StorageOptions } from '@google-cloud/storage';

// Credentials must NEVER be committed to the repo. Provide them at runtime via:
//   - GCLOUD_SERVICE_ACCOUNT_KEY : the full service-account JSON as a single string
//                                  (recommended for hosted/secret-manager setups), or
//   - GOOGLE_APPLICATION_CREDENTIALS : a filesystem path to a key file (local dev only).
function buildStorageOptions(): StorageOptions {
  const options: StorageOptions = {
    projectId: process.env.NEXT_GCLOUD_PROJECT_ID,
  };

  const rawKey = process.env.GCLOUD_SERVICE_ACCOUNT_KEY;
  if (rawKey) {
    options.credentials = JSON.parse(rawKey);
    return options;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    options.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    return options;
  }

  // Fall back to Application Default Credentials (e.g. workload identity on GCP).
  return options;
}

export const storage = new Storage(buildStorageOptions());
