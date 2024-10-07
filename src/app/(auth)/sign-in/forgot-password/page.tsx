'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Terminal } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import BackButton from '@/app/candidate/dashboard/resume/[resumeId]/back-button';
import { LoaderButton } from '@/components/loader-button';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { useToast } from '@/components/ui/use-toast';
import { resetPasswordAction } from './actions';
import {
  ForgotPasswordFormSchemaType,
  forgotPasswordFormSchema,
} from './form-schema';

type Props = {};

const ForgotPasswordPage = (props: Props) => {
  const tLogin = useTranslations('login');
  const { toast } = useToast();
  const form = useForm<ForgotPasswordFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const { execute, isPending, isSuccess } = useServerAction(
    resetPasswordAction,
    {
      onError({ err }) {
        toast({
          title: err.code,
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const onSubmit = (values: ForgotPasswordFormSchemaType) => {
    execute(values);
  };

  return (
    <SectionExcludeNav className='flex items-center justify-center'>
      <Card className='max-w-lg'>
        <CardHeader>
          <CardTitle>
            <BackButton className='mr-2' href='/sign-in' />
            {tLogin('forgotPassword.title')}
          </CardTitle>
          <CardDescription>
            {tLogin('forgotPassword.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tLogin('form.labels.email')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tLogin('form.placeholders.email')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoaderButton isLoading={isPending} className='w-full'>
                {tLogin('form.buttons.submit')}
              </LoaderButton>
              {isSuccess && (
                <Alert>
                  <Terminal className='h-4 w-4' />
                  <AlertTitle>
                    {tLogin('forgotPassword.alert.title')}
                  </AlertTitle>
                  <AlertDescription>
                    {tLogin('forgotPassword.alert.description')}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </SectionExcludeNav>
  );
};

export default ForgotPasswordPage;
