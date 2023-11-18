import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
  TelegramIcon,
  TelegramShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  EmailIcon,
  EmailShareButton,
} from 'react-share';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/use-toast';

export default function SharedDialog({
  shareUrl,
  title,
  isOpen,
  onOpenChange,
}: {
  title: string;
  shareUrl: string;
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const copy = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: 'Success',
          description: 'Copied to clipboard',
        });
      })
      .catch(error => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error.message ?? 'Failed to copy to clipboard',
        });
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
          <div className="pt-4 flex gap-2 items-center justify-center">
            <Input onClick={copy} className="h-12" readOnly value={shareUrl} />
            <Button onClick={copy} className="h-12" size={'lg'}>
              Copy
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={50} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={50} round />
            </TwitterShareButton>
            <TelegramShareButton url={shareUrl} title={title}>
              <TelegramIcon size={50} round />
            </TelegramShareButton>
            <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={50} round />
            </LinkedinShareButton>
            <RedditShareButton url={shareUrl} title={title} windowWidth={660} windowHeight={460}>
              <RedditIcon size={50} round />
            </RedditShareButton>
            <EmailShareButton url={shareUrl} subject={title}>
              <EmailIcon size={50} round />
            </EmailShareButton>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
