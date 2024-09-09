import React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { format, getYear } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  buttonProps?: ButtonProps;
};

export const FormDatePicker = <T extends FieldValues>({
  form,
  label,
  name,
  buttonProps,
}: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>{label}</FormLabel>
          <div className='flex gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'flex-auto pl-3 text-left font-normal',
                      'border-zinc-200 dark:border-zinc-800',
                      !field.value && 'text-muted-foreground'
                    )}
                    {...buttonProps}
                  >
                    {field.value ? (
                      format(field.value, 'yyyy/MM/dd')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  captionLayout='dropdown-buttons'
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  fromYear={1960}
                  toYear={getYear(new Date())}
                />
              </PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => {
                      form.resetField(name);
                    }}
                  >
                    <X size={20} className='text-zinc-500' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

FormDatePicker.displayName = 'FormDatePicker';
