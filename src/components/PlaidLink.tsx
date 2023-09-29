import React, { useEffect, useContext, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import { Products } from 'plaid';
import { Button } from './ui/button';
import usePlaid from '../services/plaid';

const Link = () => {
  const [linkToken, setLinkToken] = useState('');
  const { getLinkToken, exchangePublicToken } = usePlaid();

  const onSuccess = async (public_token: string, metadata: any) => {
    console.log('res from linked account', { public_token, metadata });
    const res = await exchangePublicToken.mutateAsync({ publicToken: public_token, accounts: metadata.accounts });
    console.log('res from exchangePublicToken', res.data);
  };

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);
  if (window.location.href.includes('?oauth_state_id=')) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  useEffect(() => {
    if (linkToken) {
      open();
    }
  }, [linkToken, ready, open]);

  const startPlaidFlow = async () => {
    const res = await getLinkToken.mutateAsync();
    const linkToken = res.data?.data?.link_token;
    setLinkToken(linkToken);
  };

  return (
    <Button
      disabled={getLinkToken.isLoading}
      type="button"
      onClick={e => {
        e.preventDefault();
        startPlaidFlow();
      }}
    >
      Launch Link
    </Button>
  );
};

export default Link;
