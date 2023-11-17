import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { PickerInline, PickerOverlay } from 'filestack-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

export default function MAvatar({ editable = false, size = 32 }: { editable?: boolean; size?: number }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const name = useMemo(() => {
    if (!user?.first_name && !user?.last_name) return `User ${user?.id}`;
    return `${user?.first_name} ${user?.last_name}`;
  }, [user]);
  const shortName = name[0] + name[1];
  const [shouldOpenPicker, setShouldOpenPicker] = useState(false);
  return (
    <>
      <Avatar
        onClick={() => {
          if (editable) setShouldOpenPicker(true);
        }}
        className={`w-${size.toString()} h-${size.toString()} mx-auto`}
      >
        <AvatarImage src={user?.avatar} alt={shortName} />
        <AvatarFallback>{shortName}</AvatarFallback>
      </Avatar>
      <Dialog
        open={shouldOpenPicker}
        onOpenChange={val => {
          setShouldOpenPicker(val);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload your image</DialogTitle>
          </DialogHeader>
          <PickerInline
            onUploadDone={res => {
              console.log(res);
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
    </>
  );
}
