import {
  BasicAuthenticatable,
  BasicAuthenticationUIIdentifier,
} from "@suwatte/daisuke";
import { getUser } from "../api/auth";
import { KomgaStore } from "../store";
import { genURL } from "../utils";

export const KomgaAuthentication: BasicAuthenticatable = {
  BasicAuthUIIdentifier: BasicAuthenticationUIIdentifier.USERNAME,
  getAuthenticatedUser: async () => {
    const host = await KomgaStore.host();
    if (!host)
      throw new Error(
        "You have not set your server url. You must do this to use the runner"
      );
    const authenticated = await KomgaStore.authenticated();
    if (!authenticated) return null;

    try {
      const data = await getUser();

      return {
        handle: data.email,
      };
    } catch (err: any) {
      console.error(err.message);
      await SecureStore.remove("credentials");
      await ObjectStore.remove("authenticated");
    }

    return null;
  },
  handleUserSignOut: async () => {
    throw "Not ready";
  },
  handleBasicAuth: async (identifier, password) => {
    const value = Buffer.from(`${identifier}:${password}`).toString("base64");
    // Set Cookie
    const client = new NetworkClient();
    await client.request({
      url: await genURL("/api/v1/login/set-cookie"),
      headers: {
        Authorization: `Basic ${value}`,
      },
    });

    // Try Fetching User to verify
    await client.request({
      url: await genURL("/api/v2/users/me"),
    });

    // Set Props
    await ObjectStore.set("authenticated", true);
    await SecureStore.set("credentials", value);
  },
};
