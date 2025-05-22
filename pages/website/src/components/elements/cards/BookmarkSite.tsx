import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { Card, CardContent, Badge } from '@extension/ui';
import { Link } from 'react-router-dom';

type Props = {
  data?: Doc<'sites'>;
  isLoading?: boolean;
};

export const CardBookmarkSite = ({ data, isLoading }: Props) => {
  const handleVisit = () => {
    window.open(data?.link, '_blank');
  };

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-[100px]">
            <div className="aspect-video bg-muted rounded-lg w-[100px]" />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold tracking-tight">Loading...</h3>
            <Badge className="cursor-pointer">Loading...</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card
      onClick={handleVisit}
      role="button"
      className="shadow-none aspect-auto break-inside-avoid relative overflow-hidden">
      <CardContent className="flex items-center gap-4 p-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold tracking-tight">{data.title ?? '-'}</h3>
          <Badge className="cursor-pointer">Add Tag</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
