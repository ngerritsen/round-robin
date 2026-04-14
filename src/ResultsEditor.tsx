import { useEffect, useState } from "react";
import type { RoundResult, Schedule } from "./types";
import Modal from "./components/Modal";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { DialogClose } from "./components/ui/dialog";
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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{getTeamName(index)}</label>
      <Input
        inputMode="numeric"
        value={results[index]}
        onChange={(e) => setResult(Number(e.target.value), index)}
      />
      <p className="text-xs text-muted-foreground" style={{ whiteSpace: "normal" }}>
        {schedule[round].teams[index].map((p) => names[p] || "?").join(", ")}
      </p>
    </div>
  );

  return (
    <Modal
      trigger={
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-base">
          ✏️
        </Button>
      }
      title={`Round ${round + 1}`}
      body={
        <div className="grid grid-cols-2 gap-4">
          {renderField(0)}
          {renderField(1)}
          {!isSubRound && (
            <>
              {renderField(2)}
              {renderField(3)}
            </>
          )}
        </div>
      }
      footer={
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button onClick={save}>Save</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      }
    />
  );
};

export default ResultsEditor;
