'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, Send } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import { Button } from '@/components/ui/button';
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
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { errorMessages } from '@/use-cases/errors';
import { sendEmailOTPAction, signInAction, signUpAction } from './actions';
import {
  SignInFormSchema,
  SignInFormSchemaType,
  SignUpFormSchema,
  SignUpFormSchemaType,
} from './form-schema';
import { useEmailOTPDialog, useGetRole } from './hooks';

type Props = {
  isMail: boolean;
  isSignUp: boolean;
};

function LoginForm({ isMail, isSignUp }: Props) {
  const isSignUpRef = useRef(isSignUp);
  const { toast } = useToast();
  const { isMobile } = useDeviceDetect();
  const { setIsOpen: setDialogOpen, setEmail: setDialogEmail } =
    useEmailOTPDialog();
  const { role } = useGetRole();

  const form = useForm<SignUpFormSchemaType | SignInFormSchemaType>({
    resolver: zodResolver(isSignUp ? SignUpFormSchema : SignInFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { execute, isPending, error, reset } = useServerAction(
    isSignUp ? signUpAction : signInAction,
    {
      onError({ err }) {
        toast({
          title: 'Something went wrong',
          description: err.message,
          variant: 'destructive',
        });
      },
      onSuccess() {
        if (isSignUpRef.current) {
          setDialogOpen(true);
          toast({
            title: 'Email sent successfully!',
            description: 'Please check your email for the OTP.',
          });
        }
      },
    }
  );

  const {
    execute: excuteSendEmailOTP,
    isPending: sendEmailOTPIsPending,
    error: sendEmailOTPError,
  } = useServerAction(sendEmailOTPAction, {
    onError({ err }) {
      toast({
        title: 'Something went wrong',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess({ data }) {
      setDialogOpen(true);
      toast({
        title: 'Email sent successfully!',
        description: 'Please check your email for the OTP.',
      });
    },
  });

  const onSubmit = (values: SignUpFormSchemaType | SignInFormSchemaType) => {
    setDialogEmail(form.getValues('email'));
    if (isSignUp) {
      execute({ ...values, role });
    } else {
      execute(values);
    }
  };

  const handleSendOTP = async () => {
    excuteSendEmailOTP({
      email: form.getValues('email'),
      password: form.getValues('password'),
    });
  };

  useEffect(() => {
    if (!isMail) {
      form.reset();
    }
  }, [isMail, form]);

  useEffect(() => {
    form.setValue('role', role);
  }, [role]);

  useEffect(() => {
    isSignUpRef.current = isSignUp;
  }, [isSignUp]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eamil</FormLabel>
              <FormControl>
                <Input className={cn(isMobile && 'h-9')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input.password className={cn(isMobile && 'h-9')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSignUp && (
          <>
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input.password
                      className={cn(isMobile && 'h-9')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='hidden' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {/* {error && (
          <Alert variant='destructive'>
            <Terminal className='h-4 w-4' />
            <AlertTitle>Uh-oh, we couldn&apos;t log you in</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )} */}

        <Button
          type='submit'
          className={cn('!mt-8 w-full', isMobile && 'h-9')}
          disabled={isPending || sendEmailOTPIsPending}
        >
          {isPending && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
          Submit
        </Button>
      </form>
      {!isSignUp &&
        error?.message === errorMessages.verifyEmail.notVerified && (
          <Button
            variant={'outline'}
            className={cn('!mt-8 w-full', isMobile && 'h-9')}
            onClick={handleSendOTP}
            disabled={sendEmailOTPIsPending}
          >
            {sendEmailOTPIsPending ? (
              <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Send className='mr-2 h-4 w-4' />
            )}
            Send OTP
          </Button>
        )}
    </Form>
  );
}

export default LoginForm;
