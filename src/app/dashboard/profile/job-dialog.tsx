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
import { JobExperience } from '@/db/schema';
import { useDialogState } from '@/hooks/store';
import {
  createJobExperienceAction,
  updateJobExperienceAction,
} from './actions';
import {
  JobExperienceFormSchema,
  JobExperienceFormSchemaType,
} from './form-schema';
import { useProfileDialog, useReturnByFormType } from './hooks';
import { EmploymentType, employmentTypes } from './type';

type Props = {
  jobExperience?: JobExperience;
};

export const JobDialog = ({ jobExperience }: Props) => {
  const { toast } = useToast();
  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();
  const { shouldReturn } = useReturnByFormType('Job');

  const form = useForm<JobExperienceFormSchemaType>({
    resolver: zodResolver(JobExperienceFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      employmentType: '' as EmploymentType,
      company: '',
      startDate: undefined,
      endDate: undefined,
      description: '',
    },
    values: {
      title: jobExperience?.title || '',
      employmentType: jobExperience?.employmentType || ('' as EmploymentType),
      company: jobExperience?.company || '',
      startDate: jobExperience?.startDate
        ? new Date(jobExperience.startDate)
        : (undefined as unknown as Date),
      endDate: jobExperience?.endDate
        ? new Date(jobExperience.endDate)
        : undefined,
      description: jobExperience?.description || '',
    },
  });

  const { execute, isPending } = useServerAction(
    dialogState.mode === 'Add'
      ? createJobExperienceAction
      : updateJobExperienceAction,
    {
      onSuccess: () => {
        console.log(dialogState.mode);
        toast({
          title: 'Success',
          description: `Job Experience ${dialogState.mode === 'Add' ? 'created' : 'updated'}`,
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

  const onSubmit = (values: JobExperienceFormSchemaType) => {
    if (dialogState.mode === 'Edit') {
      execute({ ...values, jobExperienceId: profileDialog.jobId! });
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
          <DialogTitle>{dialogState.mode} Job Experience</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='col-span-2 sm:col-span-1'>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='col-span-1 hidden sm:block' />
              <FormField
                control={form.control}
                name='company'
                render={({ field }) => (
                  <FormItem className='col-span-2 sm:col-span-1'>
                    <FormLabel>Complay</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='employmentType'
                render={({ field }) => (
                  <FormItem className='col-span-2 sm:col-span-1'>
                    <FormLabel>Employment Type</FormLabel>
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
                          {employmentTypes.map((type, index) => (
                            <SelectItem key={index} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
