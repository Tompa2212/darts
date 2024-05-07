'use client';
import {
  DialogResponsiveContent,
  DialogResponsiveHeader,
  DialogResponsive
} from '@/components/ui/dialog-responsive';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useUserTeams } from '../_hooks/use-user-teams';

type AddTeamsFormProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  onSubmit(data: any): void;
};

const formSchema = z.object({
  teams: z
    .array(
      z.object({
        name: z.string(),
        players: z.array(
          z.object({
            name: z.string()
          })
        )
      })
    )
    .min(2, 'Minimum 2 teams required')
});

export const AddTeamsForm = ({
  open,
  onOpenChange,
  onSubmit
}: AddTeamsFormProps) => {
  const allTeams = useUserTeams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teams: []
    }
  });

  function handleSubmit(data: z.infer<typeof formSchema>) {
    form.reset();
    onSubmit(data.teams);
  }

  return (
    <DialogResponsive open={open} onOpenChange={onOpenChange}>
      <DialogResponsiveContent>
        <DialogResponsiveHeader>
          <h2 className="text-xl font-bold">Add Teams</h2>
        </DialogResponsiveHeader>
        <div className="mb-4 space-y-2 sm:mb-2">
          No teams?{' '}
          <Link className="inline-block py-1 text-blue-500" href="/teams">
            Manage Teams
          </Link>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
            <FormField
              control={form.control}
              name="teams"
              render={() => (
                <FormItem className="mb-4">
                  <div className="mb-4">
                    <FormLabel className="text-lg">Teams</FormLabel>
                    <FormDescription>
                      Select the teams you want to add.
                    </FormDescription>
                  </div>
                  {allTeams.map((team) => (
                    <FormField
                      key={team.name}
                      control={form.control}
                      name="teams"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={team.name}
                            className="flex items-center gap-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={
                                  field.value?.find(
                                    (t) => t.name === team.name
                                  ) !== undefined
                                }
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        { ...team }
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value.name !== team.name
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel>{team.name}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogResponsiveContent>
    </DialogResponsive>
  );
};
