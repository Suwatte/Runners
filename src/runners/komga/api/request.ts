import { NetworkRequest, NetworkResponse } from "@suwatte/daisuke";
import { KomgaStore } from "../store";

export async function request<T>(req: NetworkRequest) {
  const host = await KomgaStore.host();
  const credentials = await KomgaStore.credentials();

  if (!host) throw new Error("You have not defined a server url!");
  if (!credentials) throw new Error("You are not signed in!");

  const client = new NetworkClient();

  const { data } = await client.request({
    ...req,
    headers: {
      ...req.headers,
      Authorization: `Basic ${credentials}`,
    },
    transformResponse: async (res: NetworkResponse) => {
      if (res.status === 401) {
        // Signed Out
        await ObjectStore.remove("authenticated");
      }
      return res;
    },
  });

  if (!data) return {} as T;
  const object = JSON.parse(data);
  return object as T;
}

export const simpleReq = async (req: NetworkRequest) => {
  const client = new NetworkClient();
  const { data } = await client.request(req);
  const object = JSON.parse(data);
  return object;
};
