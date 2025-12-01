// Import Directory components and files here
import Filters from '../components/ui/Filters';
import VolunteerCard from '../components/directory/VolunteerCard';

const DirectoryPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-5rem)]">
      {/* Left sidebar filters */}
      <Filters />

      {/* Right content */}
      <section className="flex flex-col flex-1 px-6 py-4">
        <header className="mb-6 ">
          <h1 className="font-medium text-3xl">Local Charity Posts</h1>
        </header>

        {/* Add filter results summary here */}

        <div className="flex flex-col gap-6">
          <VolunteerCard />
          <VolunteerCard />
          <VolunteerCard />
        </div>
      </section>
    </main>
  );
};

export default DirectoryPage;
