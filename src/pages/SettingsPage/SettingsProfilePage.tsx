import { Button } from '../../components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import * as z from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import useUsers from '../../services/users';
import MAvatar from '../../components/shared/MAvatar';

const profileFormSchema = z.object({
  email: z.string().email('Email is not valid').optional(),
  first_name: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .max(30, {
      message: 'First name must not be longer than 30 characters.',
    }),
  last_name: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Last name must not be longer than 30 characters.',
    }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      }),
    )
    .optional(),
});

export default function SettingsProfilePage() {
  const { updateProfileMutation } = useUsers();
  const user = useSelector((state: RootState) => state.auth.user);

  async function onSubmit(data: ProfileFormValues) {
    delete data.email;
    updateProfileMutation.mutate(data);
  }

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  const defaultValues: Partial<ProfileFormValues> = {
    email: user?.email,
    first_name: user?.first_name,
    last_name: user?.last_name,
    bio: user?.bio,
    urls: user?.urls,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Separator />
      <MAvatar editable />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled placeholder="David" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="first_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="David" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="last_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Alcaded" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`urls.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && 'sr-only')}>URLs</FormLabel>
                    <FormDescription className={cn(index !== 0 && 'sr-only')}>
                      Add links to your website, blog, or social media profiles.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: '' })}>
              Add URL
            </Button>
          </div>
          <Button isLoading={updateProfileMutation.isLoading} type="submit">
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
