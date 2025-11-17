import type { Schedule, PlayerScore } from "../types";
import { genArr, increment } from "./array";
import { getTeamName } from "./string";

type Row = (string | number)[];

export const getScheduleCsv = (schedule: Schedule) => {
  const hasSubs = schedule[0].subs.length > 0;
  const heading = [
    "Round",
    ...genArr(4).flatMap((t) => [getTeamName(t), "Pts."]),
    ...(hasSubs ? ["Sub"] : []),
    "A - B",
    "C - D",
  ];

  const rows = schedule.map((round, i) => [
    i + 1,
    ...round.teams.flatMap((t) => [increment(t).join(", "), ""]),
    ...(hasSubs ? [increment(round.subs).join(" ,")] : []),
    ...genArr(2, ""),
  ]);

  return toCsv(heading, rows);
};

export const getScorecardCsv = (schedule: Schedule, players: number) => {
  const heading = ["Player", "Name", ...increment(genArr(schedule.length)), "Total"];

  const rows = genArr(players).map((p) => [
    p + 1,
    "",
    ...schedule.map((s) => (s.subs.includes(p) ? "-" : "")),
    "",
  ]);

  return toCsv(heading, rows);
};

export const getScoreCsv = (scores: PlayerScore[]) => {
  const heading = ["id", "name", ...increment(genArr(scores[0].scores.length)), "total"];
  const rows = scores.map((s) => [s.id, s.name, ...s.scores.map((s) => s ?? ""), s.total]);

  return toCsv(heading, rows);
};

const toCsv = (headings: Row, rows: Row[]) =>
  [headings, ...rows].map((row) => row.map((row) => `"${row}"`).join(",")).join("\n");
