import { PageLinkLabel, PageLinkProvider } from "@suwatte/daisuke";
import { getUserLibraries } from "../api/library";

export const KomgaPageProvider: PageLinkProvider = {
  async getLibraryPageLinks(): Promise<PageLinkLabel[]> {
    const library = await getUserLibraries();
    return library.map((lib) => ({
      title: lib.name,
      link: {
        request: {
          page: 1,
          configKey: "library",
          context: {
            libraryId: lib.id,
          },
        },
      },
    }));
  },

  async getBrowsePageLinks(): Promise<PageLinkLabel[]> {
    const library = await getUserLibraries();
    return [
      {
        title: "Home",
        link: {
          page: {
            id: "all",
          },
        },
      },
      ...library.map((lib) => ({
        title: lib.name,
        link: {
          page: {
            id: "library",
            context: {
              libraryId: lib.id,
            },
          },
        },
      })),
    ];
  },
};
