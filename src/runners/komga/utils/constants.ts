import { Option } from "@suwatte/daisuke";

export const SORTS = {
  readProgress: "readProgress.readDate",
  releaseDate: "metadata.releaseDate",
  creationDate: "createdDate",
  number: "metadata.numberSort",
  name: "name",
};

export const SortOptions: Option[] = [
  {
    id: "metadata.numberSort",
    title: "Issue Number",
  },
  {
    id: "name",
    title: "Name",
  },
  {
    id: "readProgress.readDate",
    title: "Reading Progress",
  },
  {
    id: "metadata.releaseDate",
    title: "Release Date",
  },
  {
    id: "createdDate",
    title: "Creation Date",
  },
];
export const RESULT_COUNT = 30;
export const DEFAULT_SORT = "metadata.numberSort";
