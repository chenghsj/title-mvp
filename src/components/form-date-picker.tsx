import { ChangeEvent, useEffect, useState } from 'react';
import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from 'react-hook-form';
import { useMask } from '@react-input/mask';
import { format, getYear, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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
  const [stringDate, setStringDate] = useState<string>('');
  const { field } = useController({
    name,
    control: form.control,
  });

  const inputRef = useMask({
    mask: 'yyyy/MM/dd',
    replacement: { y: /\d/, M: /\d/, d: /\d/ },
    separate: true,
    // onMask: (event) => {
    //   if (event.target.value === 'yyyy/MM/dd') {
    //     setStringDate('');
    //   } else {
    //     setStringDate(event.target.value);
    //   }
    // },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'yyyy/MM/dd') {
      setStringDate('');
    } else {
      setStringDate(e.target.value);
    }
  };

  const handleBlur = () => {
    const parsedDate = parse(stringDate, 'yyyy/MM/dd', new Date());
    if (!isValid(parsedDate)) {
      field.onChange(null);
      return;
    }
    if (parsedDate > new Date()) {
      field.onChange(new Date());
      return;
    }
    field.onChange(parsedDate);
    form.clearErrors(name);
  };

  useEffect(() => {
    if (field.value) {
      setStringDate(format(field.value, 'yyyy/MM/dd'));
    }
  }, [field.value]);

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
            <FormLabel
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {label}
            </FormLabel>
            <div className='relative flex w-full'>
              <Input
                {...field}
                ref={inputRef}
                value={stringDate}
                placeholder='yyyy/MM/dd'
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      size={'icon'}
                      variant={'ghost'}
                      className={cn(
                        !field.value && 'text-muted-foreground',
                        'absolute right-1',
                        'top-1/2 h-8 w-8 -translate-y-1/2 transform'
                      )}
                      {...buttonProps}
                    >
                      <CalendarIcon size={18} className='text-zinc-500' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0'
                  align='start'
                  onOpenAutoFocus={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Calendar
                    mode='default'
                    captionLayout='dropdown-buttons'
                    selected={field.value}
                    onDayClick={(date: Date | undefined) => {
                      if (!isValid(date) || !date) return;
                      setStringDate(format(new Date(date), 'yyyy/MM/dd'));
                      field.onChange(date);
                      form.clearErrors(name);
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
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

FormDatePicker.displayName = 'FormDatePicker';
