import { from } from 'rxjs';

import { Collection } from '../constants/collection';
import { databases, databaseId } from '../constants/databases';

export const deleteDocument = (collectionId: Collection, documentId: string) => {
  return from(databases.deleteDocument(databaseId, collectionId, documentId));
};
