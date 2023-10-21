import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useAuth from '../../services/auth';
import { Icons } from '../../components/icons';
import { AuthFlowType } from '../../slices/auth-flow.slice';
import { useState } from 'react';

interface PasscodeDialogProps {
  isLoading: boolean;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onFinished: (isRenew: boolean) => void;
}

export default function PasscodeDialog(props: PasscodeDialogProps) {
  const [isRenewPassword, setIsRenewPassword] = useState(false);
  const { passcode, updatePasscode, authType, renewPassword } = useAuth();
  const isSigningIn = authType === AuthFlowType.SignIn;
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={val => {
        setIsRenewPassword(false);
        props.onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enter your passcode</DialogTitle>
          <DialogDescription>A passcode with 6-digits was sent to your registered email</DialogDescription>
        </DialogHeader>
        <div className="grid py-2">
          <Input
            id="passcode"
            value={passcode}
            onChange={e => updatePasscode(e.target.value)}
            placeholder="000000"
            type="number"
            disabled={props.isLoading}
            className="col-span-3 h-14 text-3xl"
          />
        </div>
        <DialogFooter>
          {isSigningIn && (
            <Button
              variant={'secondary'}
              disabled={renewPassword.isLoading}
              onClick={e => {
                e.preventDefault();
                renewPassword.mutateAsync().then(() => {
                  setIsRenewPassword(true);
                });
              }}
            >
              {renewPassword.isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Re-new password
            </Button>
          )}
          <Button
            disabled={props.isLoading}
            onClick={e => {
              e.preventDefault();
              props.onFinished(isRenewPassword);
            }}
          >
            {props.isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
