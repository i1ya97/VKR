import { Client } from 'appwrite';

const endPoint = `https://localhost/v1`;

const projectId = '6777b84800366212389d';

const newClient = new Client();
newClient.setEndpoint(endPoint).setProject(projectId);

export const client = newClient;
