import { NetworkClientBuilder } from "@suwatte/daisuke";
import { FuzzyDate } from "../types";
export * from "./form";
export * from "./mediaList";
export * from "./user";

/**
 * Parse Param from url, URL and URLSearchParam not available in JSCore environment
 */
export function getParamFromURL(url: string, param: string) {
  var regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Checks if a user is authenticated
 */
export async function authenticated() {
  const token = await SecureStore.get("access_token");
  const expiry = await SecureStore.get("expires");

  if (!token) return false;
  if (!expiry || !(typeof expiry === "string")) return false;
  const expiryDate = new Date(expiry);

  const now = new Date();

  if (now > expiryDate) {
    // Token expired remove keys
    await SecureStore.remove("access_token");
    await SecureStore.remove("expires");
    await SecureStore.remove("handle");
    return false;
  }
  return true;
}

export const AUTHENTICATED_CLIENT = new NetworkClientBuilder()
  .addRequestInterceptor(async (req) => {
    req.headers = {
      ...(req.headers || {}),
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const isAuthenticated = await authenticated();
    if (!isAuthenticated) return req;

    const token = await SecureStore.string("access_token");

    req.headers = {
      ...(req.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    return req;
  })
  .build();

/**
 * Makes a request to the Anilist GraphQL API
 */
export async function request<T extends unknown>(
  query: string,
  variables: any = {}
) {
  const client = AUTHENTICATED_CLIENT;

  const { data } = await client.post("https://graphql.anilist.co", {
    body: {
      query: query.trim(),
      variables,
    },
  });

  const object = JSON.parse(data);
  return object as T;
}

/**
 * Parses a string id into an integer id
 */
export const parseID = (id: string) => {
  const intId = Number(id);

  if (isNaN(intId)) throw new Error("Invalid Media ID");
  return intId;
};

/**
 * parses an anilist fuzzy date to a date
 */
export const parseFuzzyDate = (date: FuzzyDate): Date | undefined => {
  if (!date.year) {
    return undefined;
  }
  return new Date(date.year, date.month - 1, date.day);
};

/**
 * converts a js date to an anilist fuzzy date
 */
export const convertToFuzzyDate = (date: Date): FuzzyDate => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export const parseWebUrl = (id: number | string) =>
  `https://anilist.co/manga/${id}`;

export const preferenceKeys = {
  nsfw: "nsfw",
};
