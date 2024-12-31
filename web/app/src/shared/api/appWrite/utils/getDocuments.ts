import { Models } from 'appwrite';
import { from } from 'rxjs';

import { Collection } from '../constants/Collection';
import { databaseId } from '../constants/databaseId';
import { databases } from '../constants/databases';

export const getDocuments = <T extends Models.Document>(collectionId: Collection, queries?: string[]) => {
  return from(databases.listDocuments<T>(databaseId, collectionId, queries));
};
