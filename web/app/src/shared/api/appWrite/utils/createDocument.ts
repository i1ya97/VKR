import { ID } from 'appwrite';
import { from } from 'rxjs';

import { Collection } from '../constants/Collection';
import { databases, databaseId } from '../constants/databases';

export const createDocument = (collectionId: Collection, data: Record<string, string | null | boolean>) => {
  return from(databases.createDocument(databaseId, collectionId, ID.unique(), data));
};
