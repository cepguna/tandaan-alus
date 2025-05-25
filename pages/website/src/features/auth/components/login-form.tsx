import type { HTMLAttributes } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, cn, Button, Input } from '@extension/ui';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'sonner';
import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { URL } from '@src/lib/constants';

type UserAuthFormProps = HTMLAttributes<HTMLFormElement> & {
  onClose: () => void;
  showOtp: (email: string) => void;
};

const formSchema = z.object({
  email: z.string().min(1, { message: 'Please enter your email' }).email({ message: 'Invalid email address' }),
});

export function LoginForm({ className, onClose, showOtp, ...props }: UserAuthFormProps) {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    console.log(data);
    try {
      const res = await signIn('resend-otp', { email: data.email });
      console.log('login res', res);
      if (res.signingIn) {
        toast.success(`Welcome to Tandaan Alus`);
        onClose();
        navigate(URL.DASHBOARD);
      } else {
        showOtp(data.email);
      }
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

        <Button className="mt-2" disabled={isLoading}>
          Log In
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" type="button" disabled={isLoading} onClick={() => void signIn('github')}>
            <Github className="h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" type="button" disabled={isLoading} onClick={() => void signIn('google')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-brand-google">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945z" />
            </svg>
            Google
          </Button>
        </div>
      </form>
    </Form>
  );
}
