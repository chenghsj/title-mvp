import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { camelCase } from 'lodash';
import { useServerAction } from 'zsa-react';
import { FormCombobox } from '@/components/form-combobox';
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


import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Education } from '@/db/schema';
import { useDialogState } from '@/hooks/store';
import { createEducationAction, updateEducationAction } from './actions';
import colleages from './data/colleage_list.json';
import highSchools from './data/high_school_list.json';
import { EducationFormSchema, EducationFormSchemaType } from './form-schema';
import { useProfileDialog, useReturnByFormType } from './hooks';
import { DegreeType, degrees } from './types';

type Props = {
  education?: Education;
};

const useGetTranslations = () => {
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tProfileEducation = useTranslations('profile.education');
  const tProfileEducationForm = useTranslations('profile.education.form');
  const tProfileEducationDegrees = useTranslations('profile.education.degrees');

  return {
    tComponentsResponsiveDialog,
    tProfileEducation,
    tProfileEducationForm,
    tProfileEducationDegrees,
  };
};

export const EducationDialog = ({ education }: Props) => {
  const {
    tComponentsResponsiveDialog,
    tProfileEducation,
    tProfileEducationForm,
    tProfileEducationDegrees,
  } = useGetTranslations();

  const { toast } = useToast();
  const dialogState = useDialogState();
  const profileDialog = useProfileDialog();
  const { shouldReturn } = useReturnByFormType('Education');

  const [prevDegree, setPrevDegree] = useState<DegreeType | null>(null);

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
      onSuccess: ({ data }) => {
        toast({
          title: data.message.title,
          description: data.message.description,
        });
        dialogState.setIsOpen(false);
      },
      onError: ({ err }) => {
        toast({
          title: err.code,
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

  const degree = form.watch('degree');
  const institution = form.watch('institution');

  const formattedDegrees = useMemo(
    () =>
      degrees.map((degree) => ({
        value: degree,
        label: tProfileEducationDegrees(
          camelCase(
            degree
          ) as keyof IntlMessages['profile']['education']['degrees']
        ),
      })),
    []
  );

  const formattedHighSchools = useMemo(
    () => highSchools.map((school) => ({ value: school, label: school })),
    []
  );

  const formattedColleages = useMemo(
    () => Object.keys(colleages).map((key) => ({ value: key, label: key })),
    []
  );

  const insitutionData = useMemo(() => {
    if (!degree) return [];
    if (degree === 'High School') return formattedHighSchools;
    return formattedColleages;
  }, [degree]);

  const formattedDepartments = useMemo(() => {
    if (institution) {
      return colleages[institution as keyof typeof colleages]?.map(
        (department) => ({
          value: department,
          label: department,
        })
      );
    }
    return [];
  }, [institution]);

  const formContent = (footer: ReactNode) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <FormCombobox
            form={form}
            name='degree'
            label={tProfileEducationForm('labels.degree')}
            placeholder={tProfileEducationForm('placeholders.degree')}
            data={formattedDegrees}
            hideSearch
            formItemProps={{
              className: 'col-span-2 sm:col-span-1',
            }}
          />
          <div className='col-span-1 hidden sm:block' />
          <FormCombobox
            form={form}
            name='institution'
            label={tProfileEducationForm('labels.school')}
            placeholder={tProfileEducationForm('placeholders.school')}
            data={insitutionData}
            formItemProps={{
              className: 'col-span-2 sm:col-span-1',
            }}
          />
          <FormCombobox
            form={form}
            name='fieldOfStudy'
            label={tProfileEducationForm('labels.fieldOfStudy')}
            placeholder={tProfileEducationForm('placeholders.fieldOfStudy')}
            data={degree === 'High School' ? [] : formattedDepartments}
            formItemProps={{
              className: 'col-span-2 sm:col-span-1',
            }}
          />
          <FormDatePicker
            form={form}
            label={tProfileEducationForm('labels.startFrom')}
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
            label={tProfileEducationForm('labels.endAt')}
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
                <FormLabel className='leading-5'>
                  {tProfileEducationForm('labels.description')}
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

  useEffect(() => {
    if (institution !== education?.institution) {
      form.setValue('fieldOfStudy', '');
    }
  }, [institution]);

  useEffect(() => {
    if (prevDegree === 'High School' && degree !== education?.degree) {
      form.setValue('institution', '');
    }
    if (degree === 'High School') {
      form.trigger('fieldOfStudy');
    }
    setPrevDegree(degree);
  }, [degree, prevDegree]);

  if (shouldReturn) return null;

  return (
    <ResponsiveDialog
      title={tProfileEducation('dialogTitle', {
        mode:
          dialogState.mode === 'Add'
            ? tComponentsResponsiveDialog('buttons.add')
            : tComponentsResponsiveDialog('buttons.edit'),
        title: tProfileEducation('title'),
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
