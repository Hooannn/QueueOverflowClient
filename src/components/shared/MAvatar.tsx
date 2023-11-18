import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { PickerInline, PickerOverlay } from 'filestack-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';
import useUsers from '../../services/users';
import { Icons } from '../icons';

export default function MAvatar({ editable = false, size = 32, className }: { editable?: boolean; size?: number; className: string }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const name = useMemo(() => {
    if (!user?.first_name && !user?.last_name) return `User ${user?.id}`;
    return `${user?.first_name} ${user?.last_name}`;
  }, [user]);
  const shortName = name[0] + name[1];
  const [shouldOpenPicker, setShouldOpenPicker] = useState(false);
  const { updateProfileMutation } = useUsers();
  const loading = updateProfileMutation.isLoading;
  return (
    <div className={'relative ' + className}>
      <Avatar
        onClick={() => {
          if (editable && !loading) setShouldOpenPicker(true);
        }}
        className={className + ' ' + `relative ${editable && !loading ? 'transition cursor-pointer hover:opacity-80' : ''}`}
      >
        <AvatarImage src={user?.avatar} alt={shortName} />
        <AvatarFallback>{shortName}</AvatarFallback>
        {loading && (
          <div className="absolute w-full h-full flex items-center justify-center bg-white/[.09]">
            <Icons.spinner className="animate-spin w-8 h-8" />
          </div>
        )}
      </Avatar>
      {editable && (
        <div className="absolute bottom-0 right-0">
          <Button
            disabled={loading}
            onClick={e => {
              e.stopPropagation();
              setShouldOpenPicker(true);
            }}
            size={'icon'}
            className="rounded-full"
          >
            <Pencil size={20} />
          </Button>
        </div>
      )}
      <Dialog
        open={shouldOpenPicker}
        onOpenChange={val => {
          setShouldOpenPicker(val);
        }}
      >
        <DialogContent className="p-0">
          <DialogHeader className="px-4 pt-6">
            <DialogTitle>Upload your image</DialogTitle>
          </DialogHeader>
          <PickerInline
            pickerOptions={{ accept: ['image/*'] }}
            onUploadDone={(res: any) => {
              const url = res.filesUploaded[0].url;
              setShouldOpenPicker(false);
              updateProfileMutation.mutateAsync({ avatar: url });
            }}
            apikey={import.meta.env.VITE_FILESTACK_APIKEY}
          />
          {/*
          <DialogFooter>
            <Button onClick={() => setShouldOpenPicker(false)} variant={'secondary'} size="lg">
              Cancel
            </Button>
            <Button size="lg">Confirm</Button>
          </DialogFooter>
          */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
