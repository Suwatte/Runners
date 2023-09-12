import { Highlight, PagedResult } from "@suwatte/daisuke";
import { parseID, parseWebUrl, request } from ".";
import { MediaListCollectionQuery, MediaListEntryQuery } from "../gql";
import {
  MediaListCollectionResponse,
  MediaListEntryQueryResponse,
} from "../types";

/**
 * Gets the media list entry for a given title
 */
export const getMediaListEntry = async (id: string) => {
  const data = await request<MediaListEntryQueryResponse>(MediaListEntryQuery, {
    id: parseID(id),
  });

  return data.data.Media;
};

export const parseTrackItem = async (id: string): Promise<Highlight> => {
  const {
    mediaListEntry: entry,
    title: { userPreferred: title },
    coverImage: { large: cover },
    chapters,
  } = await getMediaListEntry(id);

  return {
    id,
    title,
    cover,
    webUrl: `https://anilist.co/manga/${id}`,
    ...(entry && {
      entry: {
        status: entry.status,
        progress: {
          maxAvailableChapter: chapters,
          lastReadChapter: entry.progress,
          lastReadVolume: entry.progressVolumes,
        },
      },
    }),
  };
};

export const getMediaListCollection = async (
  name: string
): Promise<PagedResult> => {
  const userName = await SecureStore.get("user");
  if (!userName) throw new Error("failed to get username");
  const {
    data: {
      MediaListCollection: { lists },
    },
  } = await request<MediaListCollectionResponse>(MediaListCollectionQuery, {
    userName,
  });

  const target = lists.find((v) => v.name === name);

  if (!target) throw new Error("list not found.");

  const results: Highlight[] = target.entries.map((v) => ({
    id: `${v.media.id}`,
    title: v.media.title.userPreferred,
    cover: v.media.coverImage.large,
    webUrl: parseWebUrl(v.media.id),
    entry: {
      status: v.status,
      progress: {
        lastReadChapter: v.progress,
        lastReadVolume: v.progressVolume,
      },
    },
  }));
  return {
    isLastPage: true,
    results,
  };
};
