import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ReactPlayer from 'react-player';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerAction } from 'zsa-react';
import { LoaderButton } from '@/components/loader-button';
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
import { Resume, Video } from '@/db/schema';
import { createResumeAction, updateResumeAction } from './actions';
import { ResumeFormSchema, ResumeFormSchemaType } from './form-schema';
import { useResumeDialog } from './hooks';

type Props = {
  resume?: Resume & { video?: Video };
};

export const ResumeDialog = ({ resume }: Props) => {
  const { toast } = useToast();
  const { isOpen, setIsOpen, type: dialogType, resumeId } = useResumeDialog();
  const playerRef = useRef<ReactPlayer>(null);

  const form = useForm<ResumeFormSchemaType>({
    resolver: zodResolver(ResumeFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      bio: '',
      url: '',
      duration: 0,
    },
    values: {
      url: resume?.video?.url || '',
      title: resume?.title || '',
      bio: resume?.bio || '',
    },
  });

  const url = form.watch('url');

  const { execute, isPending } = useServerAction(
    dialogType === 'Add' ? createResumeAction : updateResumeAction,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: `Resume ${dialogType === 'Add' ? 'created' : 'updated'}`,
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
    }
  );

  const onSubmit = (values: ResumeFormSchemaType) => {
    if (dialogType === 'Edit') {
      execute({ ...values, resumeId: resumeId! });
    } else {
      execute(values);
    }
  };

  const handlePlayerReady = () => {
    const duration = playerRef.current?.getDuration();
    form.setValue('duration', duration || 0);
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);
  console.log(form.formState.errors);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className='w-[90%] max-w-[800px] rounded-lg'
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {dialogType === 'Add' ? 'Create' : 'Edit'} Resume
          </DialogTitle>
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
                      {!form.formState.errors.url &&
                        form.formState.errors.duration && (
                          <FormMessage>
                            {form.formState.errors.duration.message}
                          </FormMessage>
                        )}
                    </FormItem>
                  )}
                />
                <div className='aspect-video overflow-auto rounded-md'>
                  {ReactPlayer.canPlay(url) ? (
                    <ReactPlayer
                      ref={playerRef}
                      width={'100%'}
                      height={'100%'}
                      url={url}
                      controls={true}
                      onReady={handlePlayerReady}
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
              <LoaderButton
                disabled={
                  isPending ||
                  Object.keys(form.formState.dirtyFields).length === 0
                }
                type='submit'
                isLoading={isPending}
              >
                {dialogType === 'Add' ? 'Create' : 'Update'}
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
