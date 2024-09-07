import React, { MouseEvent, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import Link from 'next/link';
import { format } from 'date-fns';
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Resume, Video } from '@/db/schema';
import { useConfirmDialog, useResumeDialog } from './hooks';
import { getYouTubeVideoId } from './utils';

type Props = {
  resume: Resume & { video?: Video };
};

export const ResumeCard = React.memo(({ resume }: Props) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const confirmDialog = useConfirmDialog();
  const resumeDialog = useResumeDialog();

  const handleDeleteClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    confirmDialog.setResumeId(resume.id);
    confirmDialog.setIsOpen(true);
    confirmDialog.setResumeTitle(resume.title!);
  };

  const handleTriggerClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleEditClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    resumeDialog.setType('Edit');
    resumeDialog.setIsOpen(true);
    resumeDialog.setResumeId(resume.id);
  };

  useEffect(() => {
    if (ReactPlayer.canPlay(resume.video?.url!)) {
      setIsPlayerReady(true);
    }
  }, [resume]);

  return (
    <Link href={`/dashboard/resume/${resume.id}`}>
      <Card className='h-fit cursor-pointer overflow-auto'>
        <CardContent className='pointer-events-none aspect-video p-0'>
          {isPlayerReady ? (
            <ReactPlayer
              width={'100%'}
              height={'100%'}
              url={resume.video?.url!}
              light={`https://img.youtube.com/vi/${getYouTubeVideoId(resume.video?.url!)}/0.jpg`}
              playIcon={<></>}
            />
          ) : (
            <Skeleton className='aspect-video' />
          )}
        </CardContent>

        <CardFooter className='flex flex-col items-start p-2 pl-4 pr-2'>
          <div className='flex w-full items-center justify-between gap-3'>
            <p
              className='overflow-hidden text-ellipsis font-semibold'
              title={resume.title!}
            >
              {resume.title}
            </p>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                asChild
                data-prevent-nprogress={true}
                onClick={handleTriggerClick}
              >
                <Button variant={'ghost'} size={'sm'}>
                  <Ellipsis size={'18'} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleEditClick}>
                  <Pencil className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick}>
                  <Trash className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className='text-sm text-zinc-500'>
            created at {format(new Date(resume.createdAt), 'yyyy-MM-dd')}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
});

ResumeCard.displayName = 'ResumeCard';
