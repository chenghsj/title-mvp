'use client';

import { useMemo } from 'react';
import { User } from 'lucia';
import { CirclePlus, Video } from 'lucide-react';
import { useIsClient } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Resume as ResumeType, Video as VideoType } from '@/db/schema';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { CreateResumeDialog } from './create-resume-dialog';
import { useResumeDialog } from './hooks';
import { ResumeCard } from './resume-card';

type Props = {
  user: User;
  resumes: ResumeType[];
  videos: VideoType[];
};

export const Resume = ({ user, resumes, videos }: Props) => {
  const isClient = useIsClient();
  const { setIsOpen } = useResumeDialog();
  const { isMobile } = useDeviceDetect();

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
    setIsOpen(true);
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
      {resumesWithVideos.length > 0 ? (
        <>
          {resumesWithVideos.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
          {!isMobile && (
            <Card
              className='cursor-pointer select-none text-zinc-400'
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
          )}
        </>
      ) : (
        <div className='flex h-full w-full flex-col items-center justify-center space-y-4'>
          <Video size='50' />
          <p className='text-2xl'>Create your first resume</p>
          <Button
            rounded={'full'}
            variant={'outline'}
            onClick={handleCreateClick}
          >
            Create
          </Button>
        </div>
      )}
      <CreateResumeDialog />
      <ConfirmDeleteDialog userId={user.id} />
    </div>
  );
};
