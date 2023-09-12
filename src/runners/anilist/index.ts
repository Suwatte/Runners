import type {
  AdvancedTracker,
  ContentTracker,
  RunnerInfo,
  TrackerConfig,
} from "@suwatte/daisuke";
import { TrackerImplementation } from "./impl/tracker";
import { OAuthImplementation } from "./impl/auth";
import { LinkProvider, LinkResolver } from "./impl/pageLink";
import { AdvancedTrackerImplementation } from "./impl/advancedTracker";

const info: RunnerInfo = {
  id: "co.anilist",
  name: "Anilist",
  version: 1.0,
  website: "https://anilist.co",
  thumbnail: "anilist.png",
};

const config: TrackerConfig = {
  linkKeys: ["anilist", "al", "anilist.co"],
};

type Anilist = ContentTracker & AdvancedTracker;

export const Target: Anilist = {
  info,
  config,
  ...AdvancedTrackerImplementation,
  ...TrackerImplementation,
  ...OAuthImplementation,
  ...LinkProvider,
  ...LinkResolver,
};
