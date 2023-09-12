import {
  DirectoryFilter,
  DirectoryRequest,
  FilterType,
  FullTrackItem,
  PageItem,
  PageSection,
  PagedResult,
  ResolvedPageSection,
  SectionStyle,
  Tag,
  TrackItem,
} from "@suwatte/daisuke";
import { request, parseWebUrl, parseID } from ".";
import {
  SimpleSearchQuery,
  HomePageQuery,
  HomePageViewMoreQuery,
  FullMediaQuery,
  FullSearchQuery,
  GenresQuery,
} from "../gql";
import {
  SimpleSearchResponse,
  HomePageResponse,
  Media,
  FullMediaResponse,
} from "../types";
import { mediaToFullTrackItem, mediaToTrackItem } from "./parsers";
import { convertSTTFilter, getSortKey } from "./utils";

export const getSearchResults = async (titles: string[]) => {
  for (const title of titles) {
    let results = await simpleSearch(title);
    if (results.length == 0) continue;

    return results;
  }
  return [];
};

export const simpleSearch = async (search: string): Promise<TrackItem[]> => {
  const {
    data: { Page },
  } = await request<SimpleSearchResponse>(SimpleSearchQuery, {
    search,
  });

  const media = Page?.media;

  if (!media) return [];

  return media.map(mediaToTrackItem);
};

const TITLES: Record<string, string> = {
  trending: "Trending Titles",
  popular: "Popular Titles",
  manhwa: "Top Manhwa",
  manga: "Top Manga",
  top: "Top 100",
};

export const getHomePage = async (): Promise<PageSection<TrackItem>[]> => {
  const { data } = await request<HomePageResponse>(HomePageQuery);

  return Object.keys(data).map((key) => ({
    key,
    title: TITLES[key],
    items: data[key].media.map((v) => ({ item: mediaToTrackItem(v) })),
    viewMoreLink: {
      request: { context: { discover: key }, page: 1, configKey: "viewMore" },
    },
  }));
};

export const getHomePageViewMore = async (
  key: string,
  page: number
): Promise<PagedResult<TrackItem>> => {
  const { data } = await request<HomePageResponse>(HomePageViewMoreQuery(key), {
    page,
  });

  const results = data[key]!.media.map(mediaToTrackItem);
  return {
    isLastPage: results.length < 30,
    results,
  };
};

export const getFullMedia = async (id: string): Promise<FullTrackItem> => {
  const {
    data: { Media: media },
  } = await request<FullMediaResponse>(FullMediaQuery, {
    id: parseID(id),
  });

  return mediaToFullTrackItem(media);
};

export const fullSearch = async (query: DirectoryRequest) => {
  const sort = query.sort
    ? [getSortKey(query.sort.key, query.sort.ascending), "SCORE_DESC"]
    : ["POPULARITY_DESC", "SCORE_DESC"];

  const variables = {
    page: query.page,
    search: query.query,
    sort,
    ...(query.filters && convertSTTFilter(query.filters)),
    ...(query.tag && {
      ...(query.tag.propertyId === "genres" && { genres: [query.tag.tagId] }),
      ...(query.tag.propertyId !== "genres" && { tags: [query.tag.tagId] }),
    }),
  };

  const {
    data: { Page },
  } = await request<SimpleSearchResponse>(FullSearchQuery, variables);

  const media = Page?.media;

  if (!media) return [];
  const results = media.map(mediaToTrackItem);
  return results;
};
export type AnilistTag = { category: string; isAdult: boolean; name: string };
export type GroupedAnilistTag = { [key: string]: AnilistTag[] };
export const groupTags = (tags: AnilistTag[]): GroupedAnilistTag =>
  tags.reduce((r, a) => {
    r[a.category] = r[a.category] || [];
    if (!a.isAdult) r[a.category].push(a);
    return r;
  }, Object.create(null));

export const buildGenres = async () => {
  type Res = {
    data: {
      genres: string[];
      tags: AnilistTag[];
    };
  };

  const {
    data: { genres, tags },
  } = await request<Res>(GenresQuery);

  const genreFilter: DirectoryFilter = {
    id: "genres",
    title: "Genres",
    label: "Genres",
    type: FilterType.EXCLUDABLE_MULTISELECT,
    options: genres.map((v) => ({ key: v, label: v })),
  };

  const tagFilters: DirectoryFilter[] = [];
  // reference:  https://stackoverflow.com/a/40774906
  const groupedTags: GroupedAnilistTag = groupTags(tags);

  for (const key in groupedTags) {
    const tags = groupedTags[key];
    const options = tags.map((v) => ({ key: v.name, label: v.name }));

    if (options.length == 0) {
      continue;
    }
    tagFilters.push({
      id: key,
      title: key.replaceAll("-", " "),
      type: FilterType.EXCLUDABLE_MULTISELECT,
      options,
    });
  }

  return [genreFilter, ...tagFilters];
};
