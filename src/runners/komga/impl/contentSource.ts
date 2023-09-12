import {
  Chapter,
  ChapterData,
  Content,
  ContentIdentifier,
  ContentSource,
} from "@suwatte/daisuke";
import {
  getBook,
  getBooksForSeriesAsChapters,
  getHost,
  getSeries,
} from "../api";
import { seriesToContent } from "../utils";

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
    contentId: string,
    chapterId: string
  ): Promise<ChapterData> {
    const book = await getBook(chapterId);
    const pageCount = book.media.pagesCount;
    const host = await getHost();

    const images = Array(pageCount)
      .fill(0)
      .map((_, idx) => ({
        url: `${host}/api/v1/books/${chapterId}/pages/${idx + 1}`,
      }));

    return {
      chapterId,
      contentId,
      pages: images,
    };
  },
  getIdentifierForURL: async function (
    url: string
  ): Promise<ContentIdentifier | null> {
    return null;
  },
};
