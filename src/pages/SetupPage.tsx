import { useNavigate } from "@tanstack/react-router";
import { useAppContext } from "../AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { genArr } from "../utils/array";

const SetupPage = () => {
  const {
    players,
    setPlayers,
    rounds,
    setRounds,
    names,
    setPlayerName,
    start,
    downloadScorecard,
    downloadSchedule,
  } = useAppContext();
  const navigate = useNavigate();

  const handleStart = () => {
    start();
    navigate({ to: "/tournament" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium">Players</label>
            <Input
              inputMode="numeric"
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium">Rounds</label>
            <Input
              inputMode="numeric"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {genArr(players).map((i) => (
            <div key={i} className="flex">
              <span className="flex select-none items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                {i + 1}
              </span>
              <Input
                className="rounded-l-none"
                placeholder={`Player ${i + 1} name`}
                value={names[i]}
                type="text"
                onChange={(e) => setPlayerName(e.target.value, i)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={handleStart}>Start</Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={downloadScorecard}>
            Download scorecard
          </Button>
          <Button variant="outline" onClick={downloadSchedule}>
            Download schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
