import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactPlayer from 'react-player';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createResumeAction } from './actions';
import { ResumeFormSchema, ResumeFormSchemaType } from './form-schema';
import { useResumeDialog } from './hooks';

type Props = {};

export const CreateResumeDialog = (props: Props) => {
  const { toast } = useToast();
  const { isOpen, setIsOpen } = useResumeDialog();

  const form = useForm<ResumeFormSchemaType>({
    resolver: zodResolver(ResumeFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      bio: '',
      url: '',
    },
  });
  const url = form.watch('url');

  const { execute, isPending } = useServerAction(createResumeAction, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Resume created',
      });
      setIsOpen(false);
    },
    onError: ({ err }) => {
      console.log(err.message);
      toast({
        title: 'Something went wrong',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: ResumeFormSchemaType) => {
    execute(values);
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className='w-[90%] max-w-[800px] rounded-lg'
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create Resume</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <div className='grid gap-x-3 sm:grid-cols-2'>
              <div className='flex h-full flex-col space-y-3'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name='bio'
                  render={({ field }) => (
                    <FormItem className='flex h-full flex-col'>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className='flex-auto' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-col space-y-3'>
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name='url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='aspect-video overflow-auto rounded-md'>
                  {ReactPlayer.canPlay(url) ? (
                    <ReactPlayer
                      width={'100%'}
                      height={'100%'}
                      url={url}
                      controls={true}
                    />
                  ) : (
                    <Skeleton className='aspect-video' />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className='gap-y-3'>
              <DialogClose asChild>
                <Button disabled={isPending} type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isPending} type='submit'>
                {isPending && (
                  <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
