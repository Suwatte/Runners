import { ContentProgressState, ProgressSyncHandler } from "@suwatte/daisuke";
import { request } from "../api";
import { SORTS, buildSort, genURL } from "../utils";
import { PageBookDto } from "../types";

export const KomgaProgressProvider: ProgressSyncHandler = {
  getProgressState: async function (
    seriesId: string
  ): Promise<ContentProgressState> {
    const { content: data } = await request<PageBookDto>({
      url: await genURL(`/api/v1/series/${seriesId}/books`),
      params: {
        page: 0,
        size: 2,
        sort: buildSort(SORTS.readProgress, false),
      },
    });

    if (!data || !data.length) return {};

    const [target] = data;

    if (!target.readProgress) return {};

    // This method will only be used to sync progress from Komga to Suwatte
    return {
      currentReadingState: {
        chapterId: target.id,
        page: target.readProgress.page ?? 0,
        readDate: new Date(target.readProgress.readDate),
        progress:
          Math.round(
            (target.readProgress.page / target.media.pagesCount) * 100
          ) / 100,
      },
    };
  },
};
