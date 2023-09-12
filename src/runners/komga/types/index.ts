/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TachiyomiReadProgressUpdateV2Dto {
  /** @format float */
  lastBookNumberSortRead: number;
}

export interface TachiyomiReadProgressUpdateDto {
  /** @format int32 */
  lastBookRead: number;
}

export interface PageHashCreationDto {
  hash: string;
  /** @format int64 */
  size?: number;
  action: "DELETE_AUTO" | "DELETE_MANUAL" | "IGNORE";
}

export interface LibraryUpdateDto {
  name: string;
  root: string;
  importComicInfoBook: boolean;
  importComicInfoSeries: boolean;
  importComicInfoCollection: boolean;
  importComicInfoReadList: boolean;
  importComicInfoSeriesAppendVolume: boolean;
  importEpubBook: boolean;
  importEpubSeries: boolean;
  importMylarSeries: boolean;
  importLocalArtwork: boolean;
  importBarcodeIsbn: boolean;
  scanForceModifiedTime: boolean;
  repairExtensions: boolean;
  convertToCbz: boolean;
  emptyTrashAfterScan: boolean;
  seriesCover:
    | "FIRST"
    | "FIRST_UNREAD_OR_FIRST"
    | "FIRST_UNREAD_OR_LAST"
    | "LAST";
  hashFiles: boolean;
  hashPages: boolean;
  analyzeDimensions: boolean;
}

export interface UserCreationDto {
  email: string;
  password: string;
  roles: string[];
}

export interface AgeRestrictionDto {
  /** @format int32 */
  age: number;
  restriction: "ALLOW_ONLY" | "EXCLUDE";
}

export interface UserDto {
  id: string;
  email: string;
  /** @uniqueItems true */
  roles: string[];
  sharedAllLibraries: boolean;
  /** @uniqueItems true */
  sharedLibrariesIds: string[];
  /** @uniqueItems true */
  labelsAllow: string[];
  /** @uniqueItems true */
  labelsExclude: string[];
  ageRestriction?: AgeRestrictionDto;
}

export interface ScanRequestDto {
  path: string;
}

export interface PageDto {
  /** @format int32 */
  number: number;
  fileName: string;
  mediaType: string;
  /** @format int32 */
  width?: number;
  /** @format int32 */
  height?: number;
  /** @format int64 */
  sizeBytes?: number;
  size: string;
}

export interface TransientBookDto {
  id: string;
  name: string;
  url: string;
  /** @format date-time */
  fileLastModified: string;
  /** @format int64 */
  sizeBytes: number;
  size: string;
  status: string;
  mediaType: string;
  pages: PageDto[];
  files: string[];
  comment: string;
}

export interface SeriesThumbnailDto {
  id: string;
  seriesId: string;
  type: string;
  selected: boolean;
}

export interface ReadListCreationDto {
  name: string;
  summary: string;
  ordered: boolean;
  bookIds: string[];
}

export interface ReadListDto {
  id: string;
  name: string;
  summary: string;
  ordered: boolean;
  bookIds: string[];
  /** @format date-time */
  createdDate: string;
  /** @format date-time */
  lastModifiedDate: string;
  filtered: boolean;
}

export interface ThumbnailReadListDto {
  id: string;
  readListId: string;
  type: string;
  selected: boolean;
}

export interface ReadListMatchDto {
  name: string;
  errorCode: string;
}

export interface ReadListRequestBookDto {
  /** @uniqueItems true */
  series: string[];
  number: string;
}

export interface ReadListRequestBookMatchBookDto {
  bookId: string;
  number: string;
  title: string;
}

export interface ReadListRequestBookMatchDto {
  series: ReadListRequestBookMatchSeriesDto;
  books: ReadListRequestBookMatchBookDto[];
}

export interface ReadListRequestBookMatchSeriesDto {
  seriesId: string;
  title: string;
  /** @format date */
  releaseDate?: string;
}

export interface ReadListRequestBookMatchesDto {
  request: ReadListRequestBookDto;
  matches: ReadListRequestBookMatchDto[];
}

export interface ReadListRequestMatchDto {
  readListMatch: ReadListMatchDto;
  requests: ReadListRequestBookMatchesDto[];
  errorCode: string;
}

