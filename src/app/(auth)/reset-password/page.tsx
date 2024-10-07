'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Terminal } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import { LoaderButton } from '@/components/loader-button';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { changePasswordAction } from './actions';
import {
  ResetPasswordFormSchemaType,
  resetPasswordFormSchema,
} from './form-schema';

type Props = {
  searchParams: {
    token: string;
  };
};

const ResetPasswordPage = ({ searchParams }: Props) => {
  const tLogin = useTranslations('login');
  const tErrorMessages = useTranslations('errorMessages');
  const form = useForm<ResetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: searchParams.token,
    },
  });

  const { execute, isPending, isSuccess, error } =
    useServerAction(changePasswordAction);

  const onSubmit = (values: ResetPasswordFormSchemaType) => {
    execute({
      token: values.token,
      password: values.password,
    });
  };

  return (
    <SectionExcludeNav className='flex items-center justify-center'>
      {!isSuccess && (
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>{tLogin('resetPassword.title')}</CardTitle>
            <CardDescription>
              {tLogin('resetPassword.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5'
              >
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLogin('form.labels.password')}</FormLabel>
                      <FormControl>
                        <Input.password {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tLogin('form.labels.confirmPassword')}
                      </FormLabel>
                      <FormControl>
                        <Input.password {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoaderButton isLoading={isPending} className='w-full'>
                  {tLogin('form.buttons.submit')}
                </LoaderButton>
                {error && (
                  <Alert variant='destructive'>
                    <Terminal className='h-4 w-4' />
                    <AlertTitle>
                      {tErrorMessages('somethingWentWrong')}
                    </AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      {isSuccess && (
        <div className='space-y-5'>
          <Alert>
            <Terminal className='h-4 w-4' />
            <AlertTitle>{tLogin('resetPassword.success.title')}</AlertTitle>
            <AlertDescription>
              {tLogin('resetPassword.success.description')}
            </AlertDescription>
          </Alert>
          <Button variant='default' asChild className='w-full'>
            <Link href='/sign-in'>
              {tLogin('resetPassword.success.button')}
            </Link>
          </Button>
        </div>
      )}
    </SectionExcludeNav>
  );
};

export default ResetPasswordPage;
