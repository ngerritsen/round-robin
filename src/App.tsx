import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Field,
  Input,
  Stack,
  Table,
  Heading,
  Button,
  Badge,
  Grid,
  InputGroup,
} from "@chakra-ui/react";
import { generateSchedule } from "./utils/schedule";
import { getScheduleCsv, getScorecardCsv, getScoreCsv } from "./utils/csv";
import { downloadAsFile } from "./utils/download";
import type { Results, RoundResult, Schedule } from "./types";
import { getPlayerScores } from "./utils/score";
import { genArr } from "./utils/array";
import ResultsEditor from "./ResultsEditor";
import * as Store from "./utils/store";
import StopDialog from "./StopDialog";
import Header from "./Header";
import { getTeamName } from "./utils/string";

const App = () => {
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

  const setPlayerName = (name: string, playerIndex: number) => {
    setNames(genArr(players).map((i) => (i === playerIndex ? name : names[i] || "")));
  };

  const start = () => {
    const schedule = generateSchedule(players, rounds);
    setSchedule(schedule);
    setResults(schedule.map(() => []));
    setIsStarted(true);
  };

  const stop = () => {
    setIsStarted(false);
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
    downloadAsFile(`round-robin-scores-${players}-${rounds}.csv`, getScoreCsv(playerScores));
  };

  const setResult = (result: RoundResult, index: number) => {
    setResults(results.map((r, i) => (index === i ? result : r)));
  };

  useEffect(() => {
    Store.set("players", players);
    Store.set("schedule", schedule);
    Store.set("rounds", rounds);
    Store.set("results", results);
    Store.set("isStarted", isStarted);
    Store.set("names", names);
  }, [results, schedule, rounds, players, isStarted, names]);

  const sortedPlayers = useMemo(
    () => playerScores.sort((a, b) => Math.sign(b.total - a.total)),
    [playerScores],
  );

  return (
    <Container py={6}>
      <Stack gap={6}>
        <Header />
        {!isStarted && (
          <Stack>
            <Stack direction="row">
              <Field.Root>
                <Field.Label>Players</Field.Label>
                <Input
                  inputMode="numeric"
                  value={players}
                  step={1}
                  min={8}
                  max={20}
                  onChange={(e) => setPlayers(Number(e.target.value))}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Rounds</Field.Label>
                <Input
                  inputMode="numeric"
                  value={rounds}
                  step={2}
                  min={6}
                  max={10}
                  onChange={(e) => setRounds(Number(e.target.value))}
                />
              </Field.Root>
            </Stack>
            <Stack>
              {genArr(players).map((i) => (
                <InputGroup key={i} startAddon={i + 1}>
                  <Input
                    placeholder={`Player ${i + 1} name`}
                    value={names[i]}
                    type="text"
                    onChange={(e) => setPlayerName(e.target.value, i)}
                  />
                </InputGroup>
              ))}
            </Stack>
          </Stack>
        )}
        {isStarted && (
          <>
            <Stack>
              <Heading as="h2" fontWeight="bold">
                Schedule
              </Heading>
              <Table.ScrollArea borderWidth="1px">
                <Table.Root variant="outline" striped={true}>
                  <Table.Header>
                    <Table.Row bg="bg.emphasized">
                      <Table.ColumnHeader>Round</Table.ColumnHeader>
                      {genArr(4).map((t) => (
                        <Table.ColumnHeader>{getTeamName(t)}</Table.ColumnHeader>
                      ))}
                      {hasSubs && <Table.ColumnHeader>Subs</Table.ColumnHeader>}
                      <Table.ColumnHeader>Results</Table.ColumnHeader>
                      <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {schedule.map((round, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{i + 1}</Table.Cell>
                        {round.teams.map((team, j) => (
                          <Table.Cell key={j}>{team.map((p) => p + 1).join(", ")}</Table.Cell>
                        ))}
                        {hasSubs && (
                          <Table.Cell>{round.subs.map((s) => s + 1).join(", ")}</Table.Cell>
                        )}
                        <Table.Cell>
                          <Stack direction="row">
                            {results[i].map((res) =>
                              res.length ? (
                                <Badge variant="outline">{res.join(" - ")}</Badge>
                              ) : null,
                            )}
                          </Stack>
                        </Table.Cell>
                        <Table.Cell width={6}>
                          <Stack direction="row" justifyContent="end">
                            <ResultsEditor
                              round={i}
                              roundResult={results[i]}
                              onSave={(result) => setResult(result, i)}
                              isSubRound={hasSubs && i === results.length - 1}
                              schedule={schedule}
                              names={names}
                            />
                          </Stack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>
            </Stack>
            <Stack>
              <Heading as="h2" fontWeight="bold">
                Scores
              </Heading>
              <Table.ScrollArea borderWidth="1px">
                <Table.Root variant="outline" striped={true}>
                  <Table.Header bg="bg.emphasized">
                    <Table.Row>
                      <Table.ColumnHeader>#</Table.ColumnHeader>
                      <Table.ColumnHeader>Player</Table.ColumnHeader>
                      {schedule.map((_, i) => (
                        <Table.ColumnHeader key={i}>{i + 1}</Table.ColumnHeader>
                      ))}
                      <Table.ColumnHeader>Total</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {sortedPlayers.map((p) => (
                      <Table.Row key={p.id}>
                        <Table.Cell>{p.id + 1}</Table.Cell>
                        <Table.Cell>{p.name || "Unknown"}</Table.Cell>
                        {p.scores.map((score, j) => (
                          <Table.Cell key={j}>{score}</Table.Cell>
                        ))}
                        <Table.Cell fontWeight="bold"> {p.total} </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>
            </Stack>
          </>
        )}
        <Stack gap={3}>
          {!isStarted && (
            <Button colorPalette="green" onClick={start}>
              Start
            </Button>
          )}
          <Grid templateColumns="1fr 1fr" gap={3}>
            {!isStarted && (
              <>
                <Button onClick={downloadScorecard}>Download scorecard</Button>
                <Button onClick={downloadSchedule}>Download schedule</Button>
              </>
            )}
            {isStarted && (
              <>
                <Button onClick={downloadScores}>Download scores</Button>
                <StopDialog stop={stop} />
              </>
            )}
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
};

export default App;
