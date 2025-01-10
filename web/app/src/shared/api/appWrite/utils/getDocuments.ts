import { Models } from 'appwrite';
import { from } from 'rxjs';

import { Collection } from '../constants/Collection';
import { databaseId, databases } from '../constants/databases';

export const getDocuments = <T extends Models.Document>(collectionId: Collection, queries?: string[]) => {
  return from(databases.listDocuments<T>(databaseId, collectionId, queries));
};
