import { RunnerSetupProvider, UITextField } from "@suwatte/daisuke";
import { SuwayomiStore } from "../utils/store";

export const SuwayomiSetupBuilder: RunnerSetupProvider = {
  async getSetupMenu() {
    return {
      sections: [
        {
          header: "Server URL",
          children: [
            UITextField({
              key: "host",
              label: "Server URL",
              value: (await SuwayomiStore.host()) ?? "",
            }),
          ],
        },
      ],
    };
  },

  async validateSetupForm({ host }: { host: string }) {
    await ObjectStore.set("host", host);
  },
};
