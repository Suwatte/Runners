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
  id: `${idx * 20}`,
  title: idx !== 0 ? "⭐".repeat(idx) : "-",
}));

const FaceSystem: Option[] = [
  {
    id: "0",
    title: "-",
  },
  {
    id: "35",
    title: "🙁👎",
  },
  {
    id: "60",
    title: "😐",
  },
  {
    id: "85",
    title: "😃👍",
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
            id: "progress",
            title: "Chapter",
            value: entry.progress,
            upperBound: chapters,
            allowDecimal: true,
          }),
          UIStepper({
            id: "progressVolumes",
            title: "Volume",
            value: entry.progressVolumes ?? 0,
            upperBound: volumes,
          }),
        ],
      }),

      // Repeats
      {
        children: [
          UIStepper({
            id: "repeat",
            title: "Total rereads",
            value: entry.repeat,
          }),
        ],
      },

      // Dates
      {
        children: [
          UIDatePicker({
            id: "startedAt",
            title: "Start Date",
            optional: "true",
            value: entry.startedAt && parseFuzzyDate(entry.startedAt),
          }),
          UIDatePicker({
            id: "completedAt",
            title: "Completion Date",
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
            id: "notes",
            title: "Notes",
            optional: "true",
            value: entry.notes,
          }),
        ],
      },

      {
        children: [
          UIMultiPicker({
            id: "customLists",
            title: "Custom Lists",
            options: entry.customLists?.map((v) => ({
              id: v.name,
              title: v.name,
            })),
            value: entry.customLists
              ?.filter((v) => v.enabled)
              .map((v) => v.name),
          }),
          UIToggle({
            id: "hiddenFromStatusLists",
            title: "Hide From Status List",
            value: entry.hiddenFromStatusLists,
          }),
          UIToggle({
            id: "private",
            title: "Private Entry",
            value: entry.private,
          }),
        ],
      },
    ],
  });
};

const ScoreComponent = async (score: number | undefined) => {
  const title = "Score";
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
        id: "score",
        title,
        value: score ? getClosestKey(score, options) : options?.[0].id,
        options,
      });
    }
    default: {
      return UIStepper({
        id: "score",
        title,
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
  let closestKey = options[0].id;
  let closestDiff = Math.abs(num - Number(options[0].id));

  for (let i = 1; i < options.length; i++) {
    let diff = Math.abs(num - Number(options[i].id));
    if (diff < closestDiff) {
      closestDiff = diff;
      closestKey = options[i].id;
    }
  }

  return closestKey;
};
