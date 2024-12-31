import { from } from 'rxjs';

import { Collection } from '../constants/Collection';
import { databaseId } from '../constants/databaseId';
import { databases } from '../constants/databases';

export const deleteDocument = (collectionId: Collection, documentId: string) => {
  return from(databases.deleteDocument(databaseId, collectionId, documentId));
};
