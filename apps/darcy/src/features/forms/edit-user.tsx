'use client';

import useEditUser from '@/api/mutations/useEditUser';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface EditUserFormProps {
  onSubmit?: () => void;
}

export default function EditUserForm({ onSubmit }: EditUserFormProps) {
  const currentUser = useCurrentUser();
  const t = useTranslations('Forms.EditUser');
  const mutation = useEditUser();

  const formSchema = z.object({
    displayName: z
      .string()
      .min(1, {
        message: t('displayNameTooSmall')
      })
      .max(32, { message: t('displayNameTooLarge') })
      .optional(),
    handle: z
      .string()
      .regex(/^[a-zA-Z0-9_]*$/, {
        message: t('invalidHandle')
      })
      .min(2, {
        message: t('handleTooSmall')
      })
      .max(16, { message: t('handleTooLarge') })
      .optional(),
    bio: z
      .string()
      .max(120, { message: t('biographyTooLarge') })
      .optional()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(
      { ...values },
      {
        onSuccess: (data) => {
          onSubmit?.();
          currentUser.setData(data);
          toast(t('submitted'));
        },
        onError: () => {
          toast.error(t('errorSubmitting'));
        }
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">{t('displayName')}</FormLabel>
              <FormControl>
                <Input placeholder={currentUser.displayName} {...field} />
              </FormControl>
              <FormDescription>{t('displayNameDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">{t('handle')}</FormLabel>
              <FormControl>
                <Input placeholder={currentUser.handle} {...field} />
              </FormControl>
              <FormDescription>{t('handleDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">{t('biography')}</FormLabel>
              <FormControl>
                <Textarea placeholder={currentUser.bio} {...field} />
              </FormControl>
              <FormDescription>{t('biographyDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" className="font-bold gap-2">
          {mutation.isPending && <LoadingSpinner />}
          {t('submit')}
        </Button>
      </form>
    </Form>
  );
}
