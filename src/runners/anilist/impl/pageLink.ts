import {
  PageLink,
  PageLinkLabel,
  PageLinkProvider,
  PageLinkResolver,
  PageSection,
  ResolvedPageSection,
  TrackItem,
} from "@suwatte/daisuke";
import { authenticated, getViewer } from "../utils";
import { getHomePage } from "../utils/media";

export const LinkResolver: PageLinkResolver<TrackItem> = {
  getSectionsForPage: function (
    link: PageLink
  ): Promise<PageSection<TrackItem>[]> {
    const key = link.key;
    switch (key) {
      case "home": {
        return getHomePage();
      }
    }

    throw new Error(`link not resolved [${key}]`);
  },
  resolvePageSection: function (
    link: PageLink,
    sectionKey: string
  ): Promise<ResolvedPageSection<TrackItem>> {
    throw new Error("non resolving provider.");
  },
};

export const LinkProvider: PageLinkProvider = {
  getLibraryPageLinks: async function (): Promise<PageLinkLabel[]> {
    const isAuthenticated = await authenticated();
    if (!isAuthenticated) return [];

    const {
      mediaListOptions: {
        mangaList: { sectionOrder: lists },
      },
    } = await getViewer();

    return lists.map((list) => ({
      title: list,
      link: {
        request: {
          page: 1,
          context: {
            list,
          },
          configKey: "userList",
        },
      },
    }));
  },
  getBrowsePageLinks: async function (): Promise<PageLinkLabel[]> {
    return [
      {
        title: "Discover",
        link: {
          page: { key: "home" },
        },
      },
      {
        title: "All Manga",
        link: {
          request: { page: 1 },
        },
      },
    ];
  },
};
