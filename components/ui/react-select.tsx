import clsx from 'clsx';
import { GroupBase } from 'react-select';
import { useMediaQuery } from '@/hooks/use-media-query';

import React from 'react';
import ReactSelect, { Props } from 'react-select';
import { cn } from '@/lib/utils';

type AdditionalProps = {
  noResultsRender?: () => React.ReactNode;
};

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group> & AdditionalProps) {
  return (
    <ReactSelect
      {...props}
      unstyled
      classNames={{
        control: (state) =>
          cn(
            'px-3 py-1 border border-zinc-200 text-sm text-black rounded-lg !min-h-[40px] shadow-0 outline-0 hover:border-zinc-200'
          ),
        menuList: (state) =>
          cn(
            'mt-2 z-50 border rounded-md',
            state.selectProps.menuPlacement === 'top' && 'mb-2'
          ),
        menuPortal: () => '!z-[100]',
        menu: () => cn('b-0'),
        option: ({ isSelected, isFocused, isDisabled }) =>
          clsx(
            '!text-sm p-2 bg-white first-child:rounded-md',
            isSelected && 'bg-zinc-100',
            !isSelected && isFocused && 'bg-zinc-100',
            !isDisabled && isSelected && 'active:bg-zinc-200',
            !isDisabled && !isSelected && 'active:bg-zinc-300 opacity-0.8'
          ),
        noOptionsMessage: () => 'text-sm p-2 bg-white',
        indicatorsContainer: () => 'text-zinc-400',
        valueContainer: ({ isMulti }) => clsx('py-1 mr-1', isMulti && 'gap-1'),
        multiValue: () => 'rounded-xl border bg-zinc-100',
        multiValueLabel: () => 'px-2 py-[2px]',
        placeholder: () => 'text-muted-foreground'
      }}
    />
  );
}
