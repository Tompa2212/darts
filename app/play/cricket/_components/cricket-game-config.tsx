import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cricketConfigSchema } from '@/schema/games-config.schema';
import { Heading } from '@/components/ui/heading';
import { MultiSelect } from '@/components/ui/multiselect';
import Link from 'next/link';
import { allNums } from '@/packages/cricket-game/helpers';
import { TeamsSelector } from '../../_components/teams-selector';

type ConfigValues = z.infer<typeof cricketConfigSchema>;

export const CricketGameConfig = ({
  onConfigured
}: {
  onConfigured: (values: ConfigValues) => void;
}) => {
  const form = useForm<ConfigValues>({
    resolver: zodResolver(cricketConfigSchema),
    defaultValues: {
      cricketNumbersOption: 'standard',
      teams: []
    }
  });

  function onSubmit(data: ConfigValues) {
    onConfigured(data);
  }

  return (
    <div className="p-4">
      <header className="mb-4">
        <Heading>Create Cricket Match</Heading>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-lg space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="cricketNumbersOption"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Game Mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.resetField('numbers');
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="standard" />
                      </FormControl>
                      <FormLabel className="font-normal">Standard</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="randomNums" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Random Numbers
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="customNums" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Custom Numbers
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.getValues('cricketNumbersOption') === 'customNums' && (
            <FormField
              control={form.control}
              name="numbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numbers</FormLabel>
                  <MultiSelect
                    selected={field.value?.map(String) ?? []}
                    options={allNums.map((num) => ({
                      label: num.toString(),
                      value: num.toString()
                    }))}
                    onChange={(value) => field.onChange(value.map(Number))}
                    className="sm:w-[510px]"
                  />
                  <FormDescription>Select seven numbers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="teams"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Teams</FormLabel>
                <TeamsSelector
                  value={form.getValues('teams')}
                  onChange={onChange}
                  className="sm:w-[510px]"
                  {...rest}
                />
                <FormMessage />
                <FormDescription className="text-sm">
                  <Link
                    className="text-blue-500 underline underline-offset-1"
                    href="/teams"
                  >
                    Create New Teams
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />
          <Button className="w-full min-w-20 sm:w-auto" type="submit">
            Play
          </Button>
        </form>
      </Form>
    </div>
  );
};
