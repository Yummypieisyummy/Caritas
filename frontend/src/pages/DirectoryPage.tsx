// Import Directory components and files here
import { useState } from 'react';
import Filters from '../components/directory/Filters';
import VolunteerCard from '../components/directory/VolunteerCard';
import Button from '../components/ui/Button';

const DirectoryPage = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <main data-testid="directory-page-container" className="flex min-h-screen">

      {/* Mobile filters panel */}
      {isFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsFiltersOpen(false)}
          />
          {/* Filters panel sliding from right */}
          <div className="md:hidden fixed top-20 right-0 bottom-0 w-80 max-w-full bg-white shadow-lg z-50 overflow-y-auto">
            <Filters onClose={() => setIsFiltersOpen(false)} />
          </div>
        </>
      )}

      {/* Desktop sidebar filters */}
      <div className="hidden md:flex fixed top-20 left-0 w-80 bottom-0 bg-gray-100">
        <Filters />
      </div>

      {/* Right content */}
      <section className="md:ml-80 flex flex-col flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="font-semibold text-3xl">Local Charity Posts</h1>

          {/* Mobile filters button */}
          <div className="md:hidden">
            <Button
              as="button"
              variant="primary"
              size="md"
              onClick={() => setIsFiltersOpen((prev) => !prev)}
              className="px-4 py-2"
            >
              {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </header>

        {/* Add filter results summary here */}

        <div className="flex flex-col gap-6">
          {Array.from({ length: 10 }, (_, i) => (
            <VolunteerCard key={i} /> // For testing
          ))}
        </div>
      </section>
    </main>
  );
};

export default DirectoryPage;
