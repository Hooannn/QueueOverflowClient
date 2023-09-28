import { FC } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import React from 'react';
import { WalletCard } from '../../components/wallets/WalletCard';
import { cn } from '../../utils';
import Link from '../../components/PlaidLink';

function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-center [&>div]:w-full', className)} {...props} />;
}
export default function WalletsPage() {
  return (
    <>
      <Link></Link>
      <div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-3 xl:grid-cols-4">
        <Container>
          <WalletCard />
        </Container>
      </div>
    </>
  );
}
