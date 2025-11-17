import {
  Field,
  Input,
  Stack,
  Button,
  Dialog,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { RoundResult } from "./types";

type Props = {
  onSave: (result: RoundResult) => void;
  roundResult: RoundResult;
  round: number;
  isSubRound: boolean;
};

const ResultsEditor = ({ round, onSave, roundResult, isSubRound }: Props) => {
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
            <Stack>
              <Stack direction="row">
                <Field.Root>
                  <Field.Label>Team A</Field.Label>
                  <Input
                    type="number"
                    defaultValue={0}
                    value={results[0]}
                    step={1}
                    onChange={(e) => setResult(Number(e.target.value), 0)}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Team B</Field.Label>
                  <Input
                    type="number"
                    defaultValue={0}
                    value={results[1]}
                    step={1}
                    onChange={(e) => setResult(Number(e.target.value), 1)}
                  />
                </Field.Root>
              </Stack>
              {!isSubRound && (
                <>
                  <Stack direction="row">
                    <Field.Root>
                      <Field.Label>Team C</Field.Label>
                      <Input
                        type="number"
                        defaultValue={0}
                        value={results[2]}
                        step={1}
                        onChange={(e) => setResult(Number(e.target.value), 2)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Team D</Field.Label>
                      <Input
                        type="number"
                        defaultValue={0}
                        value={results[3]}
                        step={1}
                        onChange={(e) => setResult(Number(e.target.value), 3)}
                      />
                    </Field.Root>
                  </Stack>
                </>
              )}
            </Stack>
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
