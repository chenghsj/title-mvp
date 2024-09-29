'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CirclePlus, Plus, Video } from 'lucide-react';
import { useIsClient } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useDialogState } from '@/hooks/store';
import { cn } from '@/lib/utils';
import { DashboardDetails } from '../type';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { useResumeDialog } from './hooks';
import { ResumeCard } from './resume-card';
import { ResumeDialog } from './resume-dialog';

type Props = {
  dashboardDetails: DashboardDetails;
};

export const Resume = ({ dashboardDetails }: Props) => {
  const { resumes, videos, educations, jobExperiences } = dashboardDetails;
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const tResume = useTranslations('resume');
  const isClient = useIsClient();
  const resumeDialog = useResumeDialog();
  const dialogState = useDialogState();

  const resumesWithVideos = useMemo(
    () =>
      resumes.map((resume) => {
        const video = videos.find((video) => video.resumeId === resume.id);
        return {
          ...resume,
          video,
        };
      }),
    [resumes, videos]
  );

  const handleCreateClick = () => {
    dialogState.setIsOpen(true);
    dialogState.setMode('Add');
  };

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full',
        resumesWithVideos.length > 0
          ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4'
          : 'h-full'
      )}
    >
      {resumesWithVideos.length > 0 && (
        <div className='col-span-full flex justify-between'>
          {/* <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Sorted by' />
          </SelectTrigger>
          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectItem value='light'>Light</SelectItem>
            <SelectItem value='dark'>Dark</SelectItem>
            <SelectItem value='system'>System</SelectItem>
          </SelectContent>
        </Select> */}
          <Button
            className='sm:hidden'
            variant={'outline'}
            onClick={handleCreateClick}
            size={'sm'}
          >
            <Plus size={16} className='mr-2' />
            {tComponentsResponsiveDialog('buttons.create')}
          </Button>
        </div>
      )}

      {resumesWithVideos.length > 0 ? (
        <>
          {resumesWithVideos.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
          <Card
            className='hidden cursor-pointer select-none text-zinc-400 sm:block'
            onClick={handleCreateClick}
          >
            <Button variant={'ghost'} className='h-full w-full' asChild>
              <CardContent className='flex aspect-video h-full flex-col items-center justify-center space-y-2 p-0'>
                <CirclePlus size='50' />
                <p>Create Resume</p>
              </CardContent>
            </Button>
            <CardFooter></CardFooter>
          </Card>
        </>
      ) : (
        <div className='flex h-full w-full flex-col items-center justify-center space-y-4'>
          <Video size='50' />
          <p className='text-2xl'>{tResume('description')}</p>
          <Button variant={'outline'} onClick={handleCreateClick}>
            {tComponentsResponsiveDialog('buttons.create')}
          </Button>
        </div>
      )}
      <ResumeDialog
        resume={
          dialogState.mode === 'Edit'
            ? resumesWithVideos.filter(
                (resume) => resume.id === resumeDialog.resumeId
              )[0]
            : undefined
        }
        educations={educations}
        jobExperiences={jobExperiences}
      />
      <ConfirmDeleteDialog />
    </div>
  );
};
