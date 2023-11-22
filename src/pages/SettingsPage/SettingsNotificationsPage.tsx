import { z } from 'zod';
import { Separator } from '../../components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '../../components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useState } from 'react';

const notificationsFormSchema = z.object({
  push_notifications: z.boolean().optional(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export default function SettingsNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const { enabledPushNotifications, disabledPushNotifications } = useFirebase();
  const defaultSettings = useSelector((state: RootState) => state.app.enabledPushNotifications);
  const defaultValues: Partial<NotificationsFormValues> = {
    push_notifications: defaultSettings,
  };

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  async function onSubmit(data: NotificationsFormValues) {
    if (defaultSettings !== data.push_notifications) {
      setLoading(true);
      if (data.push_notifications) {
        enabledPushNotifications?.(true).finally(() => {
          setLoading(false);
        });
      } else {
        disabledPushNotifications?.(true).finally(() => {
          setLoading(false);
        });
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <div className="space-y-4">
              <FormField
                disabled={loading}
                control={form.control}
                name="push_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enabled push notifications</FormLabel>
                      <FormDescription>
                        With enabled push notifications, you'll receive timely updates even when the app is running in the background
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button isLoading={loading} disabled={loading} size={'lg'} type="submit">
            Update notifications
          </Button>
        </form>
      </Form>
    </div>
  );
}
