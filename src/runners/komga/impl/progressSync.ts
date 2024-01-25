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
        size: 999,
        sort: buildSort(SORTS.readProgress, false),
      },
    });

    if (!data || !data.length) return {};

    const [target] = data;
    const readChapterIds = data
      .filter((v) => v.readProgress?.completed === true)
      .map((v) => v.id);

    if (!target.readProgress)
      return {
        readChapterIds,
      };

    // This method will only be used to sync progress from Komga to Suwatte
    return {
      readChapterIds,
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
