import {
  Chapter,
  ChapterData,
  ChapterPage,
  Content,
  ContentIdentifier,
  ContentSource,
} from "@suwatte/daisuke";
import { getChapterData, getChapters, getContent } from "../api";

type OmittedKeys = "info" | "getDirectory" | "getDirectoryConfig";

export const SuwayomiContentSource: Omit<ContentSource, OmittedKeys> = {
  getContent: async function (contentId: string): Promise<Content> {
    return getContent(contentId);
  },
  getChapters: async function (contentId: string): Promise<Chapter[]> {
    return getChapters(contentId);
  },
  getChapterData: async function (
    contentId: string,
    chapterId: string
  ): Promise<ChapterData> {
    const pages = await getChapterData(contentId, chapterId);
    return {
      pages,
      chapterId,
      contentId,
    };
  },
  getIdentifierForURL: async function (
    url: string
  ): Promise<ContentIdentifier | null> {
    return null;
  },
};
