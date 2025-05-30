'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CaretSortIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { ChevronDown, XIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

  const handleClear = () => {
    onChange([]);
  };

  const Container = isDesktop ? Popover : Drawer;
  const Content = isDesktop ? PopoverContent : DrawerContent;
  const Trigger = isDesktop ? PopoverTrigger : DrawerTrigger;

  const hasSelected = selected.length > 0;

  return (
    <Container open={open} onOpenChange={setOpen} {...props}>
      <Trigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className={clsx('w-full justify-between', 'h-auto min-h-9 p-2')}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {hasSelected
              ? selected.map((item) => (
                  <Badge
                    variant="secondary"
                    key={item}
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
                      // biome-ignore lint/a11y/useValidAnchor: <explanation>
                      onClick={() => handleUnselect(item)}
                    >
                      <Cross2Icon className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </a>
                  </Badge>
                ))
              : placeholder}
          </div>
          <div className="flex items-center justify-between">
            <div
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
                handleClear();
              }}
            >
              <XIcon className="text-muted-foreground mx-2 h-4 cursor-pointer" />
            </div>
            <Separator orientation="vertical" className="h-full min-h-4" />
            <ChevronDown className="text-muted-foreground mx-2 h-4 cursor-pointer" />
          </div>
        </Button>
      </Trigger>
      <Content
        className={cn(
          'min-w-[var(--radix-popover-trigger-width)] p-0',
          !isDesktop && 'min-h-56 pb-2'
        )}
      >
        {!isDesktop && <DrawerTitle className="m-2">Select 7 Numbers</DrawerTitle>}
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

function OptionsList({ selected, options, onChange, noResultsRender }: OptionsListProps) {
  return (
    <Command>
      <CommandList>
        <CommandEmpty>{noResultsRender ? noResultsRender() : 'No results found.'}</CommandEmpty>
        <CommandGroup>
          <div className="grid grid-cols-5 items-center justify-center gap-1">
            {options.map((option) => (
              <CommandItem
                className={cn(
                  'hover:bg-background hover:text-primary active:bg-accent active:text-accent-foreground h-10 justify-center',
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
