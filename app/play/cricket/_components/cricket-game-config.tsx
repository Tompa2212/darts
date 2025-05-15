import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button, buttonVariants } from '@/components/ui/button';
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
import Link from 'next/link';
import { ALL_NUMS } from '@/packages/cricket-game/helpers';
import { TeamsSelector } from '../../_components/teams-selector';
import TeamsReorder from '../../_components/teams-reorder/teams-reorder';
import { cn } from '@/lib/utils';
import { NumbersSelector } from './numbers-selector';

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

  const isCustomNumbers = form.watch('cricketNumbersOption') === 'customNums';

  return (
    <div className="p-4">
      <header className="mb-4">
        <Heading>Create Cricket Match</Heading>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6">
          <FormField
            control={form.control}
            name="cricketNumbersOption"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Game Mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="standard" />
                      </FormControl>
                      <FormLabel className="font-normal">Standard</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="randomNums" />
                      </FormControl>
                      <FormLabel className="font-normal">Random Numbers</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="customNums" />
                      </FormControl>
                      <FormLabel className="font-normal">Custom Numbers</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isCustomNumbers ? (
            <FormField
              control={form.control}
              name="numbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numbers</FormLabel>
                  <NumbersSelector
                    selected={field.value?.map(String) ?? []}
                    options={ALL_NUMS.map((num) => ({
                      label: num.toString(),
                      value: num.toString()
                    }))}
                    onChange={(value) => {
                      if (value.length > 7) {
                        return;
                      }
                      field.onChange(value.map(Number));
                    }}
                    className="sm:w-[510px]"
                  />
                  <FormDescription>Select seven numbers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
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
                <div className="flex items-center gap-2 text-sm">
                  <TeamsReorder teams={value} onReorder={onChange} />
                  <Link
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    href="/teams"
                  >
                    Create New Teams
                  </Link>
                </div>
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
