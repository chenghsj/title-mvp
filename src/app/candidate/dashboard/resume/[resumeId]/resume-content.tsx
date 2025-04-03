'use client';

import ReactPlayer from 'react-player/lazy';
import { Skeleton } from '@/components/ui/skeleton';
import { Video } from '@/db/schema/candidate';

type Props = {
  video: Video;
};

export const ResumeContent = ({ video }: Props) => {
  return (
    <div className='relative mx-auto aspect-video w-full max-w-[640px] overflow-hidden rounded-lg'>
      <ReactPlayer
        width={'100%'}
        height={'100%'}
        url={video?.url}
        fallback={<Skeleton className='aspect-video' />}
      />
    </div>
  );
};
