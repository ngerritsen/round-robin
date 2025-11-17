import { Field, Input, Stack, Button, Dialog, CloseButton, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { RoundResult, Schedule } from "./types";

type Props = {
  onSave: (result: RoundResult) => void;
  roundResult: RoundResult;
  round: number;
  isSubRound: boolean;
  schedule: Schedule;
  names: string[];
};

const ResultsEditor = ({ round, onSave, roundResult, isSubRound, schedule, names }: Props) => {
  const defaultValue = isSubRound ? [0, 0] : [0, 0, 0, 0];
  const [results, setResults] = useState<number[]>(
    roundResult.length ? roundResult.flat() : defaultValue,
  );

  useEffect(() => {
    setResults(roundResult.length ? roundResult.flat() : defaultValue);
  }, [roundResult]);

  const save = () => {
    onSave([results.slice(0, 2), results.slice(2)]);
  };

  const setResult = (result: number, index: number) => {
    setResults(results.map((r, i) => (i === index ? result : r)));
  };

  const renderField = (index: number) => (
    <Field.Root>
      <Field.Label>Team {String.fromCharCode(65 + index)}</Field.Label>
      <Input
        type="number"
        defaultValue={0}
        value={results[index]}
        step={1}
        onChange={(e) => setResult(Number(e.target.value), index)}
      />
      <Field.HelperText>
        {schedule[round].teams[index].map((p) => names[p] || "?").join(", ")}
      </Field.HelperText>
    </Field.Root>
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="surface" size="xs">
          ✏️
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Round {round + 1} results</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Grid templateColumns="1fr 1fr" gap={3}>
              {renderField(0)}
              {renderField(1)}
              {!isSubRound && (
                <>
                  {renderField(2)}
                  {renderField(3)}
                </>
              )}
            </Grid>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger>
              <Stack direction="row">
                <Button colorPalette="blue" onClick={save}>
                  Save
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
  );
};

export default ResultsEditor;
