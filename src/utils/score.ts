import { genArr } from "./array";
import type { PlayerScore, Result, Results, Schedule } from "../types";

export const getPlayerScores = (
  schedule: Schedule,
  results: Results,
  players: number,
  names: string[],
): PlayerScore[] => {
  const roundScores = results.map((result) => result.flatMap(getScoresForResult));

  return genArr(players)
    .map((p) => {
      const scores = schedule.map((rounds, i) => {
        const t = rounds.teams.findIndex((t) => t.includes(p));
        return roundScores[i]?.[t];
      });

      const total = scores.reduce((tot, s) => tot + (s || 0), 0);

      return { id: p, scores, total, name: names[p] };
    })
    .sort((a, b) => Math.sign(a.total - b.total));
};

const getScoresForResult = (result: Result | undefined) => {
  if (!result) return [0, 0];

  const [a, b] = result;

  if (a > b) return [3 + a, b];
  if (a < b) return [a, 3 + b];

  return [1 + a, 1 + b];
};
