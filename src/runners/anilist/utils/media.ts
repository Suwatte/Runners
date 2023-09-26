import {
  DirectoryFilter,
  DirectoryRequest,
  FilterType,
  FullTrackItem,
  Highlight,
  PageSection,
  PagedResult,
  Tag,
} from "@suwatte/daisuke";
import { request, parseID } from ".";
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
import { mediaToFullTrackItem, mediaToHighlight } from "./parsers";
import { convertSTTFilter, getSortKey } from "./utils";
import { getNSFWSetting } from "./store";

export const getSearchResults = async (titles: string[]) => {
  for (const title of titles) {
    let results = await simpleSearch(title);
    if (results.length == 0) continue;

    return results;
  }
  return [];
};

export const simpleSearch = async (search: string): Promise<Highlight[]> => {
  const nsfw = await getNSFWSetting();
  const {
    data: { Page },
  } = await request<SimpleSearchResponse>(SimpleSearchQuery, {
    search,
    ...(!nsfw && { isAdult: false }),
  });

  const media = Page?.media;

  if (!media) return [];

  return media.map(mediaToHighlight);
};

const TITLES: Record<string, string> = {
  trending: "Trending Titles",
  popular: "Popular Titles",
  manhwa: "Top Manhwa",
  manga: "Top Manga",
  top: "Top 100",
};

export const getHomePage = async (): Promise<PageSection[]> => {
  const { data } = await request<HomePageResponse>(HomePageQuery);

  return Object.keys(data).map((id) => ({
    id,
    title: TITLES[id],
    items: data[id].media.map(mediaToHighlight),
    viewMoreLink: {
      request: { context: { discover: id }, page: 1, configID: "viewMore" },
    },
  }));
};

export const getHomePageViewMore = async (
  key: string,
  page: number
): Promise<PagedResult> => {
  const { data } = await request<HomePageResponse>(HomePageViewMoreQuery(key), {
    page,
  });

  const results = data[key]!.media.map(mediaToHighlight);
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
    ? [getSortKey(query.sort.id, query.sort.ascending ?? false), "SCORE_DESC"]
    : ["POPULARITY_DESC", "SCORE_DESC"];

  const allowNSFW = await getNSFWSetting();

  const variables = {
    page: query.page,
    search: query.query,
    sort,
    ...(query.filters && convertSTTFilter(query.filters)),
    ...(!query.filters && { excludedGenres: ["Hentai"] }),
    ...(query.tag && {
      ...(query.tag.propertyId === "genres" && { genres: [query.tag.tagId] }),
      ...(query.tag.propertyId !== "genres" && { tags: [query.tag.tagId] }),
    }),
    ...(!allowNSFW && { isAdult: false }),
  };

  const {
    data: { Page },
  } = await request<SimpleSearchResponse>(FullSearchQuery, variables);

  const media = Page?.media;

  if (!media) return [];
  const results = media.map(mediaToHighlight);
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
    type: FilterType.EXCLUDABLE_MULTISELECT,
    options: genres
      .map((v) => ({ id: v, title: v }))
      .filter((v) => v.id !== "Hentai"),
  };

  const tagFilters: DirectoryFilter[] = [];
  // reference:  https://stackoverflow.com/a/40774906
  const groupedTags: GroupedAnilistTag = groupTags(tags);

  for (const key in groupedTags) {
    const tags = groupedTags[key];
    const options = tags.map((v) => ({ id: v.name, title: v.name }));

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
