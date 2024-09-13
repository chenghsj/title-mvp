import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerAction } from 'zsa-react';
import { FormDatePicker } from '@/components/form-date-picker';
import { LoaderButton } from '@/components/loader-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Education } from '@/db/schema';
import { useDialogState } from '@/hooks/store';
import { createEducationAction, updateEducationAction } from './actions';
import { EducationFormSchema, EducationFormSchemaType } from './form-schema';
import { useProfileDialog, useReturnByFormType } from './hooks';
import { DegreeType, degrees } from './type';

type Props = {
  education?: Education;
};

export const EducationDialog = ({ education }: Props) => {
  const { toast } = useToast();
  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();
  const { shouldReturn } = useReturnByFormType('Education');

  const form = useForm<EducationFormSchemaType>({
    resolver: zodResolver(EducationFormSchema),
    mode: 'onChange',
    defaultValues: {
      degree: '' as DegreeType,
      institution: '',
      fieldOfStudy: '',
      startDate: undefined,
      endDate: undefined,
      description: '',
    },
    values: {
      degree: education?.degree || ('' as DegreeType),
      institution: education?.institution || '',
      fieldOfStudy: education?.fieldOfStudy || '',
      startDate: education?.startDate
        ? new Date(education.startDate)
        : (undefined as unknown as Date),
      endDate: education?.endDate ? new Date(education.endDate) : undefined,
      description: education?.description || '',
    },
  });

  const { execute, isPending } = useServerAction(
    dialogState.mode === 'Add' ? createEducationAction : updateEducationAction,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: `Education ${dialogState.mode === 'Add' ? 'created' : 'updated'}`,
        });
        dialogState.setIsOpen(false);
      },
      onError: ({ err }) => {
        console.log(err.message);
        toast({
          title: 'Something went wrong',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const onSubmit = (values: EducationFormSchemaType) => {
    if (dialogState.mode === 'Edit') {
      execute({ ...values, educationId: profileDialog.educationId! });
    } else {
      execute(values);
    }
  };

  useEffect(() => {
    if (dialogState.isOpen) {
      form.reset();
    }
  }, [dialogState.isOpen]);

  if (shouldReturn) return null;

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={dialogState.setIsOpen}>
      <DialogContent
        className='w-[90%] max-w-[800px] rounded-lg'
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{dialogState.mode} Education</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='degree'
                render={({ field }) => (
                  <FormItem className='col-span-2 sm:col-span-1'>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select a degree' />
                        </SelectTrigger>
                        <SelectContent>
                          {degrees.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='col-span-1 hidden sm:block' />
              <FormField
                control={form.control}
                name='institution'
                render={({ field }) => (
                  <FormItem className='col-span-2 sm:col-span-1'>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fieldOfStudy'
                render={({ field }) => (
                  <FormItem className='col-span-2 sm:col-span-1'>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormDatePicker
                form={form}
                label='Start From'
                name='startDate'
                formItemProps={{
                  className: 'col-span-2 sm:col-span-1',
                }}
                buttonProps={{
                  disabled: isPending,
                }}
              />
              <FormDatePicker
                form={form}
                label='End At'
                name='endDate'
                formItemProps={{
                  className: 'col-span-2 sm:col-span-1',
                }}
                buttonProps={{
                  disabled: isPending || !form.getValues('startDate'),
                }}
                calendarProps={{
                  disabled: (date) =>
                    date > new Date() || date <= form.getValues('startDate'),
                }}
              />
              <FormField
                disabled={false}
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='col-span-2 flex h-full flex-col'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        className='flex-auto'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='gap-y-3'>
              <DialogClose asChild>
                <Button disabled={isPending} type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <LoaderButton
                disabled={
                  isPending ||
                  (dialogState.mode === 'Edit' &&
                    Object.keys(form.formState.dirtyFields).length === 0)
                }
                type='submit'
                isLoading={isPending}
              >
                {dialogState.mode === 'Add' ? 'Add' : 'Save'}
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
