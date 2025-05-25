import { cn } from '@extension/ui';
import { Loader } from 'lucide-react';

type Props = {
  className?: string;
};

export const FullPageSpinner = ({ className }: Props) => {
  return (
    <>
      <div
        className={cn(
          'w-full h-full flex flex-col gap-4 justify-center items-center absolute left-0 right-0 bottom-0 top-0 bg-body/50 backdrop-blur-sm z-[8000]',
          className && className,
        )}>
        <Loader size={40} name="spinner" className="animate-spin" />
        <h2 className="font-bold text-2xl">Loading...</h2>
      </div>
    </>
  );
};
