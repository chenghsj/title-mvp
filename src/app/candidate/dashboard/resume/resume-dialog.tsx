'use client';

import { useEffect, useRef } from 'react';
import { useController, useForm } from 'react-hook-form';
import ReactPlayer from 'react-player';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { camelCase } from 'lodash';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Education, JobExperience, Resume, Video } from '@/db/schema';
import { useDialogState } from '@/hooks/store';
import { FormType } from '../profile/hooks';
import { createResumeAction, updateResumeAction } from './actions';
import { ResumeFormSchema, ResumeFormSchemaType } from './form-schema';
import { useResumeDialog } from './hooks';

type Props = {
  resume?: Resume & { video?: Video };
  educations: Education[];
  jobExperiences: JobExperience[];
};

export const ResumeDialog = ({ resume, educations, jobExperiences }: Props) => {
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tErrorMessages = useTranslations('errorMessages');
  const tResume = useTranslations('resume');
  const tResumeFormLabels = useTranslations('resume.form.labels');
  const tResumeFormPlaceholders = useTranslations('resume.form.placeholders');
  const tResumeFormSelectItem = useTranslations('resume.form.selectItem');
  const tProfileEducationDegrees = useTranslations('profile.education.degrees');

  const { toast } = useToast();
  const { resumeId } = useResumeDialog();
  const dialogState = useDialogState();
  const playerRef = useRef<ReactPlayer>(null);

  const form = useForm<ResumeFormSchemaType>({
    resolver: zodResolver(ResumeFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      bio: '',
      url: '',
      duration: 0,
      educationId: -1,
      jobExperienceId: -1,
    },
    values: {
      url: resume?.video?.url || '',
      title: resume?.title || '',
      bio: resume?.bio || '',
      educationId: resume?.educationId || null,
      jobExperienceId: resume?.jobExperienceId || null,
    },
  });

  const url = form.watch('url');

  const { execute, isPending } = useServerAction(
    dialogState.mode === 'Add' ? createResumeAction : updateResumeAction,
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

  const { field: educationField } = useController({
    name: 'educationId',
    control: form.control,
  });
  const { field: jobExperiencField } = useController({
    name: 'jobExperienceId',
    control: form.control,
  });

  const handleSelectChange = (type: FormType) => (value: string) => {
    (type === 'Education' ? educationField : jobExperiencField).onChange(
      +value < 0 ? null : +value
    );
  };

  const onSubmit = (values: ResumeFormSchemaType) => {
    if (dialogState.mode === 'Edit') {
      execute({ ...values, resumeId: resumeId! });
    } else {
      execute(values);
    }
  };

  const handlePlayerReady = () => {
    const duration = playerRef.current?.getDuration();
    form.setValue('duration', duration || 0);
  };

  useEffect(() => {
    if (!dialogState.isOpen) {
      form.reset();
    }
  }, [dialogState.isOpen, form]);

  if (dialogState.mode !== 'Add' && dialogState.mode !== 'Edit') return null;

  const formContent = (footer: React.ReactNode) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='educationId'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel>{tResumeFormLabels('education')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={isPending}
                    onValueChange={handleSelectChange('Education')}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={tResumeFormPlaceholders('education')}
                      />
                    </SelectTrigger>
                    <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                      <SelectItem value={'-1'}>
                        {tResumeFormSelectItem('hide')}
                      </SelectItem>
                      {educations?.map((edu) => (
                        <SelectItem key={edu.id} value={edu.id.toString()}>
                          {tProfileEducationDegrees(
                            camelCase(
                              edu.degree!
                            ) as keyof IntlMessages['profile']['education']['degrees']
                          )}{' '}
                          | {edu.institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='jobExperienceId'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel>{tResumeFormLabels('jobExperience')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={isPending}
                    onValueChange={handleSelectChange('JobExperience')}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={tResumeFormPlaceholders('jobExperience')}
                      />
                    </SelectTrigger>
                    <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                      <SelectItem value={'-1'}>
                        {tResumeFormSelectItem('hide')}
                      </SelectItem>
                      {jobExperiences?.map((job) => (
                        <SelectItem key={job.id} value={job.id.toString()}>
                          {job.title} | {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel>{tResumeFormLabels('title')}</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel>{tResumeFormLabels('url')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                {!form.formState.errors.url &&
                  form.formState.errors.duration && (
                    <FormMessage>
                      {form.formState.errors.duration.message}
                    </FormMessage>
                  )}
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem className='col-span-2 flex h-full flex-col sm:col-span-1'>
                <FormLabel className='leading-5'>
                  {tResumeFormLabels('description')}
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
          <div className='col-span-2 aspect-video sm:col-span-1'>
            {ReactPlayer.canPlay(url) ? (
              <ReactPlayer
                ref={playerRef}
                width={'100%'}
                height={'100%'}
                url={url}
                controls={true}
                onReady={handlePlayerReady}
                fallback={<Skeleton className='aspect-video' />}
              />
            ) : (
              <Skeleton className='aspect-video' />
            )}
          </div>
        </div>
        {footer}
      </form>
    </Form>
  );

  return (
    <ResponsiveDialog
      title={tResume('dialogTitle', {
        mode:
          dialogState.mode === 'Add'
            ? tComponentsResponsiveDialog('buttons.create')
            : tComponentsResponsiveDialog('buttons.edit'),
        title: tResume('title'),
      })}
      content={formContent}
      submitButton={{
        props: {
          isLoading: isPending,
          disabled:
            isPending || Object.keys(form.formState.dirtyFields).length === 0,
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
