import React from 'react';
import ReactPlayer from 'react-player';
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
import { useConfirmDialog } from './hooks';

type Props = {
  resume: Resume & { video?: Video };
};

export const ResumeCard = React.memo(({ resume }: Props) => {
  const confirmDialog = useConfirmDialog();

  const handleDeleteClick = () => {
    confirmDialog.setResumeId(resume.id);
    confirmDialog.setIsOpen(true);
    confirmDialog.setResumeTitle(resume.title!);
  };

  return (
    <Card className='h-fit cursor-pointer overflow-auto'>
      <CardContent className='pointer-events-none aspect-video p-0'>
        {ReactPlayer.canPlay(resume.video?.url!) ? (
          <ReactPlayer
            width={'100%'}
            height={'100%'}
            url={resume.video?.url!}
            light={true}
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
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'sm'}>
                <Ellipsis size={'18'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem>
                <FileText className='mr-2 h-4 w-4' />
                Preview
              </DropdownMenuItem> */}
              <DropdownMenuItem>
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
  );
});

ResumeCard.displayName = 'ResumeCard';
