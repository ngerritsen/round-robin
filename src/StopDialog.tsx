import Modal from "./components/Modal";
import { Button } from "./components/ui/button";
import { DialogClose } from "./components/ui/dialog";

type Props = {
  stop: () => void;
};

const StopDialog = ({ stop }: Props) => (
  <Modal
    trigger={<Button variant="destructive">Stop</Button>}
    title="Stop tournament"
    body="Are you sure you want to stop the round robin?"
    footer={
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button variant="destructive" onClick={stop}>
            Yes
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </div>
    }
  />
);

export default StopDialog;
