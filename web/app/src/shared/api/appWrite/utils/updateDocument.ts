import { from } from 'rxjs';

import { Collection } from '../constants/Collection';
import { databaseId } from '../constants/databaseId';
import { databases } from '../constants/databases';

export const updateDocument = (collectionId: Collection, documentId: string, data: Record<string, string | null>) => {
  return from(databases.updateDocument(databaseId, collectionId, documentId, data));
};
