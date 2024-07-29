'use client';

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-lg space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Type</FormLabel>
                <SelectField
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  trigger={<SelectValue placeholder="Select game type" />}
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
                <FormDescription>
                  First team to win number of sets
                </FormDescription>
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
                <FormDescription></FormDescription>
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
                <MultiSelect
                  selected={value.map((team) => team.name)}
                  options={allTeams.map((team) => ({
                    value: team.name,
                    label: `${team.name} - (${team.players
                      .map((p) => p?.user?.username ?? p.name)
                      .join(', ')})`
                  }))}
                  onChange={(value) => {
                    const newSelectedTeams = value
                      .map((teamName) =>
                        allTeams.find((t) => t.name === teamName)
                      )
                      .filter(Boolean);

                    onChange(newSelectedTeams);
                  }}
                  {...rest}
                  className="sm:w-[510px]"
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
          <FormField
            control={form.control}
            name="doubleOut"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="w-7 h-7"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Double Out</FormLabel>
                  <FormDescription>
                    Player must finish on a double
                  </FormDescription>
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
