import { Stack, Table, Heading, Button, Badge, Grid } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useAppContext } from "../AppContext";
import ResultsEditor from "../ResultsEditor";
import StopDialog from "../StopDialog";
import { genArr } from "../utils/array";
import { getTeamName } from "../utils/string";

const TournamentPage = () => {
  const { schedule, results, setResult, hasSubs, sortedPlayers, names, stop, downloadScores } =
    useAppContext();
  const navigate = useNavigate();

  const handleStop = () => {
    stop();
    navigate({ to: "/" });
  };

  return (
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
                  <Table.ColumnHeader key={t}>{getTeamName(t)}</Table.ColumnHeader>
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
                      {results[i].map((res, k) =>
                        res.length ? (
                          <Badge key={k} variant="outline">{res.join(" - ")}</Badge>
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
                  <Table.Cell fontWeight="bold">{p.total}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Stack>
      <Stack gap={3}>
        <Grid templateColumns="1fr 1fr" gap={3}>
          <Button onClick={downloadScores}>Download scores</Button>
          <StopDialog stop={handleStop} />
        </Grid>
      </Stack>
    </>
  );
};

export default TournamentPage;