export interface PageHashMatchDto {
  bookId: string;
  url: string;
  /** @format int32 */
  pageNumber: number;
  fileName: string;
  /** @format int64 */
  fileSize: number;
  mediaType: string;
}

export interface LibraryCreationDto {
  name: string;
  root: string;
  importComicInfoBook: boolean;
  importComicInfoSeries: boolean;
  importComicInfoCollection: boolean;
  importComicInfoReadList: boolean;
  importComicInfoSeriesAppendVolume: boolean;
  importEpubBook: boolean;
  importEpubSeries: boolean;
  importMylarSeries: boolean;
  importLocalArtwork: boolean;
  importBarcodeIsbn: boolean;
  scanForceModifiedTime: boolean;
  repairExtensions: boolean;
  convertToCbz: boolean;
  emptyTrashAfterScan: boolean;
  seriesCover:
    | "FIRST"
    | "FIRST_UNREAD_OR_FIRST"
    | "FIRST_UNREAD_OR_LAST"
    | "LAST";
  hashFiles: boolean;
  hashPages: boolean;
  analyzeDimensions: boolean;
}

export interface LibraryDto {
  id: string;
  name: string;
  root: string;
  importComicInfoBook: boolean;
  importComicInfoSeries: boolean;
  importComicInfoCollection: boolean;
  importComicInfoReadList: boolean;
  importComicInfoSeriesAppendVolume: boolean;
  importEpubBook: boolean;
  importEpubSeries: boolean;
  importMylarSeries: boolean;
  importLocalArtwork: boolean;
  importBarcodeIsbn: boolean;
  scanForceModifiedTime: boolean;
  repairExtensions: boolean;
  convertToCbz: boolean;
  emptyTrashAfterScan: boolean;
  seriesCover:
    | "FIRST"
    | "FIRST_UNREAD_OR_FIRST"
    | "FIRST_UNREAD_OR_LAST"
    | "LAST";
  hashFiles: boolean;
  hashPages: boolean;
  analyzeDimensions: boolean;
  unavailable: boolean;
}

export interface DirectoryRequestDto {
  path: string;
}

export interface DirectoryListingDto {
  parent?: string;
  directories: PathDto[];
}

export interface PathDto {
  type: string;
  name: string;
  path: string;
}

export interface CollectionCreationDto {
  name: string;
  ordered: boolean;
  seriesIds: string[];
}

export interface CollectionDto {
  id: string;
  name: string;
  ordered: boolean;
  seriesIds: string[];
  /** @format date-time */
  createdDate: string;
  /** @format date-time */
  lastModifiedDate: string;
  filtered: boolean;
}

export interface ThumbnailSeriesCollectionDto {
  id: string;
  collectionId: string;
  type: string;
  selected: boolean;
}

export interface ThumbnailBookDto {
  id: string;
  bookId: string;
  type: string;
  selected: boolean;
}

export interface BookImportBatchDto {
  books: BookImportDto[];
  copyMode: "MOVE" | "COPY" | "HARDLINK";
}

export interface BookImportDto {
  sourceFile: string;
  seriesId: string;
  upgradeBookId?: string;
  destinationName?: string;
}

export interface AgeRestrictionUpdateDto {
  /** @format int32 */
  age: number;
  restriction: "ALLOW_ONLY" | "EXCLUDE";
}

export interface SharedLibrariesUpdateDto {
  all: boolean;
  /** @uniqueItems true */
  libraryIds: string[];
}

export interface UserUpdateDto {
  /** @uniqueItems true */
  roles?: string[];
  /** @uniqueItems true */
  labelsAllow?: string[];
  /** @uniqueItems true */
  labelsExclude?: string[];
  ageRestriction?: AgeRestrictionUpdateDto;
  sharedLibraries?: SharedLibrariesUpdateDto;
}

export interface PasswordUpdateDto {
  password: string;
}

export interface AlternateTitleUpdateDto {
  label: string;
  title: string;
}

