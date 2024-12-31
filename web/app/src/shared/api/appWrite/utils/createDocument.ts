import { ID } from 'appwrite';
import { from } from 'rxjs';

import { Collection } from '../constants/Collection';
import { databaseId } from '../constants/databaseId';
import { databases } from '../constants/databases';

export const createDocument = (collectionId: Collection, data: Record<string, string | null>) => {
  return from(databases.createDocument(databaseId, collectionId, ID.unique(), data));
};
