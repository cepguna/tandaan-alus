import { Button } from '@extension/ui';
import { URL } from '@src/lib/constants';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotAuthorized() {
  return (
    <div className="w-full flex flex-col justify-center items-center h-screen bg-body">
      <h1 className="text-center text-4xl font-bold">You are not allowed to enter this page!</h1>
      <Button className="mt-4">
        <Link className="flex items-center" to={URL.HOME}>
          <ArrowLeft className="mr-2" size={20} /> Kembali ke Home
        </Link>
      </Button>
    </div>
  );
}

export default NotAuthorized;
