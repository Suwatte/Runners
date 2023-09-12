import { OAuthAuthenticatable, RunnerAuthenticatable } from "@suwatte/daisuke";
import { authenticated, getParamFromURL, request } from "../utils";
import { CurrentViewerQuery } from "../gql";

export const AuthImplementation: RunnerAuthenticatable = {
  async getAuthenticatedUser() {
    const isAuthenticated = await authenticated();
    if (!isAuthenticated) return null;

    const response = await request<any>(CurrentViewerQuery);
    const {
      name: handle,
      avatar: { large: avatar },
      bannerImage,
    } = response.data.Viewer;

    await SecureStore.set("user", handle);
    return {
      handle,
      avatar,
      bannerImage,
    };
  },

  async handleUserSignOut() {
    await SecureStore.remove("access_token");
    await SecureStore.remove("expires");
    await SecureStore.remove("handle");
    await SecureStore.remove("user");
  },
};

export const OAuthImplementation: OAuthAuthenticatable = {
  ...AuthImplementation,
  async getOAuthRequestURL() {
    return {
      url: "https://anilist.co/api/v2/oauth/authorize",
      params: {
        client_id: "8119",
        response_type: "token",
      },
    };
  },
  async handleOAuthCallback(response) {
    const fragment = `?${response.split("#")[1]}`;
    const accessToken = getParamFromURL(fragment, "access_token");
    const expiresIn = getParamFromURL(fragment, "expires_in");
    if (!accessToken) throw new Error("Failed");

    // Set Access Token to Key Chain
    await SecureStore.set("access_token", accessToken);

    // Set Expiry
    if (!expiresIn) return;
    const secondsFromNow = parseInt(expiresIn);
    if (!secondsFromNow) return;

    var date = new Date();
    date.setSeconds(date.getSeconds() + secondsFromNow);

    await SecureStore.set("expires", date);
  },
};
