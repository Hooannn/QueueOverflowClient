import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RootRoute() {
  const { t } = useTranslation();
  document.title = `${t('home')} - 7FF`;

  return <div>RootRoute</div>;
}
