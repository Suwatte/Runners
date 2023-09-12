import {
  ExcludableMultiSelectProp,
  Option,
  PublicationStatus,
} from "@suwatte/daisuke";

const sortKeys = [
  "Popularity",
  "Trending",
  "Favourites",
  "Score",
  "Search Match",
  "Chapters",
];

export const getSortOptions = (): Option[] => {
  return sortKeys.map((v) => ({
    label: v,
    key: v.replace(" ", "_").toUpperCase(),
  }));
};

export const getSortKey = (key: string, ascending: boolean) =>
  ascending ? key : `${key}_DESC`;

export const convertSTTFilter = (filters: {
  [key: string]: ExcludableMultiSelectProp;
}) => {
  const object: Record<string, string[]> = {};
  for (const key in filters) {
    const { included, excluded } = filters[key];
    switch (key) {
      case "genres": {
        if (included && included.length != 0)
          object.genres = filters[key].included;

        if (excluded && excluded.length != 0)
          object.excludedGenres = filters[key].excluded;
        break;
      }

      default: {
        object.tags = object.tags || [];
        object.tags.push(...included);

        object.excludedTags = object.excludedTags || [];
        object.excludedTags.push(...excluded);
        break;
      }
    }
  }

  return object;
};

export const convertStatus = (key: string) => {
  switch (key) {
    case "FINISHED":
      return PublicationStatus.COMPLETED;
    case "RELEASING":
      return PublicationStatus.ONGOING;
    case "NOT_YET_RELEASED":
      return PublicationStatus.UNKNOWN;
    case "HIATUS":
      return PublicationStatus.HIATUS;
  }

  return;
};
