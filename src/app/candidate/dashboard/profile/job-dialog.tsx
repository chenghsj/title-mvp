import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { camelCase } from 'lodash';
import { useServerAction } from 'zsa-react';
import { FormFieldWithCombobox } from '@/components/form-field-with-combobox';
import { FormFieldWithDatePicker } from '@/components/form-field-with-date-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { JobExperience } from '@/db/schema/candidate';
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
import { EmploymentType, employmentTypes } from './types';

type Props = {
  jobExperience?: JobExperience;
};

const useGetTranslations = () => {
  const tResponsiveDialog = useTranslations('components.responsiveDialog');
  const tProfileJobExperience = useTranslations('profile.jobExperience');
  const tProfileJobExperienceForm = useTranslations(
    'profile.jobExperience.form'
  );
  const tProfileJobExperienceEmploymentTypes = useTranslations(
    'profile.jobExperience.employmentTypes'
  );

  return {
    tResponsiveDialog,
    tProfileJobExperience,
    tProfileJobExperienceForm,
    tProfileJobExperienceEmploymentTypes,
  };
};

export const JobDialog = ({ jobExperience }: Props) => {
  const {
    tResponsiveDialog,
    tProfileJobExperience,
    tProfileJobExperienceForm,
    tProfileJobExperienceEmploymentTypes,
  } = useGetTranslations();

  const { toast } = useToast();
  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();
  const { shouldReturn } = useReturnByFormType('JobExperience');

  const formattedEmploymentTypes = useMemo(
    () =>
      employmentTypes.map((employmentType) => ({
        value: employmentType,
        label: tProfileJobExperienceEmploymentTypes(
          camelCase(
            employmentType
          ) as keyof IntlMessages['profile']['jobExperience']['employmentTypes']
        ),
      })),
    []
  );

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
      onSuccess: ({ data }) => {
        toast({
          title: data.message.title,
          description: data.message.description,
        });
        dialogState.setIsOpen(false);
      },
      onError: ({ err }) => {
        console.log(err.message);
        toast({
          title: err.code,
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

  const formContent = (footer: React.ReactNode) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel>
                  {tProfileJobExperienceForm('labels.title')}
                </FormLabel>
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
                <FormLabel>
                  {tProfileJobExperienceForm('labels.company')}
                </FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormFieldWithCombobox
            form={form}
            name='employmentType'
            label={tProfileJobExperienceForm('labels.employmentType')}
            data={formattedEmploymentTypes}
            placeholder={tProfileJobExperienceForm(
              'placeholders.employmentType'
            )}
            formItemProps={{
              className: 'col-span-2 sm:col-span-1',
            }}
            hideSearch
          />
          <FormFieldWithDatePicker
            form={form}
            label={tProfileJobExperienceForm('labels.startFrom')}
            name='startDate'
            formItemProps={{
              className: 'col-span-2 sm:col-span-1',
            }}
            buttonProps={{
              disabled: isPending,
            }}
          />
          <FormFieldWithDatePicker
            form={form}
            label={tProfileJobExperienceForm('labels.endAt')}
            name='endDate'
            formItemProps={{
              className: 'col-span-2 sm:col-span-1',
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
                <FormLabel className='leading-6'>
                  {tProfileJobExperienceForm('labels.description')}
                </FormLabel>
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
      title={tProfileJobExperience('dialogTitle', {
        mode:
          dialogState.mode === 'Add'
            ? tResponsiveDialog('buttons.add')
            : tResponsiveDialog('buttons.edit'),
        title: tProfileJobExperience('title'),
      })}
      content={formContent}
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
