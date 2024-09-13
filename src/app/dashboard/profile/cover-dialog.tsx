import { useState } from 'react';
import { FileUploader } from '@/components/file-uploader/file-uploader';
import { LoaderButton } from '@/components/loader-button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/config/app';
import { useDialogState } from '@/hooks/store';
import { useReturnByFormType } from './hooks';

type Props = {};

export const CoverDialog = (props: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const dialogState = useDialogState();
  const { shouldReturn } = useReturnByFormType('Cover');

  const onSubmit = () => {
    console.log('clicked');
  };

  if (shouldReturn) return null;

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={dialogState.setIsOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{dialogState.mode} Cover</DialogTitle>
        </DialogHeader>
        <FileUploader
          description={`Drag 'n' drop file here, or click to select a file.`}
          value={files}
          onValueChange={setFiles}
          maxFileCount={1}
          maxSize={MAX_UPLOAD_IMAGE_SIZE}
        />
        <DialogFooter>
          <LoaderButton
            onClick={onSubmit}
            disabled={files.length === 0}
            isLoading={false}
          >
            Upload
          </LoaderButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
