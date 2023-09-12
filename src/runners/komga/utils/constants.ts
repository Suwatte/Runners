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
    key: "metadata.numberSort",
    label: "Issue Number",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "readProgress.readDate",
    label: "Reading Progress",
  },
  {
    key: "metadata.releaseDate",
    label: "Release Date",
  },
  {
    key: "createdDate",
    label: "Creation Date",
  },
];
export const RESULT_COUNT = 30;
export const DEFAULT_SORT = "metadata.numberSort";
