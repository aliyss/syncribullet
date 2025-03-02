import { axiosInstance } from '~/utils/axios/cache';

import type { AnilistCatalogStatus } from '../types/catalog/catalog-status';
import type { AnilistUserSettings } from '../types/user-settings';
import { ANILIST_BASE_URL } from './url';

const animeMutation = (
  mediaId: number,
  status: AnilistCatalogStatus,
  progress: number | undefined,
) => {
  const mutation = `#graphql
    mutation(
      $id:Int 
      $mediaId:Int 
      $status:MediaListStatus 
      $score:Float 
      $progress:Int 
      $progressVolumes:Int 
      $repeat:Int 
      $private:Boolean 
      $notes:String 
      $customLists:[String]
      $hiddenFromStatusLists:Boolean 
      $advancedScores:[Float]
      $startedAt:FuzzyDateInput 
      $completedAt:FuzzyDateInput
    ) {
      SaveMediaListEntry(
        id:$id 
        mediaId:$mediaId 
        status:$status 
        score:$score 
        progress:$progress 
        progressVolumes:$progressVolumes 
        repeat:$repeat 
        private:$private 
        notes:$notes 
        customLists:$customLists 
        hiddenFromStatusLists:$hiddenFromStatusLists 
        advancedScores:$advancedScores 
        startedAt:$startedAt 
        completedAt:$completedAt
      ) {
          id 
          mediaId 
          status 
          score 
          advancedScores 
          progress 
          progressVolumes 
          repeat 
          priority 
          private 
          hiddenFromStatusLists 
          customLists 
          notes 
          updatedAt 
          startedAt{year month day} 
          completedAt{year month day} 
          user{id name} 
          media{
            id 
            title{userPreferred}
            type 
            format 
            status 
            episodes 
            volumes 
            chapters 
            averageScore 
            popularity 
            isAdult 
            startDate{year}
          }
        }
      }
  `;
  return {
    query: mutation,
    variables: {
      mediaId: mediaId,
      status: status,
      progress: progress,
    },
  };
};

export const syncAnilistMetaObject = async (
  id: number,
  status: AnilistCatalogStatus,
  count:
    | {
        season: number;
        episode: number;
      }
    | undefined,
  userConfig: AnilistUserSettings,
): Promise<void> => {
  const { query, variables } = animeMutation(id, status, count?.episode || 1);

  if (!query) {
    throw new Error('No query provided');
  }

  if (query.startsWith('mutation') && !userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  try {
    const response = await axiosInstance(ANILIST_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: userConfig.auth?.access_token
          ? `Bearer ${userConfig.auth.access_token}`
          : undefined,
      },
      data: {
        query,
        variables,
      },
    });

    if (response.status !== 200) {
      if (response.statusText)
        throw new Error(
          `Anilist Api returned with a ${response.status} status. ${response.statusText}`,
        );
      throw new Error(
        `Anilist Api returned with a ${response.status} status. The api might be down!`,
      );
    }

    return await response.data.data;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
