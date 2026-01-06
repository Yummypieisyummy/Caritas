import Filters from '../components/directory/Filters';
import orgData from '../components/directory/VolunteerCard.tsx';
import { useLocation, useParams } from 'react-router-dom';

const OrganizationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const org = location.state?.org || null;
  return (
    <main className="flex min-h-[calc(100vh-5rem)]">
      {/* Left sidebar filters */}
      <Filters />

      {/* Right content */}
      <section className="ml-80 flex flex-col flex-1 px-6 py-4">
        <div className="m-4 p-6 flex flex-col bg-white rounded-xl drop-shadow-md">
          <section className="row-span-1 flex flex-row flex-1 justify-center bg-gray-200">
            <span className="font-medium text-m m-5">Photo Banner</span>
          </section>
          <section className="row-span-2 m-4 flex flex-row justify-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
+              <img src="/path/to/image.jpg" alt="Organization" className="w-full h-full object-cover" />
+           </div>
            <span className="font-medium text-3xl ml-6 mt-4">{org?.name ?? id ?? 'Organization'}</span>
          </section>
        </div>
      </section>
    </main>
  );
};

export default OrganizationPage;
