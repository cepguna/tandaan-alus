import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from '@extension/ui';
import { SignInForm } from './signin-form';
import { SignUpForm } from './signup-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ModalAuthentication({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Tabs defaultValue="sign-in" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <DialogHeader className="mt-8 mb-4">
              <DialogTitle>Sign In</DialogTitle>
              <DialogDescription>Sign in to your existing account</DialogDescription>
            </DialogHeader>
            <SignInForm onClose={onClose} />
          </TabsContent>
          <TabsContent value="sign-up">
            <DialogHeader className="mt-8 mb-4">
              <DialogTitle>Sign Up</DialogTitle>
              <DialogDescription>Create new account and join with other people in the world</DialogDescription>
            </DialogHeader>
            <SignUpForm onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
