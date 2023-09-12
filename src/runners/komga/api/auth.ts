import { request, simpleReq } from ".";
import { KomgaStore } from "../store";
import { genURL } from "../utils";

export const getUser = async () => {
  const user = await request<any>({ url: await genURL("/api/v2/users/me") });
  return user;
};

export const getHost = async () => {
  let host = await KomgaStore.host();
  if (!host) throw new Error("You have not defined a server url!");
  if (host.endsWith("/")) return host.slice(0, -1);
  return host;
};

export const healthCheck = async () => {
  await simpleReq({ url: await genURL("/api/v1/oauth2/providers") });
};
