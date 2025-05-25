import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Card,
  CardContent,
  Badge,
  cn,
  Skeleton,
  CommandInput,
  CommandEmpty,
} from '@extension/ui';
import { Bookmark, Share2, Check, ChevronsUpDown, X, Copy, MessageCircle, Send, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import { TAGS } from '@src/lib/constants/tags';
import { useUpdateSites } from '@src/hooks/use-services/use-sites';

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
  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="w-full gap-4 p-4 relative">
          <Skeleton className="h-5 w-11/12 mb-2" />
          <Skeleton className="h-4 w-[200px] mb-2" />
          <Skeleton className="h-3 w-[100px] mb-3" />
          <Skeleton className="h-3 w-[80px] absolute bottom-4 right-4" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Link
      to={data.link}
      target="_blank"
      role="button"
      className="shadow-none aspect-auto break-inside-avoid relative overflow-hidden block">
      <Card className="shadow-none">
        <CardContent className="flex items-start justify-between gap-4 p-4 relative">
          <div>
            {!hideAddTags && (
              <Badge
                role="button"
                variant={!data.isPrivate ? 'destructive' : 'secondary'}
                className="mb-2 absolute bottom-1 right-2"
                aria-label={data.isPrivate ? 'Private site' : 'Public site'}>
                {data.isPrivate ? 'Private' : 'Public'}
              </Badge>
            )}
            <h3 className="text-base font-semibold tracking-tight">{data.title ?? '-'}</h3>
            <p className={cn('text-sm opacity-50 tracking-tight', data.tags || !hideAddTags ? 'mb-4' : '')}>
              {data.link ?? '-'}
            </p>
            <div className="flex items-center flex-wrap gap-1">
              {bookmarkCount && (
                <Badge variant="outline" aria-label={`${bookmarkCount} bookmarks`}>
                  <Bookmark size={12} className="mr-2" /> {bookmarkCount}
                </Badge>
              )}
              {!hideAddTags && <AddTags siteId={data._id} currentTags={data.tags || []} />}
              {hideAddTags &&
                data.tags?.map(tag => (
                  <Badge
                    key={`tag-data-${tag}`}
                    variant={'outline'}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                      }
                    }}>
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
          <div>
            <ShareMenu link={data.link} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

type AddTagsProps = {
  siteId: string;
  currentTags: string[];
};

export function AddTags({ siteId, currentTags }: AddTagsProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const { mutateAsync, isPending } = useUpdateSites();

  const handleSelect = async (selectedValue: string) => {
    if (selectedValue === value) {
      setValue('');
      setOpen(false);
      return;
    }

    if (currentTags.includes(selectedValue)) {
      toast.error(`Tag "${selectedValue}" already exists.`);
      setOpen(false);
      return;
    }

    try {
      const updatedTags = [...currentTags, selectedValue];
      await mutateAsync({ id: siteId, tags: updatedTags });
      setValue(selectedValue);
      setOpen(false);
      toast.success(`Tag "${selectedValue}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add tag. Please try again.');
      console.error('Error adding tag:', error);
    }
  };

  const handleRemoveTags = async (selectedValue: string) => {
    try {
      const updatedTags = currentTags.filter(x => x !== selectedValue);
      await mutateAsync({ id: siteId, tags: updatedTags });
      setValue('');
      setOpen(false);
      toast.success(`Tag "${selectedValue}" removed successfully!`);
    } catch (error) {
      toast.error('Failed to remove tag. Please try again.');
      console.error('Error removing tag:', error);
    }
  };

  return (
    <div className="flex items-center flex-wrap gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isPending ? (
            <Badge
              role="combobox"
              aria-expanded={open}
              aria-label="Updating..."
              className="cursor-pointer"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                }
              }}>
              Updating...
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Badge>
          ) : (
            <Badge
              role="combobox"
              aria-expanded={open}
              aria-label="Add or select a tag"
              className="cursor-pointer"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(true);
                }
              }}>
              {'Add Tags'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Badge>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {TAGS.map((tag, i) => (
                  <CommandItem key={`tag-${i}`} value={tag} onSelect={handleSelect}>
                    {tag}
                    <Check className={cn('ml-auto', value === tag ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {currentTags?.map(tag => (
        <Badge
          key={`tag-data-${tag}`}
          variant={'outline'}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveTags(tag);
          }}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRemoveTags(tag);
            }
          }}>
          {tag}
          <X size={13} className="ml-2" />
        </Badge>
      ))}
    </div>
  );
}

type ShareMenuProps = {
  link: string;
};

export function ShareMenu({ link }: ShareMenuProps) {
  const [open, setOpen] = useState(false);

  const handleCopyLink = async () => {
    if (!link) {
      toast.error('No link available to copy.');
      setOpen(false);
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link. Please try again.');
      console.error('Error copying link:', error);
    }
    setOpen(false);
  };

  const handleShareToWhatsApp = () => {
    if (!link) {
      toast.error('No link available to share.');
      setOpen(false);
      return;
    }
    const encodedLink = encodeURIComponent(link);
    window.open(`https://api.whatsapp.com/send?text=${encodedLink}`, '_blank');
    setOpen(false);
  };

  const handleShareToTelegram = () => {
    if (!link) {
      toast.error('No link available to share.');
      setOpen(false);
      return;
    }
    const encodedLink = encodeURIComponent(link);
    window.open(`https://t.me/share/url?url=${encodedLink}`, '_blank');
    setOpen(false);
  };

  const handleShareToTwitter = () => {
    if (!link) {
      toast.error('No link available to share.');
      setOpen(false);
      return;
    }
    const encodedLink = encodeURIComponent(link);
    window.open(`https://twitter.com/intent/tweet?url=${encodedLink}`, '_blank');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Share2
          role="button"
          className="cursor-pointer"
          aria-label="Open share menu"
          tabIndex={0}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={handleCopyLink}>
                <Copy size={16} className="mr-2" />
                Copy Link
              </CommandItem>
              <CommandItem onSelect={handleShareToWhatsApp}>
                <MessageCircle size={16} className="mr-2" />
                Share to WhatsApp
              </CommandItem>
              <CommandItem onSelect={handleShareToTelegram}>
                <Send size={16} className="mr-2" />
                Share to Telegram
              </CommandItem>
              <CommandItem onSelect={handleShareToTwitter}>
                <Twitter size={16} className="mr-2" />
                Share to Twitter
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
