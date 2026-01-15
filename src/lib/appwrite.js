import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const COLLECTION_ID_TASKS = import.meta.env.VITE_COLLECTION_ID_TASKS;

export { client, account, databases };
