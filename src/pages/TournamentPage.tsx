import { useNavigate } from "@tanstack/react-router";
import { useAppContext } from "../AppContext";
import ResultsEditor from "../ResultsEditor";
import StopDialog from "../StopDialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold tracking-tight">Schedule</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Round</TableHead>
              {genArr(4).map((t) => (
                <TableHead key={t}>{getTeamName(t)}</TableHead>
              ))}
              {hasSubs && <TableHead>Subs</TableHead>}
              <TableHead>Results</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((round, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                {round.teams.map((team, j) => (
                  <TableCell key={j}>{team.map((p) => p + 1).join(", ")}</TableCell>
                ))}
                {hasSubs && (
                  <TableCell>{round.subs.map((s) => s + 1).join(", ")}</TableCell>
                )}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {results[i].map((res, k) =>
                      res.length ? (
                        <Badge key={k} variant="outline">
                          {res.join(" - ")}
                        </Badge>
                      ) : null,
                    )}
                  </div>
                </TableCell>
                <TableCell className="w-12">
                  <div className="flex justify-end">
                    <ResultsEditor
                      round={i}
                      roundResult={results[i]}
                      onSave={(result) => setResult(result, i)}
                      isSubRound={hasSubs && i === results.length - 1}
                      schedule={schedule}
                      names={names}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold tracking-tight">Scores</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Player</TableHead>
              {schedule.map((_, i) => (
                <TableHead key={i}>{i + 1}</TableHead>
              ))}
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id + 1}</TableCell>
                <TableCell>{p.name || "Unknown"}</TableCell>
                {p.scores.map((score, j) => (
                  <TableCell key={j}>{score}</TableCell>
                ))}
                <TableCell className="font-bold">{p.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={downloadScores}>
          Download scores
        </Button>
        <StopDialog stop={handleStop} />
      </div>
    </div>
  );
};

export default TournamentPage;
