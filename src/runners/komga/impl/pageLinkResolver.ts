import {
  Highlight,
  PageItem,
  PageLink,
  PageLinkResolver,
  PageSection,
  ResolvedPageSection,
} from "@suwatte/daisuke";
import {
  getBooksForLibrary,
  getSeriesForLibraryWithState,
} from "../api/library";
import { SORTS, buildSort, seriesToTile } from "../utils";
import { getHost } from "../api";
import { KomgaStore } from "../store";

export const KomgaPageLinkResolver: PageLinkResolver<Highlight> = {
  getSectionsForPage: async function (
    link: PageLink
  ): Promise<PageSection<Highlight>[]> {
    switch (link.key) {
      case "all":
      case "library": {
        return buildBrowseLibrarySections();
      }
    }

    throw new Error(`No Handler Providing sections for ${link.key}`);
  },
  resolvePageSection: function (
    link: PageLink,
    sectionKey: string
  ): Promise<ResolvedPageSection<Highlight>> {
    switch (link.key) {
      case "all":
      case "library": {
        const libraryId =
          (link.context?.libraryId as string | undefined) ?? null;
        return resolveLibrarySection(libraryId, sectionKey);
      }
    }

    throw new Error(`No Handler Resolving ${link.key}`);
  },
};

// Library Sections
function buildBrowseLibrarySections() {
  const sections: PageSection<Highlight>[] = [];

  sections.push({
    key: "keep_reading",
    title: "Keep Reading",
  });

  sections.push({
    key: "recently_released",
    title: "Recently Released",
  });
  sections.push({
    key: "recently_added_books",
    title: "Recently Added Books",
  });
  sections.push({
    key: "recently_added_series",
    title: "Recently Added Series",
  });
  sections.push({
    key: "recently_updated_series",
    title: "Recently Updated Series",
  });

  return sections;
}

// Library Sections
async function resolveLibrarySection(
  libraryId: string | null,
  sectionKey: string
) {
  let items: PageItem<Highlight>[] = [];

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
    case "keep_reading": {
      const highlights = await getBooksForLibrary(
        libraryId,
        buildSort(SORTS.readProgress, false),
        "IN_PROGRESS"
      );
      items = highlights.map((h) => ({ item: h }));
      break;
    }
    case "recently_released": {
      const highlights = await getBooksForLibrary(
        libraryId,
        buildSort(SORTS.releaseDate, false)
      );
      items = highlights.map((h) => ({ item: h }));
      break;
    }
    case "recently_added_books": {
      const highlights = await getBooksForLibrary(
        libraryId,
        buildSort(SORTS.creationDate, false)
      );
      items = highlights.map((h) => ({ item: h }));
      break;
    }
    case "recently_added_series": {
      items = (await convertSeriesToItems("new")).map((h) => ({ item: h }));
      break;
    }
    case "recently_updated_series": {
      items = (await convertSeriesToItems("updated")).map((h) => ({ item: h }));
      break;
    }
  }

  return { items };
}
