export type Team = number[];
export type Round = { teams: Team[]; subs: number[] };
export type Schedule = Round[];
export type Result = number[];
export type RoundResult = Result[];
export type Results = RoundResult[];
export type PlayerScore = { id: number; name: string; scores: number[]; total: number };
