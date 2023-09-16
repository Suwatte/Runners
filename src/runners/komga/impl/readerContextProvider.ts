import {
  Highlight,
  ReaderContext,
  StreamContextProvider,
} from "@suwatte/daisuke";
import { getBook, getBooks, getHost, getSeries } from "../api";
import { bookToChapter } from "../utils";

export const KomgaMSB: StreamContextProvider = {
  provideReaderContext: async function (
    contentId: string
  ): Promise<ReaderContext> {
    const [_, bookId] = contentId.split(":");
    return getContextForBook(bookId);
  },
};

async function getContextForBook(bookId: string): Promise<ReaderContext> {
  const book = await getBook(bookId);
  const host = await getHost();

  // should return highlight pointing to the series rather than the book
  // so the local progress entry all point to the same title
  const content: Highlight = {
    id: book.seriesId,
    title: book.seriesTitle,
    cover: `${host}/api/v1/series/${book.seriesId}/thumbnail`,
  };

  const series = await getSeries(book.seriesId);
  const books = await getBooks(series.id, series.booksCount);
  const chapters = books.map((v, idx) => bookToChapter(v, host, idx));
  const page = book.readProgress?.page ?? 1;
  return {
    target: book.id,
    content,
    chapters,
    requestedPage: page,
    // Komga only supports 1 reading mode for all titles, do not set the reading mode
  };
}
