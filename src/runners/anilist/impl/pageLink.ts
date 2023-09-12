import {
  PageLink,
  PageLinkLabel,
  PageLinkProvider,
  PageLinkResolver,
  PageSection,
  ResolvedPageSection,
} from "@suwatte/daisuke";
import { authenticated, getViewer } from "../utils";
import { getHomePage } from "../utils/media";

export const LinkResolver: PageLinkResolver = {
  getSectionsForPage: function ({ id }: PageLink): Promise<PageSection[]> {
    switch (id) {
      case "home": {
        return getHomePage();
      }
    }

    throw new Error(`link not resolved [${id}]`);
  },
  resolvePageSection: function (
    link: PageLink,
    sectionID: string
  ): Promise<ResolvedPageSection> {
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
          page: { id: "home" },
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
