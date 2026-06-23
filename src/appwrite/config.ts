import { Client, Storage, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const storage = new Storage(client);
export const databases = new Databases(client);
export const storageBucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;
export const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const registrationCollectionId = import.meta.env.VITE_APPWRITE_REGISTRATION_COLLECTION_ID;