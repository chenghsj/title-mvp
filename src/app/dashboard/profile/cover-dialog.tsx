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
import { useDialog, useMode } from './hooks';

type Props = {};

export const CoverDialog = (props: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const dialog = useDialog();
  const mode = useMode();

  if (dialog.type !== 'Cover') return null;

  const onSubmit = () => {
    console.log('clicked');
  };

  return (
    <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode.mode} Cover</DialogTitle>
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
