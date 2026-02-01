import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Building2, User } from 'lucide-react'; // Added icons for clarity

const Navbar = () => {
  const { user, org, logout } = useAuth();

  const navLinks = [
    { id: 'Home', to: '/' },
    { id: 'Directory', to: '/directory' },
    { id: 'About', to: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full h-20 bg-nav-bg border-b border-nav-stroke z-50">
      <div className="max-w-7xl  mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-text-logo font-bold text-3xl tracking-tight">
            Caritas
          </h1>

          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Button
                as="link"
                variant="textOnly"
                key={link.id}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-text-green font-medium'
                    : 'text-text-muted hover:text-text-base font-medium transition-colors duration-200 hover:opacity-100'
                }
              >
                {link.id}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="flex items-center relative">
            <input
              type="search"
              placeholder="Find charities, causes, or volunteer events..."
              aria-label="Search"
              className="bg-white border-2 border-nav-stroke rounded-full px-4 py-2.5 w-full outline-none transition-all duration-200 focus:border-accent-green focus:shadow-sm placeholder:text-text-muted hover:border-filter-stroke"
            />
            <Button as="button" variant="icon">
              <Search className="absolute right-12 top-1/2 -translate-y-1/2 text-text-muted/80 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 max-w-[280px]">
          {!user ? (
            <>
              <Button as="link" to="/login" variant="secondary" size="sm">
                Org Login
              </Button>
              <Button as="link" to="/signup" variant="primary" size="sm">
                <Building2 className="w-4 h-4 mr-2" />
                For Organizations
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Show Org Name or User when logged in, will want to clean this up later */}
              {/* <div className="flex flex-col items-end mr-2">
                <span className="text-xs text-text-muted">Logged in as</span>
                <span className="text-sm font-semibold">{user.email}</span>
              </div> */}

              <Button
                as="link"
                to={org?.verified ? `/organization/${org.id}` : '/'} // send to 404 page if org not found, or if org is not verified show verification status (pending, approved, rejected).
                variant="textOnly"
              >
                <User
                  size={38}
                  className="bg-accent-green text-white p-2 rounded-full"
                />
              </Button>

              <Button
                as="button"
                variant="secondary"
                size="sm"
                onClick={logout}
                className="font-medium hover"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
