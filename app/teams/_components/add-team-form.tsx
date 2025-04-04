'use client';
import React, { useMemo } from 'react';
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
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useAddTeamForm } from './use-add-team-form';

const getUsersOptions = (users: Array<User | { name: string }>) =>
  users.map((user) => {
    if (!('id' in user)) {
      return { label: user.name, value: JSON.stringify({ name: user.name }) };
    }

    user.name = user.username;
    return {
      label: `${user.username}`,
      value: JSON.stringify(user)
    };
  });

export const AddTeamForm = () => {
  const isDesktop = useIsDesktop();

  const { form, inputValue, setInputValue, formMessage, loading, handleSubmit } = useAddTeamForm();

  const { data: users } = useUserSearch(inputValue);
  const userOptions = useMemo(() => getUsersOptions(users || []), [users]);

  function handleAddPlayer() {
    if (!inputValue) {
      return;
    }

    const currPlayers = form.getValues('players');
    if (currPlayers.find((player: any) => player.name === inputValue)) {
      return;
    }

    form.setValue('players', [...currPlayers, { name: inputValue }]);

    if (form.getValues('players').length === 1 && !form.getValues('name')) {
      form.setValue('name', inputValue);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add Team</Button>
      </SheetTrigger>
      <SheetContent side={isDesktop ? 'right' : 'bottom'}>
        <SheetHeader>
          <SheetTitle>Create New Team</SheetTitle>
          <SheetDescription>
            Name your team, and add players to it. Click Add Team when you{"'"}
            re done.
          </SheetDescription>
        </SheetHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team name</FormLabel>
                    <FormControl>
                      <Input placeholder="darts" {...field} />
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
                                label: `${p.username}`,
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
                      <FormDescription>Search for registered users or add by name.</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Adding team...' : 'Add Team'}
              </Button>
            </form>
          </Form>
          <FormError message={formMessage?.error} />
          <FormSuccess message={formMessage?.success} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
