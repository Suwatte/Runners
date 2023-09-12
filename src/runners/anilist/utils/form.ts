import {
  Option,
  UIDatePicker,
  UIMultiPicker,
  UIPicker,
  UITextField,
  UIToggle,
  UIStepper,
} from "@suwatte/daisuke";
import { FormProps } from "../types";
import { getMediaListEntry } from "./mediaList";
import {
  convertToFuzzyDate,
  getScoreFormat,
  parseFuzzyDate,
  parseID,
  request,
} from ".";
import { MediaListEntryMutation } from "../gql";
import { Form, FormSection, Generate } from "@suwatte/daisuke";

const StarSystem: Option[] = new Array(6).fill(0).map((_, idx) => ({
  key: `${idx * 20}`,
  label: idx !== 0 ? "⭐".repeat(idx) : "-",
}));

const FaceSystem: Option[] = [
  {
    key: "0",
    label: "-",
  },
  {
    key: "35",
    label: "🙁👎",
  },
  {
    key: "60",
    label: "😐",
  },
  {
    key: "85",
    label: "😃👍",
  },
];

/**
 * Builds the Entry Edit Form for the given title using the media list entry
 */
export const buildEntryForm = async (id: string) => {
  const {
    mediaListEntry: entry,
    chapters,
    volumes,
  } = await getMediaListEntry(id);

  if (!entry) throw new Error(`Not Tracking ${id}`);

  return Generate<Form>({
    sections: [
      // Score
      Generate<FormSection>({
        children: [await ScoreComponent(entry.score)],
      }),

      // Progress
      Generate<FormSection>({
        header: "Reading Progress",
        children: [
          UIStepper({
            key: "progress",
            label: "Chapter",
            value: entry.progress,
            upperBound: chapters,
            allowDecimal: true,
          }),
          UIStepper({
            key: "progressVolumes",
            label: "Volume",
            value: entry.progressVolumes ?? 0,
            upperBound: volumes,
          }),
        ],
      }),

      // Repeats
      {
        children: [
          UIStepper({
            key: "repeat",
            label: "Total rereads",
            value: entry.repeat,
          }),
        ],
      },

      // Dates
      {
        children: [
          UIDatePicker({
            key: "startedAt",
            label: "Start Date",
            optional: "true",
            value: entry.startedAt && parseFuzzyDate(entry.startedAt),
          }),
          UIDatePicker({
            key: "completedAt",
            label: "Completion Date",
            optional: "true",
            value: entry.completedAt && parseFuzzyDate(entry.completedAt),
          }),
        ],
      },

      // Notes
      {
        header: "Notes",
        children: [
          UITextField({
            key: "notes",
            label: "Notes",
            optional: "true",
            value: entry.notes,
          }),
        ],
      },

      {
        children: [
          UIMultiPicker({
            key: "customLists",
            label: "Custom Lists",
            options: entry.customLists.map((v) => ({
              key: v.name,
              label: v.name,
            })),
            value: entry.customLists
              .filter((v) => v.enabled)
              .map((v) => v.name),
          }),
          UIToggle({
            key: "hiddenFromStatusLists",
            label: "Hide From Status List",
            value: entry.hiddenFromStatusLists,
          }),
          UIToggle({
            key: "private",
            label: "Private Entry",
            value: entry.private,
          }),
        ],
      },
    ],
  });
};

const ScoreComponent = async (score: number | undefined) => {
  const label = "Score";
  const scoreFormat = await getScoreFormat();

  const numSystemScore = (score: number) => {
    if (score === 0) return 0;
    switch (scoreFormat) {
      case "POINT_10_DECIMAL":
        return Math.round(score / 10);
      case "POINT_10":
        return Math.trunc(score / 10);
      default:
        return score;
    }
  };

  switch (scoreFormat) {
    case "POINT_5":
    case "POINT_3": {
      const options = scoreFormat === "POINT_3" ? FaceSystem : StarSystem;
      return UIPicker({
        key: "score",
        label,
        value: score ? getClosestKey(score, options) : options?.[0].key,
        options,
      });
    }
    default: {
      return UIStepper({
        key: "score",
        label,
        value: score ? numSystemScore(score) : 0,
        allowDecimal: scoreFormat === "POINT_10_DECIMAL" ? true : undefined,
        upperBound: scoreFormat === "POINT_100" ? 100 : 10,
      });
    }
  }
};

/**
 * Updates a media entry on anilist using the provided form
 */
export const handleSubmitEntryForm = async (id: string, form: FormProps) => {
  const mediaId = parseID(id);

  // Dates
  const startedAt =
    form.startedAt === null
      ? null
      : form.startedAt
      ? convertToFuzzyDate(new Date(form.startedAt))
      : undefined;
  const completedAt =
    form.completedAt === null
      ? null
      : form.completedAt
      ? convertToFuzzyDate(new Date(form.completedAt))
      : undefined;

  // Score
  const calc = (score: string) => Math.trunc(parseID(score));
  const scoreFormat = await getScoreFormat();
  const calcNum = (score: number) => {
    if (scoreFormat !== "POINT_100") {
      return Math.trunc(score * 10);
    }
    return Math.trunc(score);
  };

  const score = form.score
    ? typeof form.score === "string"
      ? calc(form.score)
      : calcNum(form.score)
    : undefined;

  // Request
  const variables = {
    mediaId,
    ...form,
    // Fix Dates
    startedAt,
    completedAt,

    // Fix Score which can either be a string or a number depending on the user's scoring format
    score,
  };
  await request(MediaListEntryMutation, variables);
};

const getClosestKey = (num: number, options: Option[]) => {
  let closestKey = options[0].key;
  let closestDiff = Math.abs(num - Number(options[0].key));

  for (let i = 1; i < options.length; i++) {
    let diff = Math.abs(num - Number(options[i].key));
    if (diff < closestDiff) {
      closestDiff = diff;
      closestKey = options[i].key;
    }
  }

  return closestKey;
};
