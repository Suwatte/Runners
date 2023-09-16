import {
  Chapter,
  ChapterData,
  ChapterPage,
  Content,
  ContentSource,
} from "@suwatte/daisuke";
import {
  getBooksForSeriesAsChapters,
  getHost,
  getSeries,
  request,
} from "../api";
import { seriesToContent } from "../utils";
import { PageDto } from "../types";

type OmittedKeys = "info" | "getDirectory" | "getDirectoryConfig";
export const KomgaContentSource: Omit<ContentSource, OmittedKeys> = {
  getContent: async function (contentId: string): Promise<Content> {
    // * NOTE: `contentId` in our case will always refer to Series and not Books.
    const series = await getSeries(contentId);
    return seriesToContent(series);
  },
  getChapters: async function (contentId: string): Promise<Chapter[]> {
    return getBooksForSeriesAsChapters(contentId);
  },
  getChapterData: async function (
    _contentId: string,
    bookId: string
  ): Promise<ChapterData> {
    const host = await getHost();

    const response = await request<PageDto[]>({
      url: `${host}/api/v1/books/${bookId}/pages`,
    });

    const pages: ChapterPage[] = [];

    const STTSupportedImageTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ]);
    for (const page of response) {
      if (STTSupportedImageTypes.has(page.mediaType.toLowerCase())) {
        pages.push({
          url: `${host}/api/v1/books/${bookId}/pages/${page.number}`,
        });
      } else {
        pages.push({
          url: `${host}/api/v1/books/${bookId}/pages/${page.number}?convert=png`,
        });
      }
    }

    return {
      pages,
    };
  },
};
