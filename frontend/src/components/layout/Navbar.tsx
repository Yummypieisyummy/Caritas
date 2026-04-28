import Button from '../ui/Button';
import Input from '../ui/Input';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFilters } from '../../contexts/FiltersContext';
import { Search, Building2, User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, org, logout } = useAuth();
  const { filters, setSearchQuery } = useFilters();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'Home', to: '/' },
    { id: 'Directory', to: '/directory' },
    { id: 'About', to: '/about' },
  ];

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/directory');
    setIsSearchOpen(false);
  };

  const renderSearchInput = (id: string, buttonSize: 'sm' | 'md' = 'md') => (
    <>
      <Input
        type="search"
        id={id}
        placeholder="Find charities, causes, or volunteer events..."
        className="rounded-full"
        value={filters.searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <Button
        type="submit"
        variant="icon"
        size={buttonSize}
        className="absolute right-2"
        aria-label="Search posts"
      >
        <Search className="text-text-muted/80 w-5 h-5 hover:opacity-100 group-hover:text-accent-green transition-colors" />
      </Button>
    </>
  );

  return (
    <nav className="fixed top-0 w-full h-20 bg-nav-bg border-b border-nav-stroke z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Button
            as="link"
            to="/"
            variant="icon"
            // !p-0 strips the button's default padding so it aligns flush left with your layout
            className="text-3xl font-bold tracking-tight text-text-logo"
          >
            {/* Wrapping it in an h1 is best practice for screen readers and SEO */}
            <h1 className="m-0 leading-none">Caritas</h1>
          </Button>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Button
                as="link"
                variant="textOnly"
                size="md"
                key={link.id}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-text-green'
                    : 'text-text-muted hover:text-text-base transition-colors duration-200 hover:opacity-100'
                }
              >
                {link.id}
              </Button>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center relative w-full group"
          >
            {renderSearchInput('desktop-post-search')}
          </form>
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
                size="sm"
                to={'/dashboard/overview'}
                variant="textOnly"
              >
                <User
                  size={36}
                  className="bg-accent-green text-white p-2 rounded-full"
                />
              </Button>

              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-right gap-2">
          {/* Mobile Search Button */}
          <div className="flex lg:hidden">
            <Button
              as="button"
              variant="icon"
              onClick={() => {
                setIsSearchOpen((prev) => !prev);
                if (isMenuOpen) setIsMenuOpen(false);
              }}
            >
              {isSearchOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="icon"
            className="md:hidden"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden bg-nav-bg border-b border-nav-stroke px-6 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center relative group"
          >
            {renderSearchInput('mobile-post-search', 'sm')}
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0  bg-nav-bg border-b border-nav-stroke shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Button
                as="link"
                variant="textOnly"
                size="md"
                key={link.id}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'text-text-green'
                    : 'text-text-muted hover:text-text-base transition-colors duration-200'
                }
              >
                {link.id}
              </Button>
            ))}

            <div className="border-t border-nav-stroke pt-4">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Button as="link" to="/login" variant="secondary" size="md">
                    Org Login
                  </Button>
                  <Button as="link" to="/signup" variant="primary" size="md">
                    <Building2 className="w-4 h-4 mr-2" />
                    For Organizations
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    as="link"
                    to={org?.verified ? `/organization/${org.id}` : '/'} // Make this a protected route - verfify access token middleware -> allow nav
                    variant="secondary"
                    size="md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                  </Button>

                  <Button
                    as="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
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
