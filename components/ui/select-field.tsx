import React from 'react';
import { Select, SelectItem, SelectContent, SelectTrigger } from './select';
import { FormControl } from './form';

type SelectFieldProps = {
  options: { label: string; value: string }[];
  trigger: React.ReactNode;
  inForm?: boolean;
} & React.ComponentPropsWithoutRef<typeof Select>;

const SelectField = ({ options, trigger, inForm = false, ...props }: SelectFieldProps) => {
  const Container = inForm ? FormControl : React.Fragment;

  return (
    <Select {...props}>
      <Container>
        <SelectTrigger className="w-full">{trigger}</SelectTrigger>
      </Container>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectField;
