'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { Review } from '@/app/api/resume/review/dummy-review';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video } from '@/db/schema';

type Props = {
  video: Video;
};

export const ResumeTab = ({ video }: Props) => {
  const [randomItem, setRandomItem] = useState<Review | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const chartData = Object.entries(randomItem || {})
    .map(([key, value]) => {
      return {
        item: key,
        criteria: value,
      };
    })
    .filter((criteria) => criteria.item !== 'Suggestions');

  const chartConfig = {
    criteria: {
      label: 'Criteria',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (ReactPlayer.canPlay(video?.url!)) {
      setIsPlayerReady(true);
    }
  }, [video]);

  useEffect(() => {
    const fetchRandomItem = async () => {
      try {
        const response = await fetch('/api/resume/review');
        const data = await response.json();
        setRandomItem(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRandomItem();
  }, []);

  return (
    <Tabs defaultValue='video' className='w-full max-w-[640px]'>
      <TabsList>
        <TabsTrigger value='video'>Video</TabsTrigger>
        <TabsTrigger value='review'>Review</TabsTrigger>
      </TabsList>
      <TabsContent value='video'>
        <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
          {isPlayerReady ? (
            <ReactPlayer
              ref={playerRef}
              width={'100%'}
              height={'100%'}
              url={video?.url}
            />
          ) : (
            <Skeleton className='absolute h-full w-full' />
          )}
        </div>
      </TabsContent>
      <TabsContent
        value='review'
        className='aspect-video w-full rounded-lg border p-3'
      >
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-video max-h-[250px]'
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey='item' />
            <PolarGrid />
            <Radar
              dataKey='criteria'
              fill='var(--color-criteria)'
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
        <ul className='mx-auto max-w-[80%] list-disc text-sm'>
          {randomItem?.Suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
};
