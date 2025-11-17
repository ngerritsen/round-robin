import { useMemo, useState } from "react";
import {
  Container,
  Field,
  Input,
  Stack,
  Table,
  Heading,
  Button,
} from "@chakra-ui/react";
import { generateSchedule } from "./utils/schedule";
import { getScheduleCsv, getScorecardCsv } from "./utils/csv";
import { downloadAsFile } from "./utils/download";

function App() {
  const [players, setPlayers] = useState(10);
  const [rounds, setRounds] = useState(8);
  const schedule = useMemo(
    () => generateSchedule(players, rounds),
    [players, rounds],
  );

  const hasSubs = schedule[0]?.subs.length > 0;

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

  return (
    <Container pt={6}>
      <Stack gap={6}>
        <header>
          <Heading as="h1" size="2xl" fontWeight="bold">
            🏆 Round robin
          </Heading>
        </header>
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
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Stack>
        <Stack direction="row">
          <Button onClick={downloadScorecard}>Download scorecard</Button>
          <Button onClick={downloadSchedule}>Download schedule</Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
