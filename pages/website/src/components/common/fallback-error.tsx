import { Button } from '@extension/ui';
import { URL } from '@src/lib/constants';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

type TFallbackError = {
  title?: string;
  desc?: string;
  redirectBack?: {
    to: keyof typeof URL;
    query?: string;
    replaceValue?: { key: string; value: string }[];
    title?: string;
  };
};

function FallbackError({ title, desc, redirectBack }: TFallbackError) {
  const [urlRedirect, setUrlRedirect] = useState('');

  const handleRedirect = () => {
    // hard reload pages
    // NOTE: don't remove this code
    window.location.href = urlRedirect;
  };

  useEffect(() => {
    if (redirectBack) {
      let URL_ = URL[redirectBack.to];
      if (redirectBack?.query) {
        URL_ += redirectBack.query;
      }
      if (redirectBack.replaceValue) {
        redirectBack.replaceValue.forEach(replacement => {
          URL_ = URL_.replace(replacement.key, replacement.value);
        });
      }
      setUrlRedirect(URL_);
    }
  }, [redirectBack]);
  return (
    <div className="w-full flex flex-col justify-center items-center h-[590px]">
      <h1 className="text-center">{title ?? 'Terjadi Kesalahan pada Halaman Ini!'}</h1>
      <small>
        {desc ?? (
          <>
            Silahkan menghubungi <i>help desk</i>
          </>
        )}
      </small>
      {redirectBack && (
        <Button className="mt-4" onClick={handleRedirect}>
          <ArrowLeft name="arrow-left" className="mr-2" size={20} /> {redirectBack.title ?? 'Kembali'}
        </Button>
      )}
    </div>
  );
}

export default FallbackError;
