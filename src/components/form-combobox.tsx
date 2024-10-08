'use client';

import { ComponentProps, useEffect, useRef, useState } from 'react';
import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  formFieldProps?: ComponentProps<typeof FormField>;
  formItemProps?: ComponentProps<typeof FormItem>;
  data: { value: string; label: string }[];
  hideSearch?: boolean;
};

export const FormCombobox = <T extends FieldValues>({
  form,
  label,
  name,
  formFieldProps,
  formItemProps,
  placeholder,
  data,
  hideSearch = false,
}: Props<T>) => {
  const { field } = useController({
    name,
    control: form.control,
  });
  const tComponentsResponsiveDialog = useTranslations(
    'components.responsiveDialog'
  );
  const [customInput, setCustomInput] = useState('');
  const { isMobile } = useDeviceDetect();
  const [isOpen, setIsOpen] = useState(false);

  const selectedItemRef = useRef<HTMLDivElement>(null);

  const trigger = (
    <FormControl>
      <Button
        variant='outline'
        role='combobox'
        className={cn(
          'w-full justify-between',
          !field.value && 'text-muted-foreground',
          'font-normal',
          'border border-zinc-200 dark:border-zinc-800'
        )}
      >
        {field.value
          ? data?.find((item) => item.value === field.value)?.label ||
            field.value
          : placeholder}
        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
      </Button>
    </FormControl>
  );

  const content = (
    <Command>
      {!hideSearch && <CommandInput placeholder='Search...' />}
      <CommandList>
        <CommandEmpty className='flex p-2'>
          <Input
            value={customInput || ''}
            onChange={(e) => setCustomInput(e.target.value)}
            className='h-9'
          />
          <Button
            variant={'secondary'}
            className='ml-2'
            size='sm'
            onClick={() => {
              if (!customInput) return;
              field.onChange(customInput);
              setCustomInput('');
              setIsOpen(false);
            }}
          >
            {tComponentsResponsiveDialog('buttons.add')}
          </Button>
        </CommandEmpty>
        <CommandGroup>
          {data?.map((item) => (
            <CommandItem
              value={item.label}
              key={item.value}
              onSelect={() => {
                field.onChange(item.value);
                setIsOpen(false);
              }}
              ref={item.value === field.value ? selectedItemRef : null}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  item.value === field.value ? 'opacity-100' : 'opacity-0'
                )}
              />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  return (
    <FormField
      {...formFieldProps}
      control={form.control as any}
      name={name}
      render={({ field }) => (
        <FormItem
          {...formItemProps}
          className={cn('flex flex-col justify-end', formItemProps?.className)}
        >
          <FormLabel className='leading-5'>{label}</FormLabel>
          {isMobile ? (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>{trigger}</DrawerTrigger>
              <DrawerContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className='pb-5'
              >
                <DrawerHeader className='hidden'>
                  <DrawerTitle></DrawerTitle>
                </DrawerHeader>
                {content}
              </DrawerContent>
            </Drawer>
          ) : (
            <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
              <PopoverContent className='max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0'>
                {content}
              </PopoverContent>
            </Popover>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
