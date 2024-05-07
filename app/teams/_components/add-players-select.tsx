import { Select } from '@/components/ui/react-select';
import { cn } from '@/lib/utils';
import React from 'react';
import { GroupBase, MenuListProps, Props, components } from 'react-select';

const extraPropsCtx = React.createContext<{
  onUnlinkedPlayerAdd: (player: string) => void;
}>({ onUnlinkedPlayerAdd: () => {} });

function MenuList<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: MenuListProps<Option, IsMulti, Group>) {
  const { onUnlinkedPlayerAdd } = React.useContext(extraPropsCtx);
  const inputValue = props.selectProps.inputValue;

  const optionClasses = props.getClassNames('option', props as any);

  return (
    <components.MenuList {...props}>
      {inputValue.length > 0 ? (
        <div
          className={cn(optionClasses, 'hover:bg-zinc-100 cursor-pointer')}
          onClick={() => onUnlinkedPlayerAdd(inputValue)}
        >
          <div>Add Player</div>
          <span className="text-zinc-400">{inputValue}</span>
        </div>
      ) : null}
      {props.children}
    </components.MenuList>
  );
}

type AddPlayersSelectProps = {
  onUnlinkedPlayerAdd: (player: string) => void;
  inputValue: string;
  onInputChange: (value: string, action: any) => void;
};

export function AddPlayersSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  options,
  inputValue,
  isMulti,
  value,
  onChange,
  onInputChange,
  onUnlinkedPlayerAdd,
  ...props
}: Props<Option, IsMulti, Group> & AddPlayersSelectProps) {
  return (
    <extraPropsCtx.Provider value={{ onUnlinkedPlayerAdd }}>
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }

          e.stopPropagation();

          if (inputValue.length > 0 && options?.length === 0) {
            e.preventDefault();
            onUnlinkedPlayerAdd(inputValue);
          }
        }}
        inputValue={inputValue}
        onInputChange={onInputChange}
        placeholder="Search users"
        components={{ MenuList }}
        noOptionsMessage={() => {
          return (
            <div className="text-zinc-500 text-left">
              {inputValue.length <= 2
                ? 'Type 3 characters to start searching...'
                : 'No users found'}
            </div>
          );
        }}
        {...props}
      />
    </extraPropsCtx.Provider>
  );
}
