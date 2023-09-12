import { TrackStatus } from "@suwatte/daisuke";
import { AnilistTag } from "./utils/media";

export type FormProps = {
  score?: number | string;
  progress?: number;
  progressVolume?: number;
  repeat?: number;
  private?: boolean;
  notes?: string | null;
  hiddenFromStatusList?: boolean;
  customLists?: string[];
  startedAt?: string | null;
  completedAt?: string | null;
};

export type FuzzyDate = {
  year?: number;
  month: number;
  day: number;
};

export type MediaListEntry = {
  status: TrackStatus;
  score?: number;
  progress: number;
  progressVolumes?: number;
  startedAt?: FuzzyDate;
  completedAt?: FuzzyDate;
  repeat: number;
  private: boolean;
  hiddenFromStatusLists: boolean;
  customLists: { name: string; enabled: boolean }[];
  notes?: string;
};

export type Media = {
  id: number;
  title: {
    userPreferred: string;
  };
  coverImage: {
    large: string;
  };
  chapters?: number;
  volumes?: number;
  mediaListEntry?: MediaListEntry;
  isAdult?: boolean;
  type?: "MANGA" | "ANIME";
};

export type MediaListEntryQueryResponse = {
  data: {
    Media: Media;
  };
};

export type SimpleSearchResponse = {
  data: {
    Page?: {
      media: Media[];
    };
  };
};

export type CurrentViewerResponse = {
  data: {
    Viewer: {
      id: number;
      name: string;
      avatar: {
        large: string;
      };
      bannerImage?: string;
      mediaListOptions: {
        mangaList: {
          sectionOrder: string[];
        };
      };
    };
  };
};

export type MediaObject = { media: Media[] };
type MediaMap = {
  [key: string]: MediaObject;
};
export type HomePageResponse = {
  data: MediaMap;
};

export type MediaListCollectionResponse = {
  data: {
    MediaListCollection: {
      lists: {
        name: string;
        entries: {
          media: Media;
          progress: number;
          progressVolume?: number;
          status: TrackStatus;
        }[];
      }[];
    };
  };
};

export type FullMediaResponse = {
  data: {
    Media: FullMediaObject;
  };
};

export type FullMediaObject = Media & {
  description?: string;
  bannerImage?: string;
  genres?: string[];
  synonyms?: string[];
  tags?: AnilistTag[];
  isFavourite?: boolean;
  externalLinks?: { url: string; site: string }[];
  recommendations?: {
    nodes?: { mediaRecommendation: Media }[];
  };
  siteUrl?: string;
  countryOfOrigin?: "JP" | "KR";
  averageScore?: number;
  popularity?: number;
  favourites?: number;
  trending?: number;
  relations?: {
    nodes?: Media[];
  };
  status?: string;
  characters?: {
    nodes?: {
      name: { userPreferred: string };
      image: { medium: string };
      description?: string;
    }[];
  };
};
