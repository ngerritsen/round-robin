import type { Schedule } from "../types";
import { genArr } from "./array";

export const getScheduleCsv = (schedule: Schedule) => {
  const hasSubs = schedule[0].subs.length > 0;
  const heading = [
    "Round",
    "Team A",
    "Pt.",
    "Team B",
    "Pt.",
    "Team C",
    "Pt.",
    "Team D",
    "Pt.",
    ...(hasSubs ? ["Sub"] : []),
    "A - B",
    "C - D",
  ];

  const rows = schedule.map((round, i) =>
    [
      i + 1,
      ...round.teams.flatMap((t) => [
        `"${t.map((p) => p + 1).join(", ")}"`,
        "",
      ]),
      ...(hasSubs ? `"${round.subs.map((s) => s + 1).join(" ,")}"` : []),
      "",
      "",
    ].join(","),
  );

  return heading + "\n" + rows.join("\n");
};

export const getScorecardCsv = (schedule: Schedule, players: number) => {
  const heading = ["Player", "Name", ...schedule.map((_, i) => i + 1), "Total"];

  const rows = genArr(players).map((p) => [
    p + 1,
    "",
    ...schedule.map((s) => (s.subs.includes(p) ? "-" : "")),
    "",
  ]);

  return heading + "\n" + rows.join("\n");
};
