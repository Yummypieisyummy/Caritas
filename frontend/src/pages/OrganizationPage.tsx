import Filters from '../components/directory/Filters';
import orgData from '../components/directory/VolunteerCard.tsx';
import { useParams } from 'react-router-dom';

const OrganizationPage = () => {
  const { id } = useParams();
  return (
    <main className="flex min-h-[calc(100vh-5rem)]">
      {/* Left sidebar filters */}
      <Filters />

      {/* Right content */}
      <section className="ml-80 flex flex-col flex-1 px-6 py-4">
        <div className="m-4 p-6 flex bg-white rounded-xl drop-shadow-md">
        </div>
      </section>
    </main>
  );
};

export default OrganizationPage;
