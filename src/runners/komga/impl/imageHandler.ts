import { ImageRequestHandler, NetworkRequest } from "@suwatte/daisuke";

export const KomgaImageHandler: ImageRequestHandler = {
  willRequestImage: async function (url: string): Promise<NetworkRequest> {
    return {
      url,
      headers: {
        Accept: "image/*",
      },
    };
  },
};
