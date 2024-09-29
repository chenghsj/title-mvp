import { ReactNode, useEffect } from 'react';
import { DropzoneOptions } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Paperclip } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/extension/file-uploader';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/config/app';
import { useDialogState } from '@/hooks/store';
import { updateProfileImageAction } from './actions';
import {
  UpdateProfileImageFormSchema,
  UpdateProfileImageFormSchemaType,
} from './form-schema';
import { FormType, useReturnByFormType } from './hooks';
import { ProfileImage } from './types';

type Props = {
  formType: Extract<FormType, 'Cover' | 'Avatar'>;
  type: ProfileImage;
};

export const UploadImageDialog = ({ formType, type }: Props) => {
  const tProfileImage = useTranslations(`profile.image`);
  const { toast } = useToast();
  const dialogState = useDialogState();
  const { shouldReturn } = useReturnByFormType(formType);

  const form = useForm<UpdateProfileImageFormSchemaType>({
    resolver: zodResolver(UpdateProfileImageFormSchema),
    defaultValues: {
      files: null,
    },
  });

  const files = form.watch('files');

  const { execute: uploadImage, isPending } = useServerAction(
    updateProfileImageAction,
    {
      onError: ({ err }) => {
        toast({
          title: 'Error',
          description:
            err.message ||
            `Failed to update ${type === 'avatar' ? 'profile' : 'cover'} image.`,
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        dialogState.setIsOpen(false);
        toast({
          title: `${type === 'avatar' ? 'Profile' : 'Cover'} image updated`,
          description: `You've successfully updated your ${type === 'avatar' ? 'profile' : 'cover'} image.`,
        });
      },
    }
  );

  const dropzone = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_UPLOAD_IMAGE_SIZE,
  } satisfies DropzoneOptions;

  const onSubmit = (data: UpdateProfileImageFormSchemaType) => {
    const formData = new FormData();
    if (data.files && data.files.length > 0) {
      formData.append('file', data.files[0]);
    }
    uploadImage({ fileWrapper: formData, type });
  };

  const formContent = (footer: ReactNode) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='files'
          render={({ field }) => (
            <FormItem>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                dropzoneOptions={dropzone}
                reSelect={true}
                className='relative space-y-2 rounded-lg bg-background p-2'
              >
                <FileInput className='outline-dashed outline-2 outline-zinc-400'>
                  <div className='flex w-full flex-col items-center justify-center px-2 py-10 text-center'>
                    <FileSvgDraw />
                  </div>
                </FileInput>
                {field.value && field.value.length > 0 && (
                  <FileUploaderContent>
                    {field.value.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className='h-4 w-4' />
                        <span className='h-full w-[80%] overflow-hidden text-ellipsis'>
                          {file.name}
                        </span>
                      </FileUploaderItem>
                    ))}
                  </FileUploaderContent>
                )}
              </FileUploader>
            </FormItem>
          )}
        />
        {form.formState.errors && (
          <div className='text-sm text-destructive'>
            {Object.values(form.formState.errors).map((error) => (
              <p key={error.message}>{error.message}</p>
            ))}
          </div>
        )}
        {footer}
      </form>
    </Form>
  );

  useEffect(() => {
    if (dialogState.isOpen) {
      form.reset();
    }
  }, [dialogState.isOpen]);

  if (shouldReturn) return null;

  return (
    <ResponsiveDialog
      title={tProfileImage('dialogTitle', {
        mode: dialogState.mode === 'Edit' && tProfileImage('buttons.upload'),
        type: tProfileImage(`type.${type}`),
        title: tProfileImage('title'),
      })}
      content={formContent}
      submitButton={{
        title: tProfileImage('buttons.upload'),
        props: {
          isLoading: isPending,
          disabled: !files || files?.length < 1 || isPending,
        },
      }}
      dialogContentProps={{
        className: 'w-[90%] max-w-[400px] rounded-lg',
      }}
    />
  );
};

const FileSvgDraw = () => {
  const tProfileImage = useTranslations('profile.image');
  return (
    <>
      <svg
        className='mb-3 h-8 w-8 text-gray-500 dark:text-gray-400'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 20 16'
      >
        <path
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
        />
      </svg>
      <p className='mb-1 text-sm font-semibold text-gray-500 dark:text-gray-400'>
        {tProfileImage('uploadMessage')}
      </p>
    </>
  );
};
