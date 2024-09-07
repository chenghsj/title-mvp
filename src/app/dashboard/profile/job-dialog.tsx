import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDialog, useMode } from './hooks';

type Props = {};

export const JobDialog = (props: Props) => {
  const dialog = useDialog();
  const mode = useMode();

  if (dialog.type !== 'Job') return null;

  return (
    <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode.mode} Job</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
