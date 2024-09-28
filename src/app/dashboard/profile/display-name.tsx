import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { useDialogState } from '@/hooks/store';
import { updateDisplayNameAction } from './actions';
import { DisplayNameSchema, DisplayNameSchemaType } from './form-schema';

type Props = {
  displayName: string;
};

export const DisplayName = ({ displayName }: Props) => {
  const tProfileDisplayName = useTranslations('profile.displayName');
  const dialogState = useDialogState();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<DisplayNameSchemaType>({
    resolver: zodResolver(DisplayNameSchema),
    mode: 'onChange',
    defaultValues: {
      displayName,
    },
  });

  const { execute } = useServerAction(updateDisplayNameAction, {
    onError: ({ err }) => {
      console.error(err);
    },
    onSuccess: () => {
      setIsEditing(false);
      toast({
        title: 'Name updated',
        description: 'Your name has been updated successfully',
      });
    },
  });

  const onSubmit = (values: DisplayNameSchemaType) => {
    if (Object.keys(form.formState.dirtyFields).length === 0) {
      setIsEditing(false);
      return;
    }
    execute(values);
  };

  useEffect(() => {
    if (dialogState.isOpen) {
      setIsEditing(false);
    }
  }, [dialogState.isOpen]);

  return isEditing ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col items-start gap-2'
      >
        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <Popover open={true}>
              <PopoverTrigger onClick={(e) => e.preventDefault()} asChild>
                <FormItem className='relative w-full'>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              </PopoverTrigger>
              {form.formState.errors.displayName?.message ? (
                <PopoverContent
                  className='w-fit p-2'
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  side='top'
                  align='start'
                  sideOffset={5}
                >
                  <FormMessage />
                </PopoverContent>
              ) : null}
            </Popover>
          )}
        />
        <div className='flex gap-2'>
          <Button type='submit'>{tProfileDisplayName('buttons.save')}</Button>
          <Button
            type='button'
            variant={'secondary'}
            onClick={() => setIsEditing(false)}
          >
            {tProfileDisplayName('buttons.cancel')}
          </Button>
        </div>
      </form>
    </Form>
  ) : (
    <div className='text-md relative flex w-full items-center justify-between break-all font-bold sm:text-lg'>
      {displayName}
      <Button
        variant={'ghost'}
        size={'icon'}
        className='ml-2 h-7 w-7'
        onClick={() => setIsEditing(true)}
      >
        <Pencil size={16} />
      </Button>
    </div>
  );
};
