'use client';

import * as React from 'react';
import { DayPicker, DropdownProps } from 'react-day-picker';
import { useLocale } from 'next-intl';
import { Locale, enUS, zhTW } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Command, CommandItem, CommandList } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...calendarProps
}: CalendarProps) {
  const locale = useLocale();
  const locales: Record<string, Locale> = {
    'en-US': enUS,
    'zh-TW': zhTW,
  };
  const [dropdowns, setDropdowns] = React.useState({
    months: false,
    years: false,
  });

  type Dropdowns = keyof typeof dropdowns;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        caption_dropdowns:
          'flex flex-row-reverse justify-center gap-1.5 w-[70%]',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex justify-between',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2 justify-between',
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      locale={locales[locale]}
      components={{
        Dropdown: ({
          value,
          onChange,
          children,
          name,
          ...props
        }: DropdownProps) => {
          const options = React.Children.toArray(
            children
          ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
          const selected = options.find((child) => child.props.value === value);
          const handleChange = (value: string) => {
            setDropdowns((prev) => ({ ...prev, [name as Dropdowns]: false }));
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };

          const selectedItemRef = React.useRef<HTMLDivElement>(null);

          React.useEffect(() => {
            if (dropdowns[name as Dropdowns]) {
              const timer = setTimeout(() => {
                if (selectedItemRef.current) {
                  selectedItemRef.current.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                  });
                }
              }, 0);
              return () => clearTimeout(timer);
            }
          }, [dropdowns[name as Dropdowns]]);

          return (
            <Popover
              modal={true}
              open={dropdowns[name as Dropdowns]}
              onOpenChange={(val) => {
                setDropdowns((prev) => ({ ...prev, [name as Dropdowns]: val }));
              }}
            >
              <PopoverTrigger className='h-[28px]' asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  className='flex w-full justify-between border-zinc-400 font-normal dark:border-zinc-500'
                  size={'sm'}
                >
                  {selected?.props?.children}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='max-h-[--radix-popover-content-available-height] w-28 p-0'>
                <Command>
                  <CommandList>
                    {options.map((option, id: number) => (
                      <CommandItem
                        key={`${option.props.value}-${id}`}
                        value={option.props.value?.toString() ?? ''}
                        onSelect={handleChange}
                        className='flex justify-items-center'
                        ref={
                          value === option.props.value ? selectedItemRef : null
                        }
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === option.props.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {option.props.children}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        },
        IconLeft: ({ ...props }) => <ChevronLeft className='h-4 w-4' />,
        IconRight: ({ ...props }) => <ChevronRight className='h-4 w-4' />,
      }}
      defaultMonth={calendarProps.selected as Date}
      {...calendarProps}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
