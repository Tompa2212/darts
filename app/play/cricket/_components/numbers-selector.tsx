'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CaretSortIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsDesktop } from '@/hooks/use-is-desktop';

export type OptionType = {
  label: string;
  value: string;
};

export type MultiselectAndOptionListProps = {
  options: OptionType[];
  selected: string[];
  noResultsRender?: () => React.ReactNode;
};

type MultiSelectProps = {
  className?: string;
  placeholder?: string;
  onChange: (selected: string[]) => void;
} & MultiselectAndOptionListProps;

export function NumbersSelector({
  options,
  selected,
  placeholder,
  className,
  onChange,
  noResultsRender,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const Container = isDesktop ? Popover : Drawer;
  const Content = isDesktop ? PopoverContent : DrawerContent;
  const Trigger = isDesktop ? PopoverTrigger : DrawerTrigger;

  return (
    <Container open={open} onOpenChange={setOpen} {...props}>
      <Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx('w-full justify-between', 'min-h-9 h-auto p-2')}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0
              ? selected.map((item, idx) => (
                  <Badge
                    variant="secondary"
                    key={idx}
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    {options.find((option) => item === option.value)?.label}
                    <a
                      className="ml-1 ring-offset-background rounded-full outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(item)}
                    >
                      <Cross2Icon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </a>
                  </Badge>
                ))
              : placeholder}
          </div>
          <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Trigger>
      <Content
        className={cn(
          'min-w-[var(--radix-popover-trigger-width)] p-0',
          !isDesktop && 'pb-2 min-h-56'
        )}
      >
        <OptionsList
          selected={selected}
          options={options}
          noResultsRender={noResultsRender}
          onChange={(value) => {
            if (!value) {
              return;
            }

            onChange(
              selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value]
            );
            setOpen(true);
          }}
        />
      </Content>
    </Container>
  );
}

NumbersSelector.displayName = 'NumbersSelector';

type OptionsListProps = {
  onChange: (value: string) => void;
} & MultiselectAndOptionListProps;

function OptionsList({
  selected,
  options,
  onChange,
  noResultsRender
}: OptionsListProps) {
  return (
    <Command>
      <CommandList>
        <CommandEmpty>
          {noResultsRender ? noResultsRender() : 'No results found.'}
        </CommandEmpty>
        <CommandGroup>
          <div className="grid grid-cols-5 gap-1 items-center justify-center">
            {options.map((option) => (
              <CommandItem
                className={cn(
                  'justify-center h-10',
                  selected.includes(option.value) && 'bg-accent'
                )}
                key={option.label}
                onSelect={() => {
                  onChange(option.value);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
