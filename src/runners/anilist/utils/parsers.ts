import { FullTrackItem, Property, TrackItem } from "@suwatte/daisuke";
import { FullMediaObject, Media } from "../types";
import { parseWebUrl } from ".";
import { convertStatus } from "./utils";
import { groupTags } from "./media";

export const mediaToTrackItem = (m: Media): TrackItem => ({
  id: m.id.toString(),
  title: m.title.userPreferred,
  cover: m.coverImage.large,
  webUrl: parseWebUrl(m.id),
  ...(m.mediaListEntry && {
    entry: {
      status: m.mediaListEntry.status,
      progress: {
        lastReadChapter: m.mediaListEntry.progress ?? 0,
        lastReadVolume: m.mediaListEntry.progressVolumes,
        maxAvailableChapter: m.chapters,
      },
    },
  }),
});

export const mediaToFullTrackItem = (
  media: FullMediaObject
): FullTrackItem => ({
  id: media.id.toString(),
  title: media.title.userPreferred,
  cover: media.coverImage.large,
  webUrl: media.siteUrl ?? parseWebUrl(media.id),
  ...(media.mediaListEntry && {
    entry: {
      status: media.mediaListEntry.status,
      progress: {
        lastReadChapter: media.mediaListEntry.progress ?? 0,
        lastReadVolume: media.mediaListEntry.progressVolumes,
        maxAvailableChapter: media.chapters,
      },
    },
  }),
  summary: media.description,
  bannerCover: media.bannerImage,
  isNSFW: media.isAdult,
  isFavorite: media.isFavourite,
  relatedTitles: media.relations?.nodes
    ?.filter((v) => v.type === "MANGA")
    .map(mediaToTrackItem),
  recommendedTitles: media.recommendations?.nodes?.map((v) =>
    mediaToTrackItem(v.mediaRecommendation)
  ),
  links: media.externalLinks?.map((v) => ({ label: v.site, url: v.url })),
  additionalTitles: media.synonyms,
  characters: media.characters?.nodes?.map((v) => ({
    name: v.name.userPreferred,
    image: v.image.medium,
    summary: v.description,
  })),
  status: convertStatus(media.status ?? ""),
  info: [
    `${media.averageScore ?? 0}/100 Rating`,
    `${(media.favourites ?? 0).toLocaleString()} Favorites ❤`,
    `${media.popularity?.toLocaleString()} Users Tracking`,
    `${media.trending?.toLocaleString()} Reads This Hour`,
  ],
  properties: [
    {
      id: "genres",
      label: "Genres",
      tags: media.genres?.map((id) => ({ label: id, id })) ?? [],
    },
    ...Object.entries(groupTags(media.tags ?? [])).map(
      ([id, tags]): Property => {
        return {
          id,
          label: id.replace("-", ": ").replaceAll("-", " "),
          tags: tags.map((v) => ({ id: v.name, label: v.name })),
        };
      }
    ),
  ],
});
