import { ChapterEventHandler } from "@suwatte/daisuke";
import { request } from "../api";
import { genURL } from "../utils";

export const KomgaBookEvent: ChapterEventHandler = {
  onChaptersMarked: async function (
    _: string,
    bookIds: string[],
    completed: boolean
  ): Promise<void> {
    const promises = bookIds.map((v) => markAsRead(v, completed));
    const state = await Promise.allSettled(promises);

    const failing = state.filter((v) => v.status === "rejected").length;

    if (failing) {
      console.error(`Failed to mark ${failing} Books`);
    }
  },

  onChapterRead: async function (_: string, bookId: string): Promise<void> {
    return markAsRead(bookId);
  },

  async onPageRead(_, bookId, page) {
    return request<any>({
      url: await genURL(`/api/v1/books/${bookId}/read-progress`),
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        page,
      },
    });
  },
};

const markAsRead = async (bookId: string, completed = true) => {
  await request<any>({
    url: await genURL(`/api/v1/books/${bookId}/read-progress`),
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      completed,
    },
  });
};
