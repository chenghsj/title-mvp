import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { camelCase } from 'lodash';
import { useServerAction } from 'zsa-react';
import { FormDatePicker } from '@/components/form-date-picker';
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
import { DegreeType, degrees } from './types';

type Props = {
  education?: Education;
};

const useGetTranslations = () => {
  const tErrorMessages = useTranslations('errorMessages');
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tProfileEducations = useTranslations('profile.educations');
  const tProfileEducationsForm = useTranslations('profile.educations.form');
  const tProfileEducationsDegrees = useTranslations(
    'profile.educations.degrees'
  );

  return {
    tErrorMessages,
    tComponentsResponsiveDialog,
    tProfileEducations,
    tProfileEducationsForm,
    tProfileEducationsDegrees,
  };
};

export const EducationDialog = ({ education }: Props) => {
  const {
    tErrorMessages,
    tComponentsResponsiveDialog,
    tProfileEducations,
    tProfileEducationsForm,
    tProfileEducationsDegrees,
  } = useGetTranslations();

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
          title: 'Error',
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

  const formContent = (footer: ReactNode) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='degree'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel>{tProfileEducationsForm('labels.degree')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={tProfileEducationsForm(
                          'placeholders.degree'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                      {degrees.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {tProfileEducationsDegrees(
                            camelCase(
                              degree
                            ) as keyof IntlMessages['profile']['educations']['degrees']
                          )}
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
                <FormLabel>{tProfileEducationsForm('labels.school')}</FormLabel>
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
                <FormLabel>
                  {tProfileEducationsForm('labels.fieldOfStudy')}
                </FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormDatePicker
            form={form}
            label={tProfileEducationsForm('labels.startFrom')}
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
            label={tProfileEducationsForm('labels.endAt')}
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
                <FormLabel>
                  {tProfileEducationsForm('labels.description')}
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
      title={tProfileEducations('dialogTitle', {
        mode:
          dialogState.mode === 'Add'
            ? tComponentsResponsiveDialog('buttons.add')
            : tComponentsResponsiveDialog('buttons.edit'),
        title: tProfileEducations('title'),
      })}
      content={formContent}
      submitButton={{
        title:
          dialogState.mode === 'Add'
            ? tComponentsResponsiveDialog('buttons.add')
            : tComponentsResponsiveDialog('buttons.save'),
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
