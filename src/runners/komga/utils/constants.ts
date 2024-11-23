import { DirectoryFilter, FilterType, Option } from "@suwatte/daisuke";

export enum DirectoryType {
  Series = "SERIES",
  Library = "LIBRARY",
}

export enum Sort {
  Name = "metadata.titleSort",
  DateAdded = "createdDate",
  DateUpdated = "lastModifiedDate",
  ReleaseDate = "booksMetadata.releaseDate",
  FolderName = "name",
  BooksCount = "booksCount",
  ReadDate = "readProgress.readDate",
  Number = "metadata.numberSort",
}

export const SortOptions: Option[] = [
  {
    id: Sort.Name,
    title: "Name",
  },
  {
    id: Sort.DateAdded,
    title: "Date Added",
  },
  {
    id: Sort.DateUpdated,
    title: "Date Updated",
  },
  {
    id: Sort.ReleaseDate,
    title: "Release Date",
  },
  {
    id: Sort.FolderName,
    title: "Folder Name",
  },
  {
    id: Sort.BooksCount,
    title: "Books Count",
  },
];
export const RESULT_COUNT = 30;

export enum SeriesStatus {
  Ended = "ENDED",
  Ongoing = "ONGOING",
  Abandoned = "ABANDONED",
  Hiatus = "HIATUS",
}

export enum ReadStatus {
  Unread = "UNREAD",
  InProgress = "IN_PROGRESS",
  Read = "READ",
}

export type FilterItems = Record<string, string[]>;

export const FilterOptions: DirectoryFilter[] = [
  {
    id: "read_status",
    title: "Read Status",
    type: FilterType.MULTISELECT,
    options: [
      {
        id: ReadStatus.Unread,
        title: "Unread",
      },
      {
        id: ReadStatus.InProgress,
        title: "In Progress",
      },
      {
        id: ReadStatus.Read,
        title: "Read",
      },
    ],
  },
  {
    id: "status",
    title: "Series Status",
    type: FilterType.MULTISELECT,
    options: [
      {
        id: SeriesStatus.Ended,
        title: "Ended",
      },
      {
        id: SeriesStatus.Ongoing,
        title: "Ongoing",
      },
      {
        id: SeriesStatus.Abandoned,
        title: "Abandoned",
      },
      {
        id: SeriesStatus.Hiatus,
        title: "Hiatus",
      },
    ],
  },
];
