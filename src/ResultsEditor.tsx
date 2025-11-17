import { useEffect, useState } from "react";
import { Field, Input, Stack, Button, Dialog, Grid, IconButton } from "@chakra-ui/react";
import type { RoundResult, Schedule } from "./types";
import Modal from "./components/Modal";
import { getTeamName } from "./utils/string";
import { genArr } from "./utils/array";

type Props = {
  onSave: (result: RoundResult) => void;
  roundResult: RoundResult;
  round: number;
  isSubRound: boolean;
  schedule: Schedule;
  names: string[];
};

const ResultsEditor = ({ round, onSave, roundResult, isSubRound, schedule, names }: Props) => {
  const defaultValue = isSubRound ? genArr(2, 0) : genArr(4, 0);
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
      <Field.Label>{getTeamName(index)}</Field.Label>
      <Input
        inputMode="numeric"
        value={results[index]}
        onChange={(e) => setResult(Number(e.target.value), index)}
      />
      <Field.HelperText>
        {schedule[round].teams[index].map((p) => names[p] || "?").join(", ")}
      </Field.HelperText>
    </Field.Root>
  );

  return (
    <Modal
      trigger={
        <IconButton bg="bg.emphasized" size="xs" rounded="full">
          ✏️
        </IconButton>
      }
      title={`Round ${round + 1}`}
      body={
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
      }
      footer={
        <Dialog.ActionTrigger>
          <Stack direction="row">
            <Button colorPalette="blue" onClick={save}>
              Save
            </Button>
            <Button>Cancel</Button>
          </Stack>
        </Dialog.ActionTrigger>
      }
    />
  );
};

export default ResultsEditor;
