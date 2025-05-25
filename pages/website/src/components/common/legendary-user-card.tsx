import { Card, CardContent, Badge, Skeleton } from '@extension/ui';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  isLoading?: boolean;
  data?: {
    userId: string;
    bookmarkCount: number;
    tags: string[];
    name: string;
    username: string;
    email: string;
  };
};

export const LegendaryUserCard = ({ isLoading, data }: Props) => {
  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="w-full gap-4 p-4 relative">
          <Skeleton className="h-5 w-11/12 mb-2" />
          <Skeleton className="h-4 w-[100px]" />
        </CardContent>
      </Card>
    );
  }
  if (!data) return null;
  return (
    <Link
      to={`/explore/${data.username}`}
      className="shadow-none aspect-auto break-inside-avoid relative overflow-hidden block">
      <Card className="shadow-none">
        <CardContent className="flex items-center gap-4 p-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold tracking-tight">{data.name}</h3>
              {data.username && <h3 className="text-sm tracking-tight">(@{data.username})</h3>}
            </div>
            {data.bookmarkCount && (
              <Badge variant={'outline'}>
                <Bookmark size={12} className="mr-2" /> Total {data.bookmarkCount}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
