import type { AnilistCatalogStatus } from '../types/catalog/catalog-status';

// Source: https://github.com/Api-Wrappers/anilist-wrapper/blob/4f1ad6843a06edcab5a09eeda7fd08ece75863df/src/utils/utils.ts
export const generateQueryHeaders = (
  type: string,
  item: number | string,
  addItm?: string,
  status?: AnilistCatalogStatus,
  chunk?: number,
  perChunk?: number,
): [object, string] => {
  // A search term is needed. Throw an error.
  if (!item) {
    throw new Error('A term is not provided!');
  }
  if (addItm && typeof addItm !== 'string') {
    throw new Error('The additional item in the query must be a string!');
  }

  switch (typeof item) {
    case 'number':
      switch (type) {
        case 'MediaListCollection':
          return [
            {
              id: item,
              type: addItm,
              status: status,
              chunk: chunk,
              perChunk: perChunk,
            },
            `#graphql
            query (
              $id: Int,
              $type: MediaType,
              $status: MediaListStatus,
              $chunk: Int,
              $perChunk: Int
            ) { 
              MediaListCollection(
                userId: $id,
                type: $type,
                status: $status,
                chunk: $chunk,
                perChunk: $perChunk,
                sort: [ADDED_TIME_DESC, UPDATED_TIME_DESC, PROGRESS_DESC]
              ) {`,
          ];
        case 'User':
        case 'Staff':
        case 'Character':
        case 'Studio':
        case 'Activity':
        case 'Thread':
          return [
            { id: item },
            `#graphql
            query ($id: Int) { 
              ${type} (id: $id) { 
            `,
          ];
        default:
          throw new Error("This type doesn't have a query assigned to it!");
      }
    case 'string':
      switch (type) {
        case 'MediaListCollection':
          return [
            {
              name: item,
              type: addItm,
              status: status,
              chunk: chunk,
              perChunk: perChunk,
            },
            `#graphql 
            query (
              $name: String, 
              $type: MediaType, 
              $status: MediaListStatus, 
              $chunk: Int, 
              $perChunk: Int
            ) {
              MediaListCollection(
                userName: $name, 
                type: $type, 
                status: $status, 
                chunk: $chunk, 
                perChunk: $perChunk, 
                sort: [ADDED_TIME_DESC, UPDATED_TIME_DESC, PROGRESS_DESC]
              ) {
            `,
          ];
        case 'User':
          return [
            { name: item },
            `#graphql
            query ($name: String) { User (name: $name) {
            `,
          ];
        // Both staff and character need the same query header.
        case 'Staff':
        case 'Character':
        case 'Studio':
          return [
            { search: item },
            `#graphql
            query ($search: String) { ${type} (search: $search) {
            `,
          ];
        default:
          throw new Error("This type doesn't have a query assigned to it!");
      }
    default:
      throw new Error('Term does not match the required types!');
  }
};
