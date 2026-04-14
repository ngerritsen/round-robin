import { Field, Input, Stack, Button, Grid, InputGroup } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useAppContext } from "../AppContext";
import { genArr } from "../utils/array";

const SetupPage = () => {
  const { players, setPlayers, rounds, setRounds, names, setPlayerName, start, downloadScorecard, downloadSchedule } =
    useAppContext();
  const navigate = useNavigate();

  const handleStart = () => {
    start();
    navigate({ to: "/tournament" });
  };

  return (
    <Stack>
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
      <Stack gap={3}>
        <Button colorPalette="green" onClick={handleStart}>
          Start
        </Button>
        <Grid templateColumns="1fr 1fr" gap={3}>
          <Button onClick={downloadScorecard}>Download scorecard</Button>
          <Button onClick={downloadSchedule}>Download schedule</Button>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default SetupPage;
