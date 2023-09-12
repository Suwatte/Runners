export const CurrentViewerQuery = `
query CurrentUser {
    Viewer {
    id
    name
    about
    avatar {
        large
    }
    bannerImage
    mediaListOptions {
      scoreFormat
      rowOrder
      mangaList {
        customLists
        sectionOrder
        }
      }
    }
}`;
export const CurrentViewerScoreFormatQuery = `
query ScoreFormat {
      Viewer {
        mediaListOptions {
          scoreFormat
        }
      }
    }
`;
export const MediaListEntryQuery = `
query ($id: Int) {
    Media(id: $id) {
    id
    title {
        userPreferred
    }
    coverImage {
        large
    }
    chapters
    volumes
    mediaListEntry {
        status
        score(format: POINT_100)
        progress
        progressVolumes
        repeat
        private
        notes
        hiddenFromStatusLists
        customLists(asArray: true)
        startedAt {
            year
            month
            day
        }
        completedAt {
            year
            month
            day
            }
        }
    }
}`;

export const SimpleSearchQuery = `
query SimpleSearch ($search: String, $isAdult: Boolean) {
      Page(perPage: 30) {
        media(search: $search, type: MANGA, isAdult: $isAdult) {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
        }
      }
    }`;

const MediaFragment = `
fragment media on Media {
  id
  title {
    userPreferred
  }
  coverImage {
    large
  }
  type
  isAdult
  mediaListEntry {
    status
    progress
    progressVolumes
  }
}
  `;
export const HomePageQuery = `
query HomePageQuery {
  trending: Page(page: 1, perPage: 15) {
    media(sort: TRENDING_DESC, type: MANGA, isAdult: false) {
      ...media
    }
  }
  popular: Page(page: 1, perPage: 15) {
    media(sort: POPULARITY_DESC, type: MANGA, isAdult: false) {
      ...media
    }
  }
  
  manhwa: Page(page: 1, perPage: 15) {
    media(
      sort: POPULARITY_DESC
      type: MANGA
      countryOfOrigin: "KR"
      isAdult: false
    ) {
      ...media
    }
  }

  manga:  Page(page: 1, perPage: 15) {
    media(
      sort: POPULARITY_DESC
      type: MANGA
      countryOfOrigin: "JP"
      isAdult: false
    ) {
      ...media
    }
  }
  top: Page(page: 1, perPage: 15) {
    media(sort: SCORE_DESC, type: MANGA, isAdult: false) {
      ...media
    }
  }
}

${MediaFragment}
`;

export const HomePageViewMoreQuery = (key: string) => `
query HomePageViewMoreQuery ($page: Int){

  ${key}: Page(page: $page, perPage: 30) {
        media(sort: ${
          key === "trending"
            ? "TRENDING_DESC"
            : key === "top"
            ? "SCORE_DESC"
            : "POPULARITY_DESC"
        }, type: MANGA, isAdult: false ${
          ["manga", "manhwa"].includes(key)
            ? key === "manga"
              ? `,countryOfOrigin: "JP"`
              : `,countryOfOrigin: "KR" `
            : ""
        }) {
      ...media
    }
  }
}  
  ${MediaFragment}

`;

export const MediaListCollectionQuery = `
query ($userName: String) {
  MediaListCollection(userName: $userName, type: MANGA) {
    lists {
      name
      isCustomList
      isCompletedList: isSplitCompletedList
      entries {
        ...mediaListEntry
      }
    }
  }
}
fragment mediaListEntry on MediaList {
  id
  mediaId
  status
  progress
  progressVolumes
  media {
    ...media
  }
}

 ${MediaFragment}
`;

export const FullMediaQuery = `
query ($id: Int) {
  Media(id: $id) {
    id
    title {
      userPreferred
    }
    coverImage {
      large
    }
    mediaListEntry {
      status
      progress
      progressVolumes
    }
    chapters
    volumes
    isAdult
    description(asHtml: true)
    status(version:2)
    bannerImage
    genres
    synonyms
    tags {
      id
      name
      category
    }
    isFavourite
    externalLinks {
      id
      url
			site
    }
    recommendations(page: 1, perPage:20, sort: [RATING_DESC]) {
      nodes {
        mediaRecommendation {
          ...media
        }
      }
    }
    siteUrl
    countryOfOrigin
    averageScore
    popularity
    favourites
    trending
    relations {
      nodes {
        ...media
      }
    }
    characters {
      nodes {
        name {
          userPreferred
        }
        image {
          medium
        }
      }
    }
  }
}

${MediaFragment}
`;

export const FullSearchQuery = `
    query FullSearch($page: Int = 1, $id: Int, $type: MediaType = MANGA, $isAdult: Boolean, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [String], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
      Page(page: $page, perPage: 30) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedBy_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
          ...media
        }
      }
    }
    ${MediaFragment}

`;

export const GenresQuery = `
    query {
      genres: GenreCollection
      tags: MediaTagCollection {
        name
        description
        category
        isAdult
      }
    }`;
