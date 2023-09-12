import emulate from "@suwatte/emulator";
import { Target } from "../runners/anilist";
describe("Anilist Tests", () => {
  const anilist = emulate(Target);

  describe("Directory Tests", () => {
    test("(No Search Param / No Filters)", async () => {
      const data = await anilist.getDirectory({ page: 1 });
      expect(data.isLastPage).toBe(false);
      expect(data.results.length).toBeGreaterThan(20);

      const firstTitle = data.results[0];
      expect(firstTitle.title).toBe("Chainsaw Man");
      expect(firstTitle.id).toBe("105778");
    });

    test("Search Param / No Filters", async () => {
      const data = await anilist.getDirectory({ page: 1, query: "doctor" });
      expect(data.isLastPage).toBe(false);
      expect(data.results.length).toBeGreaterThan(5);

      const firstTitle = data.results[0];
      expect(firstTitle.id).toBe("107918");
      expect(firstTitle.cover).toContain(
        "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium"
      );
      expect(firstTitle.webUrl).toContain("107918");
    });

    test("Correctly Paginating", async () => {
      const page1 = await anilist.getDirectory({ page: 1 });
      const page2 = await anilist.getDirectory({ page: 2 });

      expect(page1.isLastPage).toBe(false);
      expect(page1.results.length).toBeGreaterThan(20);

      expect(page2.isLastPage).toBe(false);
      expect(page2.results.length).toBeGreaterThan(20);

      expect(page1.results?.[0].id === page2.results?.[0].id).toBe(false);
    });

    test("Sorting Methods", async () => {
      const data = await anilist.getDirectory({
        page: 1,
        sort: { key: "SCORE", ascending: false },
      });
      expect(data.isLastPage).toBe(false);
      expect(data.results.length).toBeGreaterThan(20);

      const content = data.results[0];
      expect(content.id).toBe("30002");
    });

    test("Filters Present", async () => {
      const data = await anilist.getDirectory({
        page: 1,
        filters: { genres: { included: ["Action"] } },
      });

      expect(data.isLastPage).toBe(false);
      expect(data.results.length).toBeGreaterThan(20);
    });
  });

  describe("Profile Tests", () => {
    test("Get SFW Profile", async () => {
      const data = await anilist.getFullInformation("34632");
      expect([...(data.additionalTitles ?? []), data.title]).toContain(
        "Oyasumi Punpun"
      );
    });

    test("Get NSFW Profile", async () => {
      const data = await anilist.getFullInformation("127142");
      expect([...(data.additionalTitles ?? []), data.title]).toContain(
        "Yeonae Hando Chogwa"
      );

      expect(data.isNSFW).toBe(true);
    });

    test("Profile Tag Request", async () => {
      const data = await anilist.getDirectory({
        page: 1,
        tag: { tagId: "Action", propertyId: "genres" },
      });

      expect(data.isLastPage).toBe(false);
      expect(data.results.length).toBeGreaterThan(20);
    });
  });
});
