import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerAction } from 'zsa-react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useDialogState } from '@/hooks/store';
import { updateDisplayNameAction } from './actions';
import { DisplayNameSchema, DisplayNameSchemaType } from './form-schema';
import { useReturnByFormType } from './hooks';

type Props = {
  displayName: string;
};

export const DisplayNameDialog = ({ displayName }: Props) => {
  const tResponsiveDialog = useTranslations('components.responsiveDialog');
  const tProfileDisplayName = useTranslations(`profile.displayName`);
  const tProfileDisplayNameFormLabels = useTranslations(
    'profile.displayName.form.labels'
  );

  const { toast } = useToast();
  const dialogState = useDialogState();
  const { shouldReturn } = useReturnByFormType('DisplayName');

  const form = useForm<DisplayNameSchemaType>({
    resolver: zodResolver(DisplayNameSchema),
    mode: 'onChange',
    defaultValues: {
      displayName,
    },
  });

  const { execute, isPending } = useServerAction(updateDisplayNameAction, {
    onError: ({ err }) => {
      console.error(err);
    },
    onSuccess: () => {
      dialogState.setIsOpen(false);
      toast({
        title: 'Name updated',
        description: 'Your name has been updated successfully',
      });
    },
  });

  const onSubmit = (values: DisplayNameSchemaType) => {
    execute(values);
  };

  const formContent = (footer: ReactNode) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <FormItem className='relative w-full'>
              <FormLabel>
                {tProfileDisplayNameFormLabels('displayName')}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      title={tProfileDisplayName('dialogTitle', {
        mode: dialogState.mode === 'Edit' && tResponsiveDialog('buttons.edit'),
        title: tProfileDisplayName('title'),
      })}
      content={formContent}
      dialogContentProps={{
        className: 'max-w-[500px]',
      }}
      submitButton={{
        title:
          dialogState.mode === 'Add'
            ? tResponsiveDialog('buttons.add')
            : tResponsiveDialog('buttons.save'),
        props: {
          isLoading: isPending,
          disabled:
            isPending ||
            (dialogState.mode === 'Edit' &&
              Object.keys(form.formState.dirtyFields).length === 0),
        },
      }}
      closeButton={{
        props: {
          disabled: isPending,
        },
      }}
    />
  );
};
