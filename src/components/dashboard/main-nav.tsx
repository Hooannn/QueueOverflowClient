import { useEffect, useMemo } from 'react';
import { cn } from '../../utils';
import { useLocation, useNavigate } from 'react-router-dom';
export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation();
  const navigate = useNavigate();

  const ROUTES = [
    {
      path: '/',
      name: 'Dashboard',
    },
    {
      path: '/explore',
      name: 'Explore',
    },
    {
      path: '/notifications',
      name: 'Notifications',
    },
    {
      path: '/settings/profile',
      name: 'Settings',
    },
  ];

  const activePath = useMemo(() => location.pathname, [location]);

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <div onClick={() => navigate('/')} className="h-12 hover:bg-slate-100 p-2 rounded-lg cursor-pointer transition">
        <img src="/logo-full.png" className="object-contain h-full" />
      </div>
      {ROUTES.map(route => (
        <a
          key={route.path}
          onClick={() => navigate(route.path)}
          className={`cursor-pointer text-sm font-medium transition-colors hover:text-primary ${
            activePath === route.path ? '' : 'text-muted-foreground'
          }`}
        >
          {route.name}
        </a>
      ))}
    </nav>
  );
}
