import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  cn,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  RadioGroup,
  RadioGroupItem,
} from '@extension/ui';
import { useGetMe, useUpdateUser } from '@src/hooks/use-services/use-user';
import { Edit, Lock, LockOpen, Save, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { get2DigitName } from '@src/lib/utils/transform-text';
import { toast } from 'sonner';
import type { Id } from '@extension/backend/convex/_generated/dataModel';
import { SOCIAL_MEDIA } from '@src/lib/constants/social-media';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  username: z
    .string()
    .min(3, {
      message: 'Username must be at least 3 characters.',
    })
    .max(16, {
      message: 'Username must not be longer than 16 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  bio: z.string().max(160).min(4),
  isPrivate: z.string(),
  urls: z
    .array(
      z.object({
        type: z.string().min(1, { message: 'required' }),
        link: z.string().min(1, { message: 'required' }),
      }),
    )
    .max(5, { message: 'Max 5 item' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  name: '',
  username: '',
  email: '',
  bio: '',
  isPrivate: 'true',
  urls: [],
};

export function ProfileSection() {
  const { data } = useGetMe();
  const [isEdit, setIsEdit] = useState(false);
  const { mutateAsync, isPending } = useUpdateUser();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  const handleSubmit = async (dataSubmit: z.infer<typeof profileFormSchema>) => {
    try {
      const newData = {
        name: dataSubmit.name,
        username: dataSubmit.username.split(' ').join('').toLowerCase(),
        bio: dataSubmit.bio,
        image: data?.image,
        isPrivate: dataSubmit.isPrivate === 'true' ? true : false,
        urls: dataSubmit.urls,
      };
      const res = await mutateAsync({ ...newData, id: data?._id as Id<'users'> });
      toast.success(`Update success`);
      setIsEdit(false);
    } catch (err: any) {
      toast.error(`Update failed: ${err?.message ?? ''}`);
    }
  };

  const handleReset = useCallback(() => {
    if (data) {
      form.reset({
        name: data.name,
        username: data.username,
        email: data.email,
        bio: data?.bio ?? '',
        urls: data?.urls ?? [{ type: '', link: '' }],
        isPrivate: data.isPrivate ? 'true' : 'false',
      });
    }
  }, [data]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
        <div className={cn('flex items-center gap-4', !isEdit && 'justify-between')}>
          <div className="relative flex flex-col items-center justify-center">
            <Avatar className="w-28 h-28">
              <AvatarImage src={data?.image} alt={data?.name} />
              <AvatarFallback>{get2DigitName(data?.name)}</AvatarFallback>
            </Avatar>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="absolute bottom-0" variant={data?.isPrivate ? 'destructive' : 'secondary'}>
                    {data?.isPrivate ? 'Private' : 'Public'}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {data?.isPrivate ? (
                    <p>Your account status is private no one can see your bookmarks</p>
                  ) : (
                    <p>Your account status is public everyone can see your profile & public bookmarks</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isEdit ? (
            <div
              role="button"
              onClick={() => toast('Feature in development please wait')}
              className="flex flex-col gap-1 font-semibold hover:bg-muted cursor-pointer py-3 px-4"
              style={{ borderRadius: 'var(--radius)' }}>
              <p>Upload a new avatar</p>
              <p className="text-xs text-muted-foreground">Please select an image smaller than 2MB</p>
            </div>
          ) : (
            <Button variant={'secondary'} onClick={() => setIsEdit(true)}>
              Edit <Edit />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            disabled={!isEdit}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={!isEdit}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="username"
          disabled={!isEdit}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym. You can only change this once
                every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          disabled={!isEdit}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Account Status</FormLabel>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                disabled={!isEdit}
                value={field.value}
                className="grid max-w-lg grid-cols-2 gap-8 pt-2">
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="true" className="sr-only" />
                    </FormControl>
                    <span className="block w-full p-2 text-left font-normal">Private</span>
                    <div className="border-muted hover:border-accent items-center rounded-md border-2 p-4">
                      <Lock className="mb-2" />
                      <p>Another user can't see your account & bookmarks</p>
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="false" className="sr-only" />
                    </FormControl>
                    <span className="block w-full p-2 text-left font-normal">Public</span>
                    <div className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-4">
                      <LockOpen className="mb-2" />
                      <p>Another user can see your account & public bookmarks</p>
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        <div className="space-y-3">
          <FormLabel className="block">Social Media</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <FormField
                control={form.control}
                disabled={!isEdit}
                key={`type-${field.type}`}
                name={`urls.${index}.type`}
                render={({ field }) => (
                  <FormItem className="w-[200px]">
                    <Select disabled={!isEdit} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select social media" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SOCIAL_MEDIA.filter(
                          item => !form.watch('urls')?.some((url, i) => url.type === item.value && i !== index),
                        ).map(item => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={!isEdit}
                key={`link-${field.type}`}
                name={`urls.${index}.link`}
                render={({ field: fieldx }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative">
                        {form.watch('urls')[index].type === 'tiktok' && (
                          <span className={cn('absolute top-2 left-3 text-sm border-r-2 pr-3')}>
                            https://tiktok.com/
                          </span>
                        )}
                        {form.watch('urls')[index].type === 'instagram' && (
                          <span className={cn('absolute top-2 left-3 text-sm border-r-2 pr-3')}>
                            https://instagram.com/
                          </span>
                        )}
                        {form.watch('urls')[index].type === 'github' && (
                          <span className={cn('absolute top-2 left-3 text-sm border-r-2 pr-3')}>
                            https://github.com/
                          </span>
                        )}
                        {form.watch('urls')[index].type === 'linkedin' && (
                          <span className={cn('absolute top-2 left-3 text-sm border-r-2 pr-3')}>
                            https://linkedin.com/
                          </span>
                        )}
                        {form.watch('urls')[index].type === 'x' && (
                          <span className={cn('absolute top-2 left-3 text-sm border-r-2 pr-3')}>https://x.com/</span>
                        )}
                        <Input
                          placeholder={
                            form.watch('urls')[index].type === 'website' || form.watch('urls')[index].type === ''
                              ? ''
                              : '@example'
                          }
                          className={cn(
                            form.watch('urls')[index].type === 'tiktok' && 'pl-[150px]',
                            form.watch('urls')[index].type === 'instagram' && 'pl-[180px]',
                            form.watch('urls')[index].type === 'github' && 'pl-[155px]',
                            form.watch('urls')[index].type === 'linkedin' && 'pl-[165px]',
                            form.watch('urls')[index].type === 'x' && 'pl-[125px]',
                          )}
                          {...fieldx}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEdit && (
                <Button variant={'outline'} onClick={() => remove(index)}>
                  <X />
                </Button>
              )}
            </div>
          ))}
          {isEdit && form.watch('urls').length <= 4 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ type: '', link: '' })}>
              Add Social Media
            </Button>
          ) : null}
        </div>
        {isEdit && (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant={'secondary'}
              type="button"
              onClick={() => {
                setIsEdit(false);
                handleReset();
              }}
              disabled={isPending}>
              Cancel <X />
            </Button>
            <Button type="submit" disabled={isPending}>
              Update profile <Save />
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
