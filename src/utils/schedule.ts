import type { Schedule, Round, Team } from "../types";
import { genArr, inShuffle } from "./array";

export const generateSchedule = (players: number, rounds: number): Schedule => {
  const getZeroScores = () => genArr(players, 0);
  const playersOpponents: number[][] = genArr(players).map(getZeroScores);
  const playersTeammates: number[][] = genArr(players).map(getZeroScores);

  let seed = genArr(players);

  const schedule: Round[] = [];
  const useSubs = players % 2 !== 0;
  const subPool = useSubs ? seed.slice(0, rounds) : [];
  const totalRounds = rounds + (useSubs ? 1 : 0);

  for (let i = 0; i < totalRounds; i++) {
    const isSubRound = useSubs && i === totalRounds - 1;
    const subs = isSubRound
      ? seed.filter((p) => !subPool.includes(p))
      : [subPool[i % subPool.length]].filter((s) => s !== undefined);

    const avgTeamSize = isSubRound ? rounds / 2 : (players - (players % 2)) / 4;
    const teamCount = isSubRound ? 2 : 4;
    const queue = seed.filter((p) => !subs.includes(p));
    const teams: Team[] = [];

    for (let t = 0; t < teamCount; t++) {
      const size = t < 2 ? Math.ceil(avgTeamSize) : Math.floor(avgTeamSize);
      const opponent = teams[t - 1];
      const team: Team = [];

      for (let p = 0; p < size; p++) {
        let bestCandidate = queue[0];
        let bestCandidateCost = Infinity;

        for (const c of queue) {
          const opponentCost = opponent
            ? opponent.reduce((tot, o) => tot + playersOpponents[c][o], 0)
            : 0;

          const teammateCost =
            team.length > 0 ? team.reduce((tot, t) => tot + playersTeammates[c][t], 0) : 0;

          const cost = opponentCost + teammateCost;

          if (cost < bestCandidateCost) {
            bestCandidateCost = cost;
            bestCandidate = c;
          }
        }

        team.push(bestCandidate);
        queue.splice(queue.indexOf(bestCandidate), 1);
      }

      teams.push(team);
      seed = inShuffle(inShuffle(inShuffle(seed)));
    }

    for (let t = 0; t < teamCount; t++) {
      const team = teams[t];
      const opponent = teams[t + (t % 2 === 0 ? 1 : -1)];

      for (const p of teams[t]) {
        for (const m of team) {
          playersTeammates[p][m] += 1;
        }

        for (const o of opponent) {
          playersOpponents[p][o] += 1;
        }
      }
    }

    if (isSubRound) {
      teams.push([], []);
    }

    schedule.push({ teams, subs });
  }

  return schedule;
};
