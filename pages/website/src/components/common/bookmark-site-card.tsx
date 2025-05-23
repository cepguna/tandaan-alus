import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { Card, CardContent, Badge } from '@extension/ui';
import { Bookmark, Share2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  data?: Doc<'sites'> & {
    tags?: string[];
    isPrivate: boolean;
  };
  isLoading?: boolean;
  hideAddTags?: boolean;
  bookmarkCount?: number;
};

export const BookmarkSiteCard = ({ data, bookmarkCount, isLoading, hideAddTags }: Props) => {
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
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          {!hideAddTags && (
            <Badge role="button" variant={!data.isPrivate ? 'destructive' : 'default'} className="mb-2 z-10">
              {data.isPrivate ? 'Private' : 'Public'}
            </Badge>
          )}
          <h3 className="mb-2 text-sm font-semibold tracking-tight">{data.title ?? '-'}</h3>
          <div className="flex items-center gap-3">
            {bookmarkCount && (
              <Badge variant={'outline'}>
                <Bookmark size={12} className="mr-2" /> {bookmarkCount}
              </Badge>
            )}
            {!hideAddTags && (
              <div onPointerDownCapture={e => e.stopPropagation()}>
                <Badge
                  role="button"
                  onClick={() => {
                    toast('add');
                  }}
                  className="cursor-pointer z-10">
                  Add Tag
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div onPointerDownCapture={e => e.stopPropagation()}>
          <Share2
            role="button"
            className="z-10"
            onClick={e => {
              toast('copy');
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
