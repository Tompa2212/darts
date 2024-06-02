'use client';
import React, { useMemo, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addTeam } from '@/actions/teams/add-team';
import { addTeamSchema } from '@/schema/team.schema';
import { AddPlayersSelect } from './add-players-select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useUserSearch } from '@/hooks/use-user-search';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { User } from 'lucia';
import { SessionUser } from '@/auth';

const getUsersOptions = (users: Array<User | { name: string }>) =>
  users.map((user) => {
    if (!('id' in user)) {
      return { label: user.name, value: JSON.stringify({ name: user.name }) };
    }

    user.name = user.username;
    return {
      label: `${user.username} (${user.email})`,
      value: JSON.stringify(user)
    };
  });

export const AddTeamForm = ({ user }: { user: SessionUser | null }) => {
  const isDesktop = useIsDesktop();

  const [inputValue, setInputValue] = useState('');

  const { data: users } = useUserSearch(inputValue);
  const userOptions = useMemo(() => getUsersOptions(users || []), [users]);

  const form = useForm<z.infer<typeof addTeamSchema>>({
    resolver: zodResolver(addTeamSchema),
    defaultValues: {
      name: '',
      players: []
    }
  });

  function handleSubmit(data: z.infer<typeof addTeamSchema>) {
    if (!user || !user.id) {
      return;
    }

    form.reset();
    setInputValue('');

    addTeam({ userId: user.id, ...data });
  }

  function handleAddPlayer() {
    if (!inputValue) {
      return;
    }

    const currPlayers = form.getValues('players');
    if (currPlayers.find((player: any) => player.name === inputValue)) {
      return;
    }

    form.setValue('players', [...currPlayers, { name: inputValue }]);

    if (form.getValues('players').length === 1) {
      form.setValue('name', inputValue);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add Team</Button>
      </SheetTrigger>
      <SheetContent side={isDesktop ? 'right' : 'bottom'}>
        <SheetHeader className="mb-4">
          <SheetTitle>Create New Team</SheetTitle>
          <SheetDescription>
            Name your team, and add players to it. Click Add Team when you{"'"}
            re done.
          </SheetDescription>
        </SheetHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 mb-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.getValues('players').length <= 1}
                        placeholder="darts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name="players"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Players</FormLabel>
                      <FormControl>
                        <AddPlayersSelect
                          isMulti
                          menuPlacement={isDesktop ? 'auto' : 'top'}
                          options={userOptions}
                          closeMenuOnSelect={false}
                          blurInputOnSelect={false}
                          onUnlinkedPlayerAdd={handleAddPlayer}
                          value={form.getValues('players').map((p) => {
                            if ('id' in p) {
                              return {
                                label: `${p.username} (${p.email})`,
                                value: JSON.stringify(p)
                              };
                            }

                            return { label: p.name, value: JSON.stringify(p) };
                          })}
                          onChange={(selected) => {
                            form.setValue(
                              'players',
                              selected.map((u) => JSON.parse(u.value))
                            );

                            if (form.getValues('players').length === 1) {
                              form.setValue('name', inputValue);
                            }
                          }}
                          inputValue={inputValue}
                          onInputChange={(value, action) => {
                            if (action.action !== 'set-value') {
                              setInputValue(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Search for registered users or add by name.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full" type="submit">
                Add Team
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
