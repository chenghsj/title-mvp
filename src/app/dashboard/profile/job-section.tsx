import React from 'react';
import { IoBriefcaseOutline } from 'react-icons/io5';
import { Separator } from '@/components/ui/separator';
import { JobExperience } from '@/db/schema';

type Props = {
  jobExperience: JobExperience;
};

export const JobSection = ({ jobExperience: job }: Props) => {
  return (
    <div className='relative flex w-full flex-col gap-2'>
      <div className='text-sm font-bold'>
        <div className='flex items-center gap-2'>
          <IoBriefcaseOutline size={18} />
          {job.title}
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center text-sm'>
          {job.company}
          <Separator orientation='vertical' className='mx-2 h-3' />
          {job.employmentType}
        </div>
        <div className='text-xs italic'>
          {job.startDate} - {job.endDate || 'Present'}
        </div>
      </div>
      {job.description && (
        <div className='mt-2 w-full rounded-md p-2 text-sm outline-dashed outline-2 outline-zinc-200 dark:outline-zinc-800'>
          {job.description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
