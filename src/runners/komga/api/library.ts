import { Chapter, Highlight } from "@suwatte/daisuke";
import { request } from ".";
import {
  BookDto,
  LibraryDto,
  PageBookDto,
  PageSeriesDto,
  SeriesDto,
} from "../types";
import { getHost } from "./auth";
import {
  DEFAULT_SORT,
  RESULT_COUNT,
  SORTS,
  bookToChapter,
  bookToHighlight,
  buildSort,
  genURL,
} from "../utils";

/**
 * Returns all libraries created by the user.
 */
export const getUserLibraries = async () => {
  const data = await request<LibraryDto[]>({
    url: await genURL("/api/v1/libraries"),
  });

  return data;
};

/**
 * Gets All Books within a library
 */
export const getBooksForLibrary = async (
  library_id: string | null,
  sort: string,
  status?: "UNREAD" | "READ" | "IN_PROGRESS"
) => {
  const { content: data } = await request<PageBookDto>({
    url: await genURL("/api/v1/books"),
    params: {
      sort,
      read_status: status,
      ...(library_id && { library_id }),
    },
  });
  const host = await getHost();
  const highlights: Highlight[] = (data ?? []).map((book) =>
    bookToHighlight(book, host)
  );

  return highlights;
};

/**
 * Gets all series within a library
 */
export const getSeriesForLibraryWithState = async (
  library_id: string | null,
  state: string
) => {
  const body = {
    url: await genURL(`/api/v1/series/${state}`),
    params: {
      ...(library_id && { library_id }),
    },
  };
  const { content: data } = await request<PageSeriesDto>(body);

  return data ?? [];
};

export const getSeriesForLibrary = async (
  library_id: string,
  sort: string,
  page: number,
  search?: string
) => {
  const config = {
    url: await genURL(`/api/v1/series`),
    params: {
      library_id,
      sort,
      page: page - 1,
      size: 30,
      search,
    },
  };

  const { content: data } = await request<PageSeriesDto>(config);

  return data ?? [];
};

/**
 * Get books within a series
 */
export const getBooksForSeries = async (
  series: string,
  sort: string,
  page: number
) => {
  const { content: data, last } = await request<PageBookDto>({
    url: await genURL(`/api/v1/series/${series}/books`),
    params: {
      page: page - 1,
      size: RESULT_COUNT,
      sort,
    },
  });
  const host = await getHost();

  const items: Highlight[] = (data ?? []).map((book) =>
    bookToHighlight(book, host)
  );

  return {
    isLastPage: last ?? true,
    items,
  };
};

export const getBooksForSeriesAsChapters = async (series: string) => {
  const { content: data } = await request<PageBookDto>({
    url: await genURL(`/api/v1/series/${series}/books`),
    params: {
      page: 0,
      size: 9999,
      sort: buildSort(SORTS.number, false),
    },
  });
  const host = await getHost();

  const items: Chapter[] = (data ?? []).map((book, idx) =>
    bookToChapter(book, host, idx)
  );

  return items;
};

export const getBook = async (id: string) => {
  return request<BookDto>({
    url: await genURL(`/api/v1/books/${id}`),
  });
};

export const getSeries = async (id: string) => {
  return request<SeriesDto>({
    url: await genURL(`/api/v1/series/${id}`),
  });
};

export const getBooks = async (
  series: string,
  size: number,
  sort: string = buildSort(DEFAULT_SORT, false)
) => {
  const { content: data } = await request<PageBookDto>({
    url: await genURL(`/api/v1/series/${series}/books`),
    params: {
      page: 0,
      size,
      sort,
    },
  });

  return data ?? [];
};

export const getBooks2 = async (
  page: number,
  sort: string,
  search?: string
) => {
  const { content: data } = await request<PageBookDto>({
    url: await genURL(`/api/v1/books`),
    params: {
      page: page - 1,
      size: RESULT_COUNT,
      sort,
      search,
    },
  });

  return data ?? [];
};
