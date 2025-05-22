//NOTE: Refactor later
import type { JSX } from 'react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@extension/ui';
import { toast } from 'sonner';

export type TModalAlert = {
  centered?: boolean;
  closeOnClickOverlay?: boolean;
  desc?: JSX.Element | string;
  hideBtnClose?: boolean;
  images?: string;
  isOpen: boolean;
  labelClose?: string;
  labelYes?: string;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  size?: 'default';
  title: string;
  type?: 'success' | 'withImage';
};

export const ModalAlert = ({
  isOpen,
  onClose,
  centered,
  labelYes,
  labelClose,
  hideBtnClose,
  onSubmit,
  title,
  desc,
  size,
  images,
  type,
  closeOnClickOverlay = false,
}: TModalAlert) => {
  const [loadingAlert, setLoadingAlert] = useState(false);

  const customSubmit = async () => {
    try {
      if (onSubmit) {
        setLoadingAlert(true);
        await onSubmit();
        setLoadingAlert(false);
      }
    } catch (e: any) {
      if (e) {
        let title;
        if (e?.error) {
          title = e.error;
        } else if (e?.message) {
          title = e.message;
        } else {
          title = JSON.stringify(e);
        }
        toast.error(title);
      }

      setLoadingAlert(false);
    }
  };

  if (type === 'withImage') {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <img src={images} alt={title} />
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {desc && <AlertDialogDescription>{desc}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{labelClose ?? 'Close'}</AlertDialogCancel>
            <AlertDialogAction disabled={loadingAlert} onClick={customSubmit}>
              {labelYes ?? 'Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (type === 'success') {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {desc && <AlertDialogDescription>{desc}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction disabled={loadingAlert} onClick={customSubmit}>
              {labelYes ?? 'Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? 'Confirmation'}</AlertDialogTitle>
          {desc && <AlertDialogDescription>{desc}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!hideBtnClose && <AlertDialogCancel onClick={onClose}>{labelClose ?? 'Close'}</AlertDialogCancel>}
          <AlertDialogAction disabled={loadingAlert} onClick={customSubmit}>
            {labelYes ?? 'Submit'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
