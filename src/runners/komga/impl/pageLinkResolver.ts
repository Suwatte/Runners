import {
  Generate,
  Highlight,
  PageLink,
  PageLinkResolver,
  PageSection,
  ResolvedPageSection,
  SectionStyle,
} from "@suwatte/daisuke";
import {
  getBooksForLibrary,
  getSeriesForLibraryWithState,
} from "../api/library";
import { SORTS, buildSort, seriesToTile } from "../utils";
import { getHost } from "../api";
import { KomgaStore } from "../store";

export const KomgaPageLinkResolver: PageLinkResolver = {
  getSectionsForPage: async function (link: PageLink): Promise<PageSection[]> {
    switch (link.id) {
      case "all":
      case "library": {
        return buildBrowseLibrarySections();
      }
    }

    throw new Error(`No Handler Providing sections for ${link.id}`);
  },
  resolvePageSection: function (
    link: PageLink,
    sectionID: string
  ): Promise<ResolvedPageSection> {
    switch (link.id) {
      case "all":
      case "library": {
        const libraryId =
          (link.context?.libraryId as string | undefined) ?? null;
        return resolveLibrarySection(libraryId, sectionID);
      }
    }

    throw new Error(`No Handler Resolving ${link.id}`);
  },
};

// Library Sections
function buildBrowseLibrarySections() {
  const sections: PageSection[] = [];

  sections.push({
    id: "search_directory",
    title: "Search Komga",
    style: SectionStyle.TAG,
  });

  sections.push({
    id: "keep_reading",
    title: "Keep Reading",
  });

  sections.push({
    id: "recently_released",
    title: "Recently Released",
  });
  sections.push({
    id: "recently_added_books",
    title: "Recently Added Books",
  });
  sections.push({
    id: "recently_added_series",
    title: "Recently Added Series",
  });
  sections.push({
    id: "recently_updated_series",
    title: "Recently Updated Series",
  });

  return sections;
}

// Library Sections
async function resolveLibrarySection(
  libraryId: string | null,
  sectionKey: string
) {
  let items: Highlight[] = [];

  const convertSeriesToItems = async (key: "new" | "updated") => {
    const openAsTitle = await KomgaStore.openSeriesAsTitle();

    const series = await getSeriesForLibraryWithState(libraryId, key);

    const host = await getHost();
    const highlights: Highlight[] = (series ?? []).map((data) =>
      seriesToTile(data, host, !openAsTitle)
    );
    return highlights;
  };

  switch (sectionKey) {
    case "search_directory": {
      const highlights = [
        Generate<Highlight>({
          title: "All Books",
          cover: "",
          id: "all_books",
          link: {
            request: {
              page: 1,
              context: {
                isSeriesDirectory: false,
              },
            },
          },
        }),

        Generate<Highlight>({
          title: "All Series",
          cover: "",
          id: "all_series",
          link: {
            request: {
              page: 1,
              context: {
                isSeriesDirectory: true,
              },
            },
          },
        }),
      ];
      items = highlights;
      break;
    }
    case "keep_reading": {
      const highlights = await getBooksForLibrary(
        libraryId,
        buildSort(SORTS.readProgress, false),
        "IN_PROGRESS"
      );
      items = highlights;
      break;
    }
    case "recently_released": {
      const highlights = await getBooksForLibrary(
        libraryId,
        buildSort(SORTS.releaseDate, false)
      );
      items = highlights;
      break;
    }
    case "recently_added_books": {
      const highlights = await getBooksForLibrary(
        libraryId,
        buildSort(SORTS.creationDate, false)
      );
      items = highlights;
      break;
    }
    case "recently_added_series": {
      items = await convertSeriesToItems("new");
      break;
    }
    case "recently_updated_series": {
      items = await convertSeriesToItems("updated");
      break;
    }
  }

  return { items };
}
