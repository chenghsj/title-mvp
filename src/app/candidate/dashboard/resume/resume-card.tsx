import React, { ComponentProps, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { format } from 'date-fns';
import { ResponsiveDropdownMenu } from '@/components/responsive-dropdown-menu';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Resume, Video } from '@/db/schema/candidate';
import { useCreateHandleMenuButtonClick } from './hooks';
import { getYouTubeVideoId } from './utils';

type Props = {
  resume: Resume & { video?: Video };
};

export const ResumeCard = React.memo(({ resume }: Props) => {
  const tResume = useTranslations('resume');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();

  const responsiveDropdownMenuProps: ComponentProps<
    typeof ResponsiveDropdownMenu
  > = {
    handleEditClick: handleMenuButtonClick('Edit', resume.id),
    handleDeleteClick: handleMenuButtonClick('Delete', resume.id, resume.title),
  };

  useEffect(() => {
    if (ReactPlayer.canPlay(resume.video?.url!)) {
      setIsPlayerReady(true);
    }
  }, [resume]);

  return (
    <Card className='h-fit cursor-pointer overflow-auto'>
      <Link href={`/candidate/dashboard/resume/${resume.id}`}>
        <CardContent className='pointer-events-none aspect-video p-0'>
          {isPlayerReady ? (
            <ReactPlayer
              width={'100%'}
              height={'100%'}
              url={resume.video?.url!}
              light={`https://img.youtube.com/vi/${getYouTubeVideoId(resume.video?.url!)}/0.jpg`}
              playIcon={<></>}
              fallback={<Skeleton className='aspect-video' />}
            />
          ) : (
            <Skeleton className='aspect-video' />
          )}
        </CardContent>
      </Link>
      <CardFooter className='flex flex-col items-start p-2 pl-4 pr-2'>
        <div className='flex w-full items-center justify-between gap-3'>
          <p
            className='overflow-hidden text-ellipsis font-semibold'
            title={resume.title!}
          >
            {resume.title}
          </p>
          <ResponsiveDropdownMenu {...responsiveDropdownMenuProps} />
        </div>
        <p className='text-sm text-zinc-500'>
          {tResume('date.createdAt', {
            date: format(new Date(resume.createdAt), 'yyyy-MM-dd'),
          })}
        </p>
      </CardFooter>
    </Card>
  );
});

ResumeCard.displayName = 'ResumeCard';
