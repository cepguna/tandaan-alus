import type { HTMLAttributes } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  cn,
  Button,
  Input,
  PasswordInput,
} from '@extension/ui';
import { Link } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'sonner';

type UserAuthFormProps = HTMLAttributes<HTMLFormElement> & {
  onClose: () => void;
};

const formSchema = z.object({
  email: z.string().min(1, { message: 'Please enter your email' }).email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
});

export function SignInForm({ className, onClose, ...props }: UserAuthFormProps) {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    console.log(data);
    try {
      await signIn('password', { ...data, flow: 'signIn' });
      toast.success('Login Success');
      onClose();
    } catch {
      toast.error(`Failed to sign in`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-3', className)} {...props}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to="/forgot-password"
                className="text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75">
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          Sign In
        </Button>
      </form>
    </Form>
  );
}