/** Metadata fields to update. Set a field to null to unset the metadata. You can omit fields you don't want to update. */
export interface SeriesMetadataUpdateDto {
  status?: "ENDED" | "ONGOING" | "ABANDONED" | "HIATUS";
  statusLock?: boolean;
  title?: string;
  titleLock?: boolean;
  titleSort?: string;
  titleSortLock?: boolean;
  summary?: string;
  summaryLock?: boolean;
  publisher?: string;
  publisherLock?: boolean;
  readingDirectionLock?: boolean;
  ageRatingLock?: boolean;
  language?: string;
  languageLock?: boolean;
  genresLock?: boolean;
  tagsLock?: boolean;
  totalBookCountLock?: boolean;
  sharingLabelsLock?: boolean;
  linksLock?: boolean;
  alternateTitlesLock?: boolean;
  /** @uniqueItems true */
  tags?: string[];
  readingDirection?: "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT" | "VERTICAL" | "WEBTOON";
  /** @format int32 */
  ageRating?: number;
  /** @format int32 */
  totalBookCount?: number;
  links?: WebLinkUpdateDto[];
  /** @uniqueItems true */
  genres?: string[];
  /** @uniqueItems true */
  sharingLabels?: string[];
  alternateTitles?: AlternateTitleUpdateDto[];
}

export interface WebLinkUpdateDto {
  label: string;
  url?: string;
}

export interface ReadListUpdateDto {
  name?: string;
  summary?: string;
  bookIds?: string[];
  ordered?: boolean;
}

export interface CollectionUpdateDto {
  name?: string;
  ordered?: boolean;
  seriesIds?: string[];
}

/** page can be omitted if completed is set to true. completed can be omitted, and will be set accordingly depending on the page passed and the total number of pages in the book. */
export interface ReadProgressUpdateDto {
  /** @format int32 */
  page?: number;
  completed?: boolean;
}

export interface AuthorUpdateDto {
  name: string;
  role: string;
}

/** Metadata fields to update. Set a field to null to unset the metadata. You can omit fields you don't want to update. */
export interface BookMetadataUpdateDto {
  title?: string;
  titleLock?: boolean;
  summaryLock?: boolean;
  number?: string;
  numberLock?: boolean;
  /** @format float */
  numberSort?: number;
  numberSortLock?: boolean;
  releaseDateLock?: boolean;
  authorsLock?: boolean;
  tagsLock?: boolean;
  isbnLock?: boolean;
  linksLock?: boolean;
  /** @uniqueItems true */
  tags?: string[];
  /** @format date */
  releaseDate?: string;
  isbn?: string;
  links?: WebLinkUpdateDto[];
  authors?: AuthorUpdateDto[];
  summary?: string;
}

export interface AuthenticationActivityDto {
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
  /** @format date-time */
  dateTime: string;
  source?: string;
}

export interface PageAuthenticationActivityDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: AuthenticationActivityDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface PageableObject {
  /** @format int64 */
  offset?: number;
  sort?: SortObject;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
  paged?: boolean;
  unpaged?: boolean;
}

