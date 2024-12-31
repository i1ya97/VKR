import { Client } from 'appwrite';

const endPoint = `https://webapp.nntc.pro/v1`;

const projectId = '66b5d683000e268430a3';

const newClient = new Client();
newClient.setEndpoint(endPoint).setProject(projectId);

export const client = newClient;
