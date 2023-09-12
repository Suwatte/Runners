import { Form, UIToggle, UserPreferenceHandler } from "@suwatte/daisuke";
import { KomgaStore } from "../store";

export const KomgaPreferenceProvider: UserPreferenceHandler = {
  getPreferenceMenu: async function (): Promise<Form> {
    return {
      sections: [
        {
          header: "Core",
          children: [
            UIToggle({
              id: "openAsTitle",
              title: "Open Series as Title",
              value: await KomgaStore.openSeriesAsTitle(),
              async didChange(value) {
                await ObjectStore.set("openAsTitle", value);
              },
            }),
          ],
        },
      ],
    };
  },
};
