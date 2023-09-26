import { ContentTracker, Form, Highlight, TrackStatus } from "@suwatte/daisuke";
import { buildEntryForm, handleSubmitEntryForm } from "../utils/form";
import { parseID, parseTrackItem, request } from "../utils";
import { getSearchResults } from "../utils/media";
import { MediaListEntryMutation } from "../gql";

export const TrackerImplementation: Omit<ContentTracker, "info"> = {
  async didUpdateLastReadChapter(id, progress) {
    const variables = {
      mediaId: parseID(id),
      progress: progress.chapter ? Math.trunc(progress.chapter) : undefined,
      progressVolumes: progress.volume
        ? Math.trunc(progress.volume)
        : undefined,
    };
    await request(MediaListEntryMutation, variables);
  },
  getResultsForTitles: function (titles: string[]): Promise<Highlight[]> {
    return getSearchResults(titles);
  },
  getTrackItem: function (id: string): Promise<Highlight> {
    return parseTrackItem(id);
  },
  beginTracking: async function (
    id: string,
    status: TrackStatus
  ): Promise<void> {
    const variables = {
      mediaId: parseID(id),
      status,
    };
    await request(MediaListEntryMutation, variables);
  },
  getEntryForm: async function (id: string): Promise<Form> {
    return buildEntryForm(id);
  },
  didSubmitEntryForm: function (id: string, form: any): Promise<void> {
    return handleSubmitEntryForm(id, form);
  },
  didUpdateStatus: async function (
    id: string,
    status: TrackStatus
  ): Promise<void> {
    const variables = {
      mediaId: parseID(id),
      status,
    };
    await request(MediaListEntryMutation, variables);
  },
};
