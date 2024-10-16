'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import en from '@/messages/en-US.json';

type Props = {
  children: React.ReactNode;
};

type ZodIntl = typeof en.zod;

const customErrorMap: (
  t: ReturnType<typeof useTranslations<'zod'>>
) => z.ZodErrorMap = (t) => (issue, ctx) => {
  switch (issue.code) {
    case 'too_small':
      if (issue.type === 'string') {
        if (issue.minimum === 1)
          return { message: t('custom.invalid_string.required') };
        if (issue.minimum > 1)
          return {
            message: t.rich('invalid_string.min', {
              min: issue.minimum as number,
            }) as string,
          };
      }
      break;
    case 'too_big':
      if (issue.type === 'string') {
        return {
          message: t.rich('invalid_string.max', {
            max: issue.maximum as number,
          }) as string,
        };
      }
      break;
    case 'invalid_string':
      if (
        issue.code === 'invalid_string' &&
        (issue.validation as string) in en.zod.invalid_string
      )
        return {
          message: t(
            `invalid_string.${issue.validation as keyof ZodIntl['invalid_string']}`
          ),
        };
      break;
  }
  return { message: ctx.defaultError };
};

export const ZodErrorMapLayout = ({ children }: Props) => {
  const t = useTranslations('zod');
  z.setErrorMap(customErrorMap(t));

  return children;
};
