import { authenticated, request } from ".";
import { CurrentViewerQuery, CurrentViewerScoreFormatQuery } from "../gql";
import { CurrentViewerResponse } from "../types";

/**
 * Get's the scoring format for the current authenticated user
 */
export const getScoreFormat = async () => {
  if (!authenticated()) throw new Error("Not Signed in.");
  const response = await request<any>(CurrentViewerScoreFormatQuery);

  return response.data.Viewer.mediaListOptions.scoreFormat as string;
};

export const getViewer = async () => {
  const response = await request<CurrentViewerResponse>(CurrentViewerQuery);
  return response.data.Viewer;
};
