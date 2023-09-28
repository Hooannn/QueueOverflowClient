import React, { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout(props: PropsWithChildren) {
  return <Outlet />;
}
