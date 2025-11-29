import { NavLink } from 'react-router-dom';
import { Search } from 'lucide-react';
// Import reusable buttons for login signup later

const Navbar = () => {
  const navLinks = [
    { id: 'Home', to: '/' },
    { id: 'Directory', to: '/directory' },
    { id: 'About', to: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full h-20 bg-nav-bg border-b border-nav-stroke z-50">
      <div className="mx-auto px-20 h-full flex items-center">
        <div className="flex shrink-0 mr-20">
          <h1 className="text-text-logo font-bold text-4xl">Caritas</h1>
        </div>

        <div className="relative flex-1 flex items-center px-6">
          <input
            type="search"
            placeholder="What are you looking for?"
            aria-label="Search"
            className="w-full py-2 px-3 rounded-2xl bg-white border border-nav-stroke focus:outline-none focus:border-accent-green"
          />
          <Search className="absolute right-10 text-text-muted" />
        </div>

        <div className="flex items-center gap-6 text-xl font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.to}
              className={({ isActive }) =>
                'px-3 ' +
                (isActive
                  ? 'text-text-green underline hover:opacity-85'
                  : 'hover:opacity-85')
              }
            >
              {link.id}
            </NavLink>
          ))}
        </div>

        {/* Temp login, signup buttons - make reusable later and add navigation */}
        <div className="flex items-center gap-6 ml-16">
          <button className="text-xl font-semibold bg-white py-2 px-3 rounded-lg border border-accent-green hover:opacity-85">
            Login
          </button>

          <button className="text-xl font-medium bg-accent-green py-2 px-3 rounded-lg text-white border border-accent-green hover:opacity-90">
            Signup
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
