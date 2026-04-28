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
    <aside className="fixed h-screen w-80 flex flex-col bg-text-logo p-6 justify-between">
      <Button
        as="link"
        to="/"
        variant="textOnly"
        className="text-4xl font-semibold text-white justify-start"
      >
        Caritas
      </Button>

      <section className="flex flex-col gap-6">
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
                  'rounded-xl inline-flex items-center justify-between p-4 text-lg font-medium transition-opacity duration-200',
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

      <footer className="flex flex-col gap-4">
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
