import { Card, CardContent, Badge } from '@extension/ui';

export const CardBookmarkSite = () => {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="aspect-video bg-muted rounded-lg w-[100px]" />
        <div>
          <Badge>Technology</Badge>
          <h3 className="mt-2 text-sm font-semibold tracking-tight">What is the future of web development?</h3>
        </div>
      </CardContent>
    </Card>
  );
};
