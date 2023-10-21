import { cn } from '../../utils';
import { Icons } from '../../components/icons';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import useAuth from '../../services/auth';
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  onFinished: () => void;
  onGithubBtnClicked: () => void;
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { email, updateEmail } = useAuth();
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    props.onFinished();
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={e => {
                e.preventDefault();
                updateEmail(e.target.value);
              }}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={props.isLoading}
            />
          </div>
          <Button disabled={props.isLoading}>
            {props.isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button onClick={() => props.onGithubBtnClicked()} variant="outline" type="button" disabled={props.isLoading}>
        {props.isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.gitHub className="mr-2 h-4 w-4" />} Github
      </Button>
    </div>
  );
}
