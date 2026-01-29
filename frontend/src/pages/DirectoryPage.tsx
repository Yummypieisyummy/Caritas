// Import Directory components and files here
import Filters from '../components/directory/Filters';
import VolunteerCard from '../components/directory/VolunteerCard';

const DirectoryPage = () => {
  return (
    <main data-testid="directory-page-container" className="flex min-h-screen">
      {/* Left sidebar filters */}
      <Filters />

      {/* Right content */}
      <section className="ml-80 flex flex-col flex-1 p-6">
        <header className="mb-6 ">
          <h1 className="font-medium text-3xl">Local Charity Posts</h1>
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
