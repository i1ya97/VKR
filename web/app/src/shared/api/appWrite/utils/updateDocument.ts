import { from } from 'rxjs';

import { Collection } from '../constants/Collection';
import { databases, databaseId } from '../constants/databases';

export const updateDocument = (
  collectionId: Collection,
  documentId: string,
  data: Record<string, string | null | boolean>,
) => {
  return from(databases.updateDocument(databaseId, collectionId, documentId, data));
};
