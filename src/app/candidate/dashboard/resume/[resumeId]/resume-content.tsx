'use client';

import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Skeleton } from '@/components/ui/skeleton';
import { Video } from '@/db/schema/candidate';

type Props = {
  video: Video;
};

export const ResumeContent = ({ video }: Props) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (ReactPlayer.canPlay(video?.url!)) {
      setIsPlayerReady(true);
    }
  }, [video]);

  return (
    <div className='relative mx-auto aspect-video w-full max-w-[640px] overflow-hidden rounded-lg'>
      {isPlayerReady ? (
        <ReactPlayer
          ref={playerRef}
          width={'100%'}
          height={'100%'}
          url={video?.url}
          fallback={<Skeleton className='aspect-video' />}
        />
      ) : (
        <Skeleton className='absolute h-full w-full' />
      )}
    </div>
  );
};
