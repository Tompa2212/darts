'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import { Drawer, DrawerContent, DrawerTrigger } from './drawer';
import { useIsDesktop } from '@/hooks/use-is-desktop';

export type OptionType = {
  label: string;
  value: string;
};

export type MultiselectAndOptionListProps = {
  options: OptionType[];
  selected: string[];
  noResultsRender?: () => React.ReactNode;
  onSearch?: (value: string) => void;
};

type MultiSelectProps = {
  className?: string;
  placeholder?: string;
  onChange: (selected: string[]) => void;
} & MultiselectAndOptionListProps;

export function MultiSelect({
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
          className={clsx('w-full justify-between', selected.length > 1 ? 'h-auto p-2' : 'h-9 p-4')}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
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
                      className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-hidden focus:ring-2 focus:ring-offset-2"
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
                      <Cross2Icon className="text-muted-foreground hover:text-foreground h-3 w-3" />
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
          !isDesktop && 'min-h-56 pb-2'
        )}
      >
        <OptionsList
          selected={selected}
          options={options}
          noResultsRender={noResultsRender}
          onSearch={props.onSearch}
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

MultiSelect.displayName = 'MultiSelect';

type OptionsListProps = {
  onChange: (value: string) => void;
} & MultiselectAndOptionListProps;

function OptionsList({ selected, options, onChange, noResultsRender, onSearch }: OptionsListProps) {
  return (
    <Command>
      <CommandInput onValueChange={onSearch} placeholder="Search..." />
      <CommandList>
        <CommandEmpty>{noResultsRender ? noResultsRender() : 'No results found.'}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.label}
              onSelect={() => {
                onChange(option.value);
              }}
            >
              <CheckIcon
                className={cn(
                  'mr-2 h-4 w-4',
                  selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
