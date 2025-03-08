// import type { TVTimeLibraryEntry } from '../types/tvtime/library-entry';

// export const buildLibraryObjectUserDescription = (
//   libraryObject: TVTimeLibraryEntry,
// ): string => {
//   const description = [];
//
//   if (libraryObject.createdAt) {
//     description.push(
//       `• Added to watchlist: ${
//         libraryObject.attributes.createdAt.toString().split('T')[0]
//       }`,
//     );
//     if (libraryObject.attributes.startedAt) {
//       description.push(
//         `• Started At: ${
//           libraryObject.attributes.startedAt.toString().split('T')[0]
//         }`,
//       );
//     }
//     if (libraryObject.attributes.finishedAt) {
//       description.push(
//         `• Completed At: ${
//           libraryObject.attributes.finishedAt.toString().split('T')[0]
//         }`,
//       );
//     }
//   }
//
//   if (libraryObject.attributes.rating) {
//     if (description.length > 0) {
//       description.push(`----------------`);
//     }
//
//     description.push(
//       `• Rating: ${parseFloat(libraryObject.attributes.rating) * 2}`,
//     );
//   }
//
//   if (libraryObject.attributes.progress) {
//     if (description.length > 0) {
//       description.push(`----------------`);
//     }
//
//     description.push(
//       `• Progress: ${libraryObject.attributes.progress}/${libraryObject.meta.attributes.episodeCount}`,
//     );
//   }
//
//   if (libraryObject.attributes.notes) {
//     if (description.length > 0) {
//       description.push(`----------------`);
//     }
//
//     description.push(`Notes:\n${libraryObject.attributes.notes}`);
//   }
//
//   if (description.length > 0) {
//     description.push(`----------------`);
//   }
//
//   description.push(libraryObject.meta.attributes.description);
//
//   return description.join('\n');
// };
