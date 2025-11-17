import { Dialog, Button, Stack } from "@chakra-ui/react";
import Modal from "./components/Modal";

type Props = {
  stop: () => void;
};

const StopDialog = ({ stop }: Props) => {
  return (
    <Modal
      trigger={<Button colorPalette="red">Stop</Button>}
      title="Stop tournament"
      body="Are you sure you want to stop the round robin?"
      footer={
        <Dialog.ActionTrigger>
          <Stack direction="row">
            <Button colorPalette="red" onClick={stop}>
              Yes
            </Button>
            <Button>Cancel</Button>
          </Stack>
        </Dialog.ActionTrigger>
      }
    />
  );
};

export default StopDialog;
