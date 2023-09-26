import { Form, RunnerPreferenceProvider, UIToggle } from "@suwatte/daisuke";

export const AnilistPreferenceProvider: RunnerPreferenceProvider = {
  getPreferenceMenu: async function (): Promise<Form> {
    return {
      sections: [
        {
          header: "Content Settings",
          children: [
            UIToggle({
              id: "nsfw",
              title: "Allow NSFW Results",
              value: await ObjectStore.boolean("nsfw"),
              async didChange(value) {
                await ObjectStore.set("nsfw", value);
              },
            }),
          ],
        },
      ],
    };
  },
};
