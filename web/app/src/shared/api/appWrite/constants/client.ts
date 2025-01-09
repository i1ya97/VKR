import { Client } from 'appwrite';

const endPoint = `http://51.250.32.125:17600/v1`;

const projectId = '6777b84800366212389d';

const newClient = new Client();
newClient.setEndpoint(endPoint).setProject(projectId);

export const client = newClient;
