import {
  DirectoryConfig,
  DirectoryHandler,
  DirectoryRequest,
  PagedResult,
} from "@suwatte/daisuke";
import {
  RESULT_COUNT,
  FilterItems,
  FilterOptions,
  SortOptions,
  buildSort,
  seriesToTile,
  bookToHighlight,
  Sort,
  convertSort,
} from "../utils";
import {
  getBooks2,
  getBooksForSeries,
  getHost,
  getSeriesForLibrary,
} from "../api";
import { KomgaStore } from "../store";

/**
 * Implementation of the DirectoryHandler Methods
 */
export const KomgaDirectoryHandler: DirectoryHandler = {
  getDirectory: function (request: DirectoryRequest): Promise<PagedResult> {
    return fetchDirectory(request);
  },
  getDirectoryConfig: async function (
    _: string | undefined
  ): Promise<DirectoryConfig> {
    return buildDirectoryConfig();
  },
};

/**
 * Builds the Directory View Sort Options & Filters
 */
function buildDirectoryConfig(): DirectoryConfig {
  return {
    searchable: true,
    filters: FilterOptions,
    sort: {
      options: SortOptions,
      canChangeOrder: true,
    },
  };
}

type IResponse = Promise<PagedResult>;
async function fetchDirectory(request: DirectoryRequest): IResponse {
  const filters: FilterItems = request.filters ?? {};
  const seriesId = request.context?.seriesId;
  const libraryId = request.context?.libraryId;

  const host = await getHost();
  if (!host) {
    throw new Error("Host not defined");
  }
  const asTitle = await KomgaStore.openSeriesAsTitle();

  if (seriesId) {
    const sort = convertSort(request.sort?.id) ?? Sort.Number;
    const result = await getBooksForSeries(
      seriesId,
      buildSort(sort, request.sort?.ascending),
      filters,
      request.page
    );
    return {
      results: result.items,
      isLastPage: result.isLastPage,
    };
  } else if (libraryId) {
    const sort = convertSort(request.sort?.id) ?? Sort.DateUpdated;
    const results = (
      await getSeriesForLibrary(
        libraryId,
        buildSort(sort, request.sort?.ascending),
        filters,
        request.page,
        request.query
      )
    ).map((v) => seriesToTile(v, host, !(asTitle ?? false)));
    return {
      results,
      isLastPage: results.length < RESULT_COUNT,
    };
  }

  const isSeriesDirectory = request.context?.isSeriesDirectory ?? false;
  if (isSeriesDirectory) {
    const sort = convertSort(request.sort?.id) ?? Sort.DateUpdated;
    const results = (
      await getSeriesForLibrary(
        libraryId,
        buildSort(sort, request.sort?.ascending),
        filters,
        request.page,
        request.query
      )
    ).map((v) => seriesToTile(v, host, !(asTitle ?? false)));
    return {
      results,
      isLastPage: results.length < RESULT_COUNT,
    };
  } else {
    const sort = convertSort(request.sort?.id) ?? Sort.DateAdded;
    const results = (
      await getBooks2(
        request.page,
        buildSort(sort, request.sort?.ascending),
        filters,
        request.query
      )
    ).map((v) => bookToHighlight(v, host));
    return {
      results,
      isLastPage: results.length < RESULT_COUNT,
    };
  }
}
