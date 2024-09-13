import { useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { format, getYear } from 'date-fns';
import { CalendarIcon, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './ui/button';
import { Calendar, CalendarProps } from './ui/calendar';
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
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  calendarProps?: CalendarProps;
  buttonProps?: ButtonProps;
};

export const FormDatePicker = <T extends FieldValues>({
  form,
  label,
  name,
  formItemProps,
  calendarProps,
  buttonProps,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            {...formItemProps}
            className={cn('flex flex-col', formItemProps?.className)}
          >
            <FormLabel>{label}</FormLabel>
            <div className='flex gap-2'>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                    mode='default'
                    captionLayout='dropdown-buttons'
                    selected={field.value}
                    onDayClick={(date: Date | undefined) => {
                      field.onChange(date);
                      setIsOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    fromYear={1960}
                    toYear={getYear(new Date())}
                    {...calendarProps}
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
                      <RotateCcw size={18} className='text-zinc-500' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

FormDatePicker.displayName = 'FormDatePicker';
