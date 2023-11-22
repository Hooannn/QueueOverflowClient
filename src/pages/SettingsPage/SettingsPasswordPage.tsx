import { Separator } from '../../components/ui/separator';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Button } from '../../components/ui/button';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useMutation } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { toast } from '../../components/ui/use-toast';
import { Input } from '../../components/ui/input';

const passwordFormSchema = z.object({
  current_password: z.string().length(6, 'Must be 6 digits number'),
  new_password: z.string().length(6, 'Must be 6 digits number'),
  cf_new_password: z.string().length(6, 'Must be 6 digits number'),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const defaultValues: Partial<PasswordFormValues> = {};

export default function SettingsPasswordPage() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const axios = useAxiosIns();

  const updatePasswordMutation = useMutation({
    mutationFn: (params: { new_password: string; current_password: string }) => axios.patch(`/v1/users/profile/password`, params),
    onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message || 'Successfully changed your password',
      });
    },
  });

  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  async function onSubmit({ cf_new_password, current_password, new_password }: PasswordFormValues) {
    if (cf_new_password !== new_password) {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Confirm password must be equal to your new password',
      });
    }
    if (!isNumeric(new_password) || !isNumeric(current_password)) {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passcode must be a number',
      });
    }

    updatePasswordMutation.mutateAsync({ new_password, current_password });
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">Configure your account's password.</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="current_password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="new_password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="cf_new_password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button isLoading={updatePasswordMutation.isLoading} disabled={updatePasswordMutation.isLoading} size={'lg'} type="submit">
            Update password
          </Button>
        </form>
      </Form>
    </div>
  );
}
