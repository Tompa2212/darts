'use client';

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

import { zeroOneConfigSchema } from '@/schema/games-config.schema';
import { Heading } from '@/components/ui/heading';
import { MultiSelect } from '@/components/ui/multiselect';
import { useUserTeams } from '../../use-user-teams';
import Link from 'next/link';

import SelectField from '@/components/ui/select-field';
import { gameModes } from '@/packages/zero-one';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectValue } from '@/components/ui/select';
import { TeamsSelector } from '../../_components/teams-selector';
import TeamsReorder from '../../_components/teams-reorder/teams-reorder';
import { cn } from '@/lib/utils';

type ConfigValues = z.infer<typeof zeroOneConfigSchema>;

export function ZeroOneGameConfig({
  onConfigured
}: {
  onConfigured: (values: ConfigValues) => void;
}) {
  const allTeams = useUserTeams();
  const form = useForm<ConfigValues>({
    resolver: zodResolver(zeroOneConfigSchema),
    defaultValues: {
      type: '501',
      doubleOut: false,
      legs: 1,
      sets: 1,
      teams: []
    }
  });

  function onSubmit(data: ConfigValues) {
    onConfigured(data);
  }

  return (
    <div className="p-4">
      <header className="mb-4">
        <Heading>Create Zero One Match</Heading>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Type</FormLabel>
                <SelectField
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  inForm
                  trigger={<SelectValue className="w-full" placeholder="Select game type" />}
                  options={gameModes.map((mode) => ({
                    value: mode,
                    label: mode
                  }))}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sets</FormLabel>
                <Input {...field} defaultValue={field.value} type="number" />
                <FormDescription>First team to win number of sets</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="legs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legs</FormLabel>
                <Input {...field} defaultValue={field.value} type="number" />
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="doubleOut"
            render={({ field }) => (
              <FormItem className="flex items-center space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-7 w-7"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Double Out</FormLabel>
                  <FormDescription>Player must finish on a double</FormDescription>
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
}
