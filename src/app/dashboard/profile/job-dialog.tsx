import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDialogState } from '@/hooks/store';
import { useReturnbyFormType } from './hooks';

type Props = {};

export const JobDialog = (props: Props) => {
  const dialogState = useDialogState();
  const { shouldReturn } = useReturnbyFormType('Job');

  if (shouldReturn) return null;

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={dialogState.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogState.mode} Job</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
