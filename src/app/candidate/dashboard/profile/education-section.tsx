'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { camelCase } from 'lodash';
import { GraduationCap } from 'lucide-react';
import { BreakLineDiv } from '@/components/break-line-div';
import { Separator } from '@/components/ui/separator';
import { Education } from '@/db/schema';

type Props = {
  education: Education;
};

const useGetTranslations = () => {
  const tProfileEducationDegrees = useTranslations('profile.education.degrees');
  const tProfileEducationDate = useTranslations('profile.education.date');

  return { tProfileEducationDegrees, tProfileEducationDate };
};

export const EducationSection = ({ education }: Props) => {
  const { tProfileEducationDegrees, tProfileEducationDate } =
    useGetTranslations();

  return (
    <div className='relative flex w-full flex-col gap-2'>
      <div className='text-sm font-bold'>
        <div className='flex items-center gap-2'>
          <GraduationCap size={18} />
          {tProfileEducationDegrees(
            camelCase(
              education.degree!
            ) as keyof IntlMessages['profile']['education']['degrees']
          )}
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center text-sm'>
          {education.institution}
          <Separator orientation='vertical' className='mx-2 h-3' />
          {education.fieldOfStudy}
        </div>
        <div className='text-xs italic'>
          {education.startDate} -{' '}
          {education.endDate || tProfileEducationDate('present')}
        </div>
      </div>
      {education.description && (
        <div className='mt-2 w-full rounded-md p-2 text-sm outline-dashed outline-2 outline-zinc-200 dark:outline-zinc-800'>
          <BreakLineDiv content={education.description} />
        </div>
      )}
    </div>
  );
};
