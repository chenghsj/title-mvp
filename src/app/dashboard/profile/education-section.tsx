import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Education } from '@/db/schema';

type Props = {
  education: Education;
};

export const EducationSection = ({ education }: Props) => {
  return (
    <div className='relative flex w-full flex-col gap-1'>
      <div className='text-sm font-bold'>{education.degree}</div>
      <div className='flex items-center text-sm'>
        {education.institution}
        <Separator orientation='vertical' className='mx-2 h-3' />
        {education.fieldOfStudy}
      </div>
      <div className='text-xs italic'>
        {education.startDate} - {education.endDate || 'Present'}
      </div>
      {education.description && (
        <div className='mt-2 w-full rounded-md bg-zinc-200 p-2 text-sm dark:bg-zinc-800'>
          {education.description.split('\n').map((line, index) => (
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
