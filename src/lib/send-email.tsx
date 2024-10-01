'use server';

import { getTranslations } from 'next-intl/server';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { PublicError } from '@/use-cases/errors';

export async function sendEmail(
  to: string,
  subject: string,
  body: JSX.Element
) {
  const tErrorMessages = await getTranslations('errorMessages');
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  try {
    await transport.verify();
  } catch (error) {
    console.error(error);
    throw new PublicError(tErrorMessages('public.EmailVerificationError'));
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      html: render(body),
    });
  } catch (error) {
    console.error(error);
    throw new PublicError(tErrorMessages('public.SendEmailError'));
  }
}
