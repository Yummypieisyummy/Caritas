import { Lock } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const DashboradSidebar = () => {
  const { org, logout } = useAuth();
  const isOrgVerified = org?.verified === true;
  const publicProfilePath = org?.id ? `/organization/${org.id}` : '/directory';

  const sidebarLinks = [
    { id: 'Overview', to: '/dashboard/overview', requiresVerifiedOrg: false },
    { id: 'Manage Posts', to: '/dashboard/posts', requiresVerifiedOrg: true },
    {
      id: 'Create Post',
      to: '/dashboard/posts/create',
      requiresVerifiedOrg: true,
    },
    {
      id: 'Org Profile',
      to: '/dashboard/profile',
      requiresVerifiedOrg: false,
    },
    { id: 'Team Access', to: '/dashboard/team', requiresVerifiedOrg: true },
    { id: 'Settings', to: '/dashboard/settings', requiresVerifiedOrg: false },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-40 w-full flex-col gap-3 bg-text-logo p-3 md:h-screen md:w-80 md:justify-between md:p-6">
      <div className="flex items-center justify-between gap-3 md:block">
        <Button
          as="link"
          to="/"
          variant="textOnly"
          className="justify-start text-2xl font-semibold text-white md:text-4xl"
        >
          Caritas
        </Button>

        <footer className="flex items-center gap-2 md:hidden">
          <Button
            as="link"
            to={publicProfilePath}
            variant="textOnly"
            size="sm"
            className="text-white"
          >
            Profile
          </Button>
          <Button
            variant="textOnly"
            size="sm"
            className="text-white"
            onClick={logout}
          >
            Logout
          </Button>
        </footer>
      </div>

      <section className="app-scrollbar flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-6 md:overflow-visible md:pb-0">
        {sidebarLinks.map((link) => {
          const isLocked = link.requiresVerifiedOrg && !isOrgVerified;

          return (
            <NavLink
              key={link.id}
              to={link.to}
              aria-disabled={isLocked}
              tabIndex={isLocked ? -1 : undefined}
              onClick={(event) => {
                if (isLocked) event.preventDefault();
              }}
              className={({ isActive }) =>
                [
                  'rounded-xl inline-flex shrink-0 items-center justify-between gap-3 whitespace-nowrap p-3 text-sm font-medium transition-opacity duration-200 md:p-4 md:text-lg',
                  isLocked
                    ? 'cursor-not-allowed text-white/35 hover:opacity-100'
                    : 'cursor-pointer text-white hover:opacity-100 hover:bg-white/10',
                  isActive && !isLocked ? 'bg-white/10' : '',
                ].join(' ')
              }
            >
              <span>{link.id}</span>
              {isLocked && <Lock className="h-4 w-4" aria-hidden="true" />}
            </NavLink>
          );
        })}
      </section>

      <footer className="hidden flex-col gap-4 md:flex">
        <Button
          as="link"
          to={publicProfilePath}
          variant="textOnly"
          size="md"
          className="text-white"
        >
          View Public Profile
        </Button>
        <Button
          variant="textOnly"
          size="md"
          className="text-white"
          onClick={logout}
        >
          Logout
        </Button>
      </footer>
    </aside>
  );
};

export default DashboradSidebar;
