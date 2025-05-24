import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@extension/ui';
import { LoginForm } from './login-form';
import { useState } from 'react';
import { OtpForm } from './otp-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ModalAuthentication({ isOpen, onClose }: Props) {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('');
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={e => {
          e.preventDefault();
        }}>
        <DialogHeader>
          <DialogTitle>{showOtp ? 'Verification Email' : 'Log In or Create an Account'}</DialogTitle>
          <DialogDescription>
            {showOtp ? `We have sent 8 digit code to ${email}` : 'Log In to existing account or create a new one'}
          </DialogDescription>
        </DialogHeader>
        {showOtp ? (
          <OtpForm
            email={email}
            onSuccess={() => {
              onClose();
              setShowOtp(false);
              setEmail('');
            }}
          />
        ) : (
          <LoginForm
            onClose={onClose}
            showOtp={email => {
              setEmail(email);
              setShowOtp(true);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
