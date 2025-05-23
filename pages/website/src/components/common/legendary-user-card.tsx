import { Card, CardContent, Badge } from '@extension/ui';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  isLoading?: boolean;
  data?: {
    userId: string;
    bookmarkCount: number;
    tags: string[];
    name: string;
    email: string;
  };
};

export const LegendaryUserCard = ({ isLoading, data }: Props) => {
  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="aspect-video bg-muted rounded-lg w-[100px]" />
          <div>
            <Badge>Loading...</Badge>
            <h3 className="mt-2 text-sm font-semibold tracking-tight">Loading....</h3>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!data) return null;
  return (
    <Link to={`/explore/${data.userId}`}>
      <Card className="shadow-none">
        <CardContent className="flex items-center gap-4 p-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">{data.name}</h3>
            <h3 className="mb-2 text-sm font-semibold tracking-tight">{data.email}</h3>
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
