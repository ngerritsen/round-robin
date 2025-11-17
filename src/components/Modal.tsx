import { Dialog, CloseButton } from "@chakra-ui/react";

type Props = {
  trigger: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
};

const Modal = ({ trigger, title, body, footer }: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>{body}</Dialog.Body>
          {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
          <Dialog.CloseTrigger>
            <CloseButton />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default Modal;
