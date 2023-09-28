import { cn } from '../../utils';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Overview
      </a>
      <a href="/transactions" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Transactions
      </a>
      <a href="/wallets" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Wallets
      </a>
      <a href="/settings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Settings
      </a>
    </nav>
  );
}
