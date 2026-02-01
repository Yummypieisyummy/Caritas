import { useState } from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Building2, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, org, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'Home', to: '/' },
    { id: 'Directory', to: '/directory' },
    { id: 'About', to: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full h-20 bg-nav-bg border-b border-nav-stroke z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-text-logo font-bold text-3xl tracking-tight">
            Caritas
          </h1>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Button
                as="link"
                variant="textOnly"
                key={link.id}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-text-green font-medium"
                    : "text-text-muted hover:text-text-base font-medium transition-colors duration-200 hover:opacity-100"
                }
              >
                {link.id}
              </Button>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="flex items-center relative w-full">
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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex justify-end items-center gap-3 max-w-[280px]">
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
              <Button
                as="link"
                to={org?.verified ? `/organization/${org.id}` : "/"}
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

        <div className="flex items-right gap-2">
          {/* Mobile Search Button */}
          <div className="flex  lg:hidden">
            <Button
              as="button"
              variant="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="w-6 h-6 text-text-base" />
              ) : (
                <Search className="w-6 h-6 text-text-base" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            as="button"
            variant="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-text-base" />
            ) : (
              <Menu className="w-6 h-6 text-text-base" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden bg-nav-bg border-b border-nav-stroke px-6 py-3">
          <div className="flex items-center relative">
            <input
              type="search"
              placeholder="Find charities, causes, or volunteer events..."
              aria-label="Search"
              className="bg-white border-2 mr-4 border-nav-stroke rounded-full px-4 py-2.5 w-full outline-none transition-all duration-200 focus:border-accent-green focus:shadow-sm placeholder:text-text-muted hover:border-filter-stroke"
            />
            <Button as="button" variant="icon">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/80 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-nav-bg border-b border-nav-stroke shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Button
                as="link"
                variant="textOnly"
                key={link.id}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-text-green font-medium text-left"
                    : "text-text-muted hover:text-text-base font-medium transition-colors duration-200 text-left"
                }
              >
                {link.id}
              </Button>
            ))}

            <div className="border-t border-nav-stroke pt-4">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Button
                    as="link"
                    to="/login"
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    Org Login
                  </Button>
                  <Button
                    as="link"
                    to="/signup"
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    For Organizations
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    as="link"
                    to={org?.verified ? `/organization/${org.id}` : "/"}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>

                  <Button
                    as="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full font-medium"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
