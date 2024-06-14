import { addTeamSchema } from '@/schema/team.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addTeam } from '@/actions/teams/add-team';
import * as z from 'zod';

export const useAddTeamForm = () => {
  const [inputValue, setInputValue] = useState('');

  const form = useForm<z.infer<typeof addTeamSchema>>({
    resolver: zodResolver(addTeamSchema),
    defaultValues: {
      name: '',
      players: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<null | {
    success?: string;
    error?: string;
  }>(null);

  async function handleSubmit(data: z.infer<typeof addTeamSchema>) {
    form.reset();
    setInputValue('');
    setFormMessage(null);
    setLoading(true);

    const resp = await addTeam(data);

    if ('error' in resp) {
      setFormMessage({ error: resp.error });
    } else {
      setFormMessage({ success: 'Team added successfully!' });
    }

    setLoading(false);
  }

  return {
    loading,
    formMessage,
    form,
    inputValue,
    setInputValue,
    handleSubmit
  };
};
