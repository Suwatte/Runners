import {
  DirectoryConfig,
  DirectoryHandler,
  DirectoryRequest,
  PagedResult,
} from "@suwatte/daisuke";
import {
  RESULT_COUNT,
  DEFAULT_SORT,
  SortOptions,
  buildSort,
  seriesToTile,
} from "../utils";
import { getBooksForSeries, getHost, getSeriesForLibrary } from "../api";
import { KomgaStore } from "../store";

/**
 * Implementation of the DirectoryHandler Methods
 */
export const KomgaDirectoryHandler: DirectoryHandler = {
  getDirectory: function (request: DirectoryRequest): Promise<PagedResult> {
    return fetchDirectory(request);
  },
  getDirectoryConfig: async function (
    key?: string | undefined
  ): Promise<DirectoryConfig> {
    return buildDirectoryConfig(key === "library");
  },
};

/**
 * Builds the Directory View Sort Options & Filters
 */
function buildDirectoryConfig(searchable: boolean): DirectoryConfig {
  return {
    searchable,
    sort: {
      options: SortOptions,
      canChangeOrder: true,
      default: {
        id: DEFAULT_SORT,
        ascending: false,
      },
    },
  };
}

type IResponse = Promise<PagedResult>;
async function fetchDirectory(request: DirectoryRequest): IResponse {
  const sort = request.sort
    ? buildSort(request.sort.id, request.sort.ascending)
    : buildSort();
  const seriesId = request.context?.seriesId;
  const libraryId = request.context?.libraryId;

  if (seriesId) {
    const result = await getBooksForSeries(seriesId, sort, request.page);
    return {
      results: result.items,
      isLastPage: result.isLastPage,
    };
  } else if (libraryId) {
    const host = await getHost();
    const asTitle = await KomgaStore.openSeriesAsTitle();
    if (!host) throw new Error("Host not defined");
    const results = (
      await getSeriesForLibrary(
        libraryId,
        buildSort(request.sort?.id, request.sort?.ascending),
        request.page,
        request.query
      )
    ).map((v) => seriesToTile(v, host, !(asTitle ?? false)));

    return {
      results,
      isLastPage: results.length < RESULT_COUNT,
    };
  }

  throw new Error(
    "unable to process request. Context provided is not defined."
  );
}
