import {
  AdvancedTracker,
  DirectoryConfig,
  DirectoryRequest,
  FullTrackItem,
  PagedResult,
} from "@suwatte/daisuke";
import {
  buildGenres,
  fullSearch,
  getFullMedia,
  getHomePageViewMore,
} from "../utils/media";
import { getMediaListCollection } from "../utils";
import { getSortOptions } from "../utils/utils";

export const AdvancedTrackerImplementation: AdvancedTracker = {
  getFullInformation: async function (id: string): Promise<FullTrackItem> {
    return getFullMedia(id);
  },
  getDirectory: async function (
    request: DirectoryRequest
  ): Promise<PagedResult> {
    if (request.context) {
      if (request.context.list) {
        return getMediaListCollection(request.context.list);
      }
      if (request.context.discover) {
        return getHomePageViewMore(request.context.discover, request.page);
      }
    }
    const results = await fullSearch(request);
    return {
      isLastPage: results.length < 30,
      results,
    };
  },
  getDirectoryConfig: async function (key): Promise<DirectoryConfig> {
    if (key == "viewMore")
      return {
        searchable: false,
      };

    if (key === "userList")
      return {
        searchable: false,
        sort: {
          options: getSortOptions(),
          default: {
            id: "POPULARITY",
            ascending: false,
          },
          canChangeOrder: true,
        },
      };
    return {
      filters: await buildGenres(),
      sort: {
        options: getSortOptions(),
        default: {
          id: "POPULARITY",
          ascending: false,
        },
        canChangeOrder: true,
      },
    };
  },
  toggleFavorite: function (state: boolean): Promise<void> {
    throw new Error("Function not implemented.");
  },
};
