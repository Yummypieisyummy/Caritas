import Button from '../ui/Button';

const DashboradSidebar = () => {
  const sidebarLinks = [
    { id: 'Overview', to: '/dashboard/overview' },
    { id: 'My Posts', to: '/dashboard/posts' },
    { id: 'Org Porfile', to: '/dashboard/profile' },
    { id: 'Team Access', to: '/dashboard/team' },
    { id: 'Settings', to: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed h-screen w-80 flex flex-col bg-text-logo p-6 justify-between">
      <h2 className="text-4xl font-semibold text-white">Caritas</h2>

      <section className="flex flex-col gap-6">
        {sidebarLinks.map((link) => (
          <Button
            key={link.id}
            as="link"
            to={link.to}
            variant="textOnly"
            size="lg"
            className={({ isActive }) =>
              isActive
                ? 'text-white hover:opacity-100 bg-white/10 py-4'
                : 'text-white hover:opacity-100 hover:bg-white/10 py-4'
            }
          >
            {link.id}
          </Button>
        ))}
      </section>

      <footer className="flex flex-col gap-4">
        <Button
          as="link"
          to="/organization/:id"
          variant="textOnly"
          size="md"
          className="text-white"
        >
          View Public page
        </Button>
        <Button
          as="link"
          to="/organization/:id"
          variant="textOnly"
          size="md"
          className="text-white"
        >
          Logout
        </Button>
      </footer>
    </aside>
  );
};

export default DashboradSidebar;
