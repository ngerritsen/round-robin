import { useEffect, useState } from "react";
import {
  Container,
  Field,
  Input,
  Stack,
  Table,
  Heading,
  Button,
  Dialog,
  CloseButton,
  Badge,
} from "@chakra-ui/react";
import { generateSchedule } from "./utils/schedule";
import { getScheduleCsv, getScorecardCsv } from "./utils/csv";
import { downloadAsFile } from "./utils/download";
import type { Results, RoundResult, Schedule } from "./types";
import { getPlayerScores } from "./utils/score";
import { genArr } from "./utils/array";
import ResultsEditor from "./ResultsEditor";

const Store = {
  get: (name: string) => {
    const data = localStorage.getItem(name);
    return data ? JSON.parse(data) : undefined;
  },
  set: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
};

function App() {
  const [isStarted, setIsStarted] = useState(Store.get("isStarted") || false);
  const [players, setPlayers] = useState(Store.get("players") || 10);
  const [results, setResults] = useState<Results>(Store.get("results") || []);
  const [rounds, setRounds] = useState(Store.get("rounds") || 8);
  const [schedule, setSchedule] = useState<Schedule>(
    Store.get("schedule") || [],
  );
  const [names, setNames] = useState<string[]>(Store.get("names") || []);

  const hasSubs = schedule[0]?.subs.length > 0;

  const playerScores = getPlayerScores(schedule, results, players);

  const setPlayerName = (name: string, playerIndex: number) => {
    setNames(
      genArr(players).map((i) => (i === playerIndex ? name : names[i] || "")),
    );
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
    downloadAsFile(
      `round-robin-schedule-${players}-${rounds}.csv`,
      getScheduleCsv(schedule),
    );
  };

  const downloadScorecard = () => {
    downloadAsFile(
      `round-robin-scorecard-${players}-${rounds}.csv`,
      getScorecardCsv(schedule, players),
    );
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

  return (
    <Container pt={6}>
      <Stack gap={6}>
        <header>
          <Heading as="h1" size="2xl" fontWeight="bold">
            🏆 Round robin
          </Heading>
        </header>
        {!isStarted && (
          <Stack>
            <Stack direction="row">
              <Field.Root>
                <Field.Label>Players</Field.Label>
                <Input
                  type="number"
                  defaultValue={10}
                  step={1}
                  min={8}
                  max={20}
                  onChange={(e) => setPlayers(Number(e.target.value))}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Rounds</Field.Label>
                <Input
                  type="number"
                  defaultValue={8}
                  step={2}
                  min={6}
                  max={players}
                  onChange={(e) => setRounds(Number(e.target.value))}
                />
              </Field.Root>
            </Stack>
            <Stack>
              {genArr(players).map((i) => (
                <Field.Root key={i}>
                  <Input
                    placeholder={`Player ${i + 1} name`}
                    value={names[i]}
                    type="text"
                    onChange={(e) => setPlayerName(e.target.value, i)}
                  />
                </Field.Root>
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
                    <Table.Row>
                      <Table.ColumnHeader>Round</Table.ColumnHeader>
                      <Table.ColumnHeader>Team A</Table.ColumnHeader>
                      <Table.ColumnHeader>Team B</Table.ColumnHeader>
                      <Table.ColumnHeader>Team C</Table.ColumnHeader>
                      <Table.ColumnHeader>Team D</Table.ColumnHeader>
                      {hasSubs && <Table.ColumnHeader>Subs</Table.ColumnHeader>}
                      <Table.ColumnHeader>Results</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {schedule.map((round, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{i + 1}</Table.Cell>
                        {round.teams.map((team, j) => (
                          <Table.Cell key={j}>
                            {team.map((p) => p + 1).join(", ")}
                          </Table.Cell>
                        ))}
                        {hasSubs && (
                          <Table.Cell>
                            {round.subs.map((s) => s + 1).join(", ")}
                          </Table.Cell>
                        )}
                        <Table.Cell>
                          <Stack direction="row">
                            {results[i].map((res) => (
                              <Badge>{res.join(" - ")}</Badge>
                            ))}
                            <ResultsEditor
                              round={i}
                              roundResult={results[i]}
                              onSave={(result) => setResult(result, i)}
                              isSubRound={hasSubs && i === results.length - 1}
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
                  <Table.Header>
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
                    {genArr(players).map((p) => (
                      <Table.Row key={p}>
                        <Table.Cell>{p + 1}</Table.Cell>
                        <Table.Cell>{names[p] || "Unknown"}</Table.Cell>
                        {playerScores[p].scores.map((score, j) => (
                          <Table.Cell key={j}>{score}</Table.Cell>
                        ))}
                        <Table.Cell>
                          <strong>{playerScores[p].total}</strong>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>
            </Stack>
          </>
        )}
        <Stack direction="row">
          {!isStarted && (
            <Button colorPalette="green" onClick={start}>
              Start
            </Button>
          )}
          {isStarted && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button colorPalette="red">Stop</Button>
              </Dialog.Trigger>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.CloseTrigger />
                  <Dialog.Header>
                    <Dialog.Title>Stop</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    Are you sure you want to stop the round robin?
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger>
                      <Stack direction="row">
                        <Button colorPalette="red" onClick={stop}>
                          Yes
                        </Button>
                        <Button>Cancel</Button>
                      </Stack>
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger>
                    <CloseButton />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Dialog.Root>
          )}
          <Button onClick={downloadScorecard}>Download scorecard</Button>
          <Button onClick={downloadSchedule}>Download schedule</Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
