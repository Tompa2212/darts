'use client';
import { changeUsername } from '@/actions/users/change-username';
import { SessionUser } from '@/auth';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';

export function ChangeUsernameForm({ user }: { user: SessionUser }) {
  const [state, action] = useFormState(changeUsername, undefined);

  const hasUsernameError = (state?.details?.username || []).length > 0;

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>Change Username</CardTitle>
        <CardDescription>
          Used to identify you among other players.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={action} className="space-y-4">
          <div>
            <Input type="hidden" name="userId" defaultValue={user.id} />
            <Label htmlFor="change-username">Username</Label>
            <Input
              name="username"
              id="change-username"
              placeholder="Username"
              defaultValue={user.username}
              aria-describedby="usernameError"
              aria-required="true"
              aria-invalid={hasUsernameError}
            />
            <p
              id="usernameError"
              className={cn(
                'text-[0.8rem] text-destructive hidden',
                hasUsernameError && 'block'
              )}
            >
              {state?.details?.username?.join(', ')}
            </p>
          </div>
          <Button>Save</Button>
        </form>
        <div>
          {state?.success && <FormSuccess message={state.success} />}
          {state?.error && <FormError message={state.error} />}
        </div>
      </CardContent>
    </Card>
  );
}
