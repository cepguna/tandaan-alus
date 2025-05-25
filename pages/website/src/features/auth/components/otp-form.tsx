import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputOTPSeparator,
} from '@extension/ui';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL } from '@src/lib/constants';

const FormSchema = z.object({
  code: z.string().min(8, {
    message: 'Your code must be 8 characters.',
  }),
});

type Props = {
  email: string;
  onSuccess: () => void;
};

export function OtpForm({ email, onSuccess }: Props) {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setIsLoading(true);
    try {
      await signIn('resend-otp', { code: data.code, email, flow: 'signIn' });
      onSuccess();
      toast.success(`Welcome to Tandaan Alus`);
      navigate(URL.DASHBOARD);
    } catch {
      toast.error(`Failed to verify invalid code`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="grid place-items-center">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
