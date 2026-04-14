import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Results, RoundResult, Schedule } from "./types";
import { generateSchedule } from "./utils/schedule";
import { getPlayerScores } from "./utils/score";
import { getScheduleCsv, getScorecardCsv, getScoreCsv } from "./utils/csv";
import { downloadAsFile } from "./utils/download";
import { genArr } from "./utils/array";
import * as Store from "./utils/store";

type AppContextValue = {
  players: number;
  setPlayers: (n: number) => void;
  rounds: number;
  setRounds: (n: number) => void;
  names: string[];
  setPlayerName: (name: string, index: number) => void;
  schedule: Schedule;
  results: Results;
  setResult: (result: RoundResult, index: number) => void;
  isStarted: boolean;
  hasSubs: boolean;
  sortedPlayers: ReturnType<typeof getPlayerScores>;
  start: () => void;
  stop: () => void;
  downloadSchedule: () => void;
  downloadScorecard: () => void;
  downloadScores: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isStarted, setIsStarted] = useState(Store.get("isStarted") || false);
  const [players, setPlayers] = useState(Store.get("players") || 10);
  const [results, setResults] = useState<Results>(Store.get("results") || []);
  const [rounds, setRounds] = useState(Store.get("rounds") || 8);
  const [schedule, setSchedule] = useState<Schedule>(Store.get("schedule") || []);
  const [names, setNames] = useState<string[]>(Store.get("names") || []);

  const hasSubs = schedule[0]?.subs.length > 0;

  const playerScores = useMemo(
    () => getPlayerScores(schedule, results, players, names),
    [schedule, results, players, names],
  );

  const sortedPlayers = useMemo(
    () => playerScores.sort((a, b) => Math.sign(b.total - a.total)),
    [playerScores],
  );

  useEffect(() => {
    Store.set("players", players);
    Store.set("schedule", schedule);
    Store.set("rounds", rounds);
    Store.set("results", results);
    Store.set("isStarted", isStarted);
    Store.set("names", names);
  }, [results, schedule, rounds, players, isStarted, names]);

  const setPlayerName = (name: string, playerIndex: number) => {
    setNames(genArr(players).map((i) => (i === playerIndex ? name : names[i] || "")));
  };

  const setResult = (result: RoundResult, index: number) => {
    setResults(results.map((r, i) => (index === i ? result : r)));
  };

  const start = () => {
    const newSchedule = generateSchedule(players, rounds);
    setSchedule(newSchedule);
    setResults(newSchedule.map(() => []));
    setIsStarted(true);
    Store.set("isStarted", true);
  };

  const stop = () => {
    setIsStarted(false);
    Store.set("isStarted", false);
  };

  const downloadSchedule = () => {
    downloadAsFile(`round-robin-schedule-${players}-${rounds}.csv`, getScheduleCsv(schedule));
  };

  const downloadScorecard = () => {
    downloadAsFile(
      `round-robin-scorecard-${players}-${rounds}.csv`,
      getScorecardCsv(schedule, players),
    );
  };

  const downloadScores = () => {
    downloadAsFile(`round-robin-scores-${players}-${rounds}.csv`, getScoreCsv(sortedPlayers));
  };

  return (
    <AppContext.Provider
      value={{
        players,
        setPlayers,
        rounds,
        setRounds,
        names,
        setPlayerName,
        schedule,
        results,
        setResult,
        isStarted,
        hasSubs,
        sortedPlayers,
        start,
        stop,
        downloadSchedule,
        downloadScorecard,
        downloadScores,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