export interface SortObject {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface TachiyomiReadProgressV2Dto {
  /** @format int32 */
  booksCount: number;
  /** @format int32 */
  booksReadCount: number;
  /** @format int32 */
  booksUnreadCount: number;
  /** @format int32 */
  booksInProgressCount: number;
  /** @format float */
  lastReadContinuousNumberSort: number;
  /** @format float */
  maxNumberSort: number;
}

export interface AuthorDto {
  name: string;
  role: string;
}

export interface PageAuthorDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: AuthorDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface AlternateTitleDto {
  label: string;
  title: string;
}

export interface BookMetadataAggregationDto {
  authors: AuthorDto[];
  /** @uniqueItems true */
  tags: string[];
  /** @format date */
  releaseDate?: string;
  summary: string;
  summaryNumber: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface PageSeriesDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: SeriesDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface SeriesDto {
  id: string;
  libraryId: string;
  name: string;
  url: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
  /** @format date-time */
  fileLastModified: string;
  /** @format int32 */
  booksCount: number;
  /** @format int32 */
  booksReadCount: number;
  /** @format int32 */
  booksUnreadCount: number;
  /** @format int32 */
  booksInProgressCount: number;
  metadata: SeriesMetadataDto;
  booksMetadata: BookMetadataAggregationDto;
  deleted: boolean;
}

export interface SeriesMetadataDto {
  status: string;
  statusLock: boolean;
  title: string;
  titleLock: boolean;
  titleSort: string;
  titleSortLock: boolean;
  summary: string;
  summaryLock: boolean;
  readingDirection: string;
  readingDirectionLock: boolean;
  publisher: string;
  publisherLock: boolean;
  /** @format int32 */
  ageRating?: number;
  ageRatingLock: boolean;
  language: string;
  languageLock: boolean;
  /** @uniqueItems true */
  genres: string[];
  genresLock: boolean;
  /** @uniqueItems true */
  tags: string[];
  tagsLock: boolean;
  /** @format int32 */
  totalBookCount?: number;
  totalBookCountLock: boolean;
  /** @uniqueItems true */
  sharingLabels: string[];
  sharingLabelsLock: boolean;
  links: WebLinkDto[];
  linksLock: boolean;
  alternateTitles: AlternateTitleDto[];
  alternateTitlesLock: boolean;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface WebLinkDto {
  label: string;
  url: string;
}

export type StreamingResponseBody = object;

export interface BookDto {
  id: string;
  seriesId: string;
  seriesTitle: string;
  libraryId: string;
  name: string;
  url: string;
  /** @format int32 */
  number: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
  /** @format date-time */
  fileLastModified: string;
  /** @format int64 */
  sizeBytes: number;
  size: string;
  media: MediaDto;
  metadata: BookMetadataDto;
  readProgress?: ReadProgressDto;
  deleted: boolean;
  fileHash: string;
}

export interface BookMetadataDto {
  title: string;
  titleLock: boolean;
  summary: string;
  summaryLock: boolean;
  number: string;
  numberLock: boolean;
  /** @format float */
  numberSort: number;
  numberSortLock: boolean;
  /** @format date */
  releaseDate?: string;
  releaseDateLock: boolean;
  authors: AuthorDto[];
  authorsLock: boolean;
  /** @uniqueItems true */
  tags: string[];
  tagsLock: boolean;
  isbn: string;
  isbnLock: boolean;
  links: WebLinkDto[];
  linksLock: boolean;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface MediaDto {
  status: string;
  mediaType: string;
  /** @format int32 */
  pagesCount: number;
  comment: string;
}

export interface PageBookDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: BookDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface ReadProgressDto {
  /** @format int32 */
  page: number;
  completed: boolean;
  /** @format date-time */
  readDate: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface GroupCountDto {
  group: string;
  /** @format int32 */
  count: number;
}

export interface PageReadListDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: ReadListDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface TachiyomiReadProgressDto {
  /** @format int32 */
  booksCount: number;
  /** @format int32 */
  booksReadCount: number;
  /** @format int32 */
  booksUnreadCount: number;
  /** @format int32 */
  booksInProgressCount: number;
  /** @format int32 */
  lastReadContinuousIndex: number;
}

export interface PageHashKnownDto {
  hash: string;
  /** @format int64 */
  size?: number;
  action: "DELETE_AUTO" | "DELETE_MANUAL" | "IGNORE";
  /** @format int32 */
  deleteCount: number;
  /** @format int32 */
  matchCount: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface PagePageHashKnownDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: PageHashKnownDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface PagePageHashMatchDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: PageHashMatchDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface PageHashUnknownDto {
  hash: string;
  /** @format int64 */
  size?: number;
  /** @format int32 */
  matchCount: number;
}

export interface PagePageHashUnknownDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: PageHashUnknownDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface HistoricalEventDto {
  type: string;
  /** @format date-time */
  timestamp: string;
  bookId?: string;
  seriesId?: string;
  properties: Record<string, string>;
}

export interface PageHistoricalEventDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: HistoricalEventDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface PageCollectionDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: CollectionDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  last?: boolean;
  empty?: boolean;
}

export interface ClaimStatus {
  isClaimed: boolean;
}

export interface ItemDto {
  id: string;
  url?: string;
  title?: string;
  summary?: string;
  content_html?: string;
  /** @format date-time */
  date_modified?: string;
  author?: AuthorDto;
  /** @uniqueItems true */
  tags: string[];
  _komga?: KomgaExtensionDto;
}

export interface JsonFeedDto {
  version: string;
  title: string;
  home_page_url?: string;
  description?: string;
  items: ItemDto[];
}

export interface KomgaExtensionDto {
  read: boolean;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}
